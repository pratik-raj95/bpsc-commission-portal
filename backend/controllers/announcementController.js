const Announcement = require('../models/Announcement');

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
exports.getAnnouncements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = { status: 'published' };
    
    if (req.query.category) {
      query.category = req.query.category;
    }
    
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    query.$or = [
      { expiryDate: { $gte: new Date() } },
      { expiryDate: { $exists: false } }
    ];

    const announcements = await Announcement.find(query)
      .populate('createdBy', 'fullName')
      .sort({ isFeatured: -1, order: 1, publishDate: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Announcement.countDocuments(query);

    res.json({
      success: true,
      count: announcements.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
exports.getAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id)
      .populate('createdBy', 'fullName');

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    announcement.views += 1;
    await announcement.save();

    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new announcement
// @route   POST /api/announcements
// @access  Private (Admin)
exports.createAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, status, publishDate, expiryDate, isFeatured, order } = req.body;

    const announcement = await Announcement.create({
      title,
      content,
      category,
      priority,
      status: status || 'published',
      publishDate: publishDate || Date.now(),
      expiryDate,
      createdBy: req.user.id,
      isFeatured,
      order
    });

    await announcement.populate('createdBy', 'fullName');

    res.status(201).json({
      success: true,
      announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private (Admin)
exports.updateAnnouncement = async (req, res) => {
  try {
    const { title, content, category, priority, status, publishDate, expiryDate, isFeatured, order } = req.body;

    let announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      { title, content, category, priority, status, publishDate, expiryDate, isFeatured, order },
      { new: true, runValidators: true }
    ).populate('createdBy', 'fullName');

    res.json({
      success: true,
      announcement
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private (Admin)
exports.deleteAnnouncement = async (req, res) => {
  try {
    const announcement = await Announcement.findById(req.params.id);

    if (!announcement) {
      return res.status(404).json({
        success: false,
        message: 'Announcement not found'
      });
    }

    await announcement.deleteOne();

    res.json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get announcement statistics
// @route   GET /api/announcements/stats
// @access  Private (Admin)
exports.getAnnouncementStats = async (req, res) => {
  try {
    const totalAnnouncements = await Announcement.countDocuments();
    const publishedAnnouncements = await Announcement.countDocuments({ status: 'published' });
    const draftAnnouncements = await Announcement.countDocuments({ status: 'draft' });
    const archivedAnnouncements = await Announcement.countDocuments({ status: 'archived' });

    const byCategory = await Announcement.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } }
    ]);

    const byPriority = await Announcement.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    const totalViews = await Announcement.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalAnnouncements,
        publishedAnnouncements,
        draftAnnouncements,
        archivedAnnouncements,
        byCategory,
        byPriority,
        totalViews: totalViews[0]?.total || 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get featured announcements
// @route   GET /api/announcements/featured
// @access  Public
exports.getFeaturedAnnouncements = async (req, res) => {
  try {
    const announcements = await Announcement.find({ 
      status: 'published',
      isFeatured: true,
      $or: [
        { expiryDate: { $gte: new Date() } },
        { expiryDate: { $exists: false } }
      ]
    })
      .populate('createdBy', 'fullName')
      .sort({ order: 1, publishDate: -1 })
      .limit(5);

    res.json({
      success: true,
      count: announcements.length,
      announcements
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
