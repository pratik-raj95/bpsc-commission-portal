const Document = require('../models/Document');
const path = require('path');
const fs = require('fs');

// @desc    Get all documents
// @route   GET /api/documents
// @access  Private
exports.getDocuments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'active' };
    
    // Filter by category
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    // Non-admin users can only see public documents or their own uploads
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') {
      query.$or = [
        { isPublic: true },
        { uploadedBy: req.user.id }
      ];
    }

    const documents = await Document.find(query)
      .populate('uploadedBy', 'fullName')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Document.countDocuments(query);

    res.json({
      success: true,
      count: documents.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      documents
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single document
// @route   GET /api/documents/:id
// @access  Private
exports.getDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id)
      .populate('uploadedBy', 'fullName');

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    res.json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Upload document
// @route   POST /api/documents
// @access  Private (Admin)
exports.uploadDocument = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a file'
      });
    }

    const { title, description, category, department, tags, isPublic } = req.body;

    const document = await Document.create({
      title: title || req.file.originalname,
      description,
      category,
      department,
      tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
      isPublic: isPublic === 'true',
      uploadedBy: req.user.id,
      file: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      }
    });

    await document.populate('uploadedBy', 'fullName');

    res.status(201).json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update document
// @route   PUT /api/documents/:id
// @access  Private (Admin)
exports.updateDocument = async (req, res) => {
  try {
    const { title, description, category, department, tags, isPublic, status } = req.body;

    let document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    document = await Document.findByIdAndUpdate(
      req.params.id,
      { title, description, category, department, tags, isPublic, status },
      { new: true, runValidators: true }
    ).populate('uploadedBy', 'fullName');

    res.json({
      success: true,
      document
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete document
// @route   DELETE /api/documents/:id
// @access  Private (Admin)
exports.deleteDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Delete file from filesystem
    if (document.file && document.file.path) {
      const filePath = path.join(__dirname, '..', document.file.path);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await document.deleteOne();

    res.json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Download document
// @route   GET /api/documents/:id/download
// @access  Private
exports.downloadDocument = async (req, res) => {
  try {
    const document = await Document.findById(req.params.id);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Check access rights
    if (!document.isPublic && 
        document.uploadedBy.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to download this document'
      });
    }

    const filePath = path.join(__dirname, '..', document.file.path);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Increment download count
    document.downloadCount += 1;
    await document.save();

    res.download(filePath, document.file.originalName);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get document statistics
// @route   GET /api/documents/stats
// @access  Private (Admin)
exports.getDocumentStats = async (req, res) => {
  try {
    const totalDocuments = await Document.countDocuments({ status: 'active' });
    
    const byCategory = await Document.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const byDepartment = await Document.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: '$department', count: { $sum: 1 } } }
    ]);

    // Get total downloads
    const totalDownloads = await Document.aggregate([
      { $match: { status: 'active' } },
      { $group: { _id: null, total: { $sum: '$downloadCount' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalDocuments,
        byCategory,
        byDepartment,
        totalDownloads: totalDownloads[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
