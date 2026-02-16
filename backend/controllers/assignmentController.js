const Assignment = require('../models/Assignment');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Private
exports.getAssignments = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // If employee, show only their assignments
    if (req.user.role === 'employee') {
      query.assignedTo = req.user.id;
    }
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by priority
    if (req.query.priority) {
      query.priority = req.query.priority;
    }
    
    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    const assignments = await Assignment.find(query)
      .populate('assignedTo', 'fullName email department designation')
      .populate('assignedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Assignment.countDocuments(query);

    res.json({
      success: true,
      count: assignments.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      assignments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single assignment
// @route   GET /api/assignments/:id
// @access  Private
exports.getAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id)
      .populate('assignedTo', 'fullName email department designation phone')
      .populate('assignedBy', 'fullName email department designation');

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Private (Admin)
exports.createAssignment = async (req, res) => {
  try {
    const { title, description, assignedTo, department, priority, dueDate } = req.body;

    const assignment = await Assignment.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      department,
      priority,
      dueDate,
      status: 'pending'
    });

    await assignment.populate('assignedTo', 'fullName email');
    await assignment.populate('assignedBy', 'fullName email');

    res.status(201).json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Private
exports.updateAssignment = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    // Check ownership for employees
    if (req.user.role === 'employee' && assignment.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this assignment'
      });
    }

    assignment = await Assignment.findByIdAndUpdate(
      req.params.id,
      { 
        title, 
        description, 
        status, 
        priority, 
        dueDate,
        ...(status === 'completed' && { completedDate: Date.now() })
      },
      { new: true, runValidators: true }
    )
    .populate('assignedTo', 'fullName email')
    .populate('assignedBy', 'fullName email');

    res.json({
      success: true,
      assignment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Private (Admin)
exports.deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    await assignment.deleteOne();

    res.json({
      success: true,
      message: 'Assignment deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Add comment to assignment
// @route   POST /api/assignments/:id/comments
// @access  Private
exports.addComment = async (req, res) => {
  try {
    const { text } = req.body;

    const assignment = await Assignment.findById(req.params.id);

    if (!assignment) {
      return res.status(404).json({
        success: false,
        message: 'Assignment not found'
      });
    }

    assignment.comments.push({
      user: req.user.id,
      text,
      createdAt: Date.now()
    });

    await assignment.save();

    await assignment.populate('comments.user', 'fullName');

    res.json({
      success: true,
      comments: assignment.comments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get assignment statistics
// @route   GET /api/assignments/stats
// @access  Private (Admin)
exports.getAssignmentStats = async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { assignedTo: req.user.id } : {};

    const totalAssignments = await Assignment.countDocuments(query);
    const pendingAssignments = await Assignment.countDocuments({ ...query, status: 'pending' });
    const inProgressAssignments = await Assignment.countDocuments({ ...query, status: 'in_progress' });
    const completedAssignments = await Assignment.countDocuments({ ...query, status: 'completed' });
    
    const overdueAssignments = await Assignment.countDocuments({
      ...query,
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: new Date() }
    });

    const byPriority = await Assignment.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalAssignments,
        pendingAssignments,
        inProgressAssignments,
        completedAssignments,
        overdueAssignments,
        byPriority
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
