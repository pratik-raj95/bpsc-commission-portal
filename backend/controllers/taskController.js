const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // If employee, show only their tasks
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

    const tasks = await Task.find(query)
      .populate('assignedTo', 'fullName email department designation')
      .populate('assignedBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      count: tasks.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single task
// @route   GET /api/tasks/:id
// @access  Private
exports.getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'fullName email department designation phone')
      .populate('assignedBy', 'fullName email department designation');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Private (Admin)
exports.createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, department, priority, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user.id,
      department,
      priority,
      dueDate,
      status: 'pending'
    });

    await task.populate('assignedTo', 'fullName email');
    await task.populate('assignedBy', 'fullName email');

    res.status(201).json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Private
exports.updateTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check ownership for employees
    if (req.user.role === 'employee' && task.assignedTo.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    task = await Task.findByIdAndUpdate(
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
      task
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin)
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    await task.deleteOne();

    res.json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get task statistics
// @route   GET /api/tasks/stats
// @access  Private (Admin)
exports.getTaskStats = async (req, res) => {
  try {
    const query = req.user.role === 'employee' ? { assignedTo: req.user.id } : {};

    const totalTasks = await Task.countDocuments(query);
    const pendingTasks = await Task.countDocuments({ ...query, status: 'pending' });
    const inProgressTasks = await Task.countDocuments({ ...query, status: 'in_progress' });
    const completedTasks = await Task.countDocuments({ ...query, status: 'completed' });
    
    const overdueTasks = await Task.countDocuments({
      ...query,
      status: { $nin: ['completed', 'cancelled'] },
      dueDate: { $lt: new Date() }
    });

    const byPriority = await Task.aggregate([
      { $match: query },
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
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
