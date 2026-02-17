const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');

// @desc    Get all projects
// @route   GET /api/projects
// @access  Private (Admin)
exports.getProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Filter by status
    if (req.query.status) {
      query.status = req.query.status;
    }
    
    // Filter by department
    if (req.query.department) {
      query.department = req.query.department;
    }

    const projects = await Project.find(query)
      .populate('assignedEmployees', 'fullName email department designation profileImage')
      .populate('createdBy', 'fullName email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Project.countDocuments(query);

    res.json({
      success: true,
      count: projects.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single project
// @route   GET /api/projects/:id
// @access  Private
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('assignedEmployees', 'fullName email department designation profileImage phone')
      .populate('createdBy', 'fullName email');

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Get tasks for this project
    const tasks = await Task.find({ project: req.params.id })
      .populate('assignedTo', 'fullName email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      project,
      tasks
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create new project
// @route   POST /api/projects
// @access  Private (Admin)
exports.createProject = async (req, res) => {
  try {
    const { projectName, description, department, startDate, deadline, priority, assignedEmployees } = req.body;

    const project = await Project.create({
      projectName,
      description,
      department,
      startDate,
      deadline,
      priority,
      assignedEmployees: assignedEmployees || [],
      createdBy: req.user.id,
      status: 'planning'
    });

    await project.populate('assignedEmployees', 'fullName email');
    await project.populate('createdBy', 'fullName email');

    res.status(201).json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update project
// @route   PUT /api/projects/:id
// @access  Private (Admin)
exports.updateProject = async (req, res) => {
  try {
    const { projectName, description, department, startDate, deadline, status, priority, totalTasks, completedTasks } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    project = await Project.findByIdAndUpdate(
      req.params.id,
      { 
        projectName, 
        description, 
        department, 
        startDate, 
        deadline, 
        status, 
        priority,
        totalTasks,
        completedTasks
      },
      { new: true, runValidators: true }
    )
    .populate('assignedEmployees', 'fullName email')
    .populate('createdBy', 'fullName email');

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete project
// @route   DELETE /api/projects/:id
// @access  Private (Admin)
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Check if project has tasks
    const tasksCount = await Task.countDocuments({ project: req.params.id });
    if (tasksCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete project with existing tasks. Delete tasks first.'
      });
    }

    await project.deleteOne();

    res.json({
      success: true,
      message: 'Project deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Assign employees to project
// @route   PUT /api/projects/:id/assign
// @access  Private (Admin)
exports.assignEmployees = async (req, res) => {
  try {
    const { employeeIds } = req.body;

    let project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Verify all employees exist
    const employees = await User.find({ _id: { $in: employeeIds }, role: { $in: ['employee', 'admin'] } });
    
    if (employees.length !== employeeIds.length) {
      return res.status(400).json({
        success: false,
        message: 'One or more employees not found'
      });
    }

    project.assignedEmployees = employeeIds;
    await project.save();

    await project.populate('assignedEmployees', 'fullName email department designation');

    res.json({
      success: true,
      project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get project statistics
// @route   GET /api/projects/stats
// @access  Private (Admin)
exports.getProjectStats = async (req, res) => {
  try {
    const totalProjects = await Project.countDocuments();
    const planningProjects = await Project.countDocuments({ status: 'planning' });
    const activeProjects = await Project.countDocuments({ status: 'active' });
    const completedProjects = await Project.countDocuments({ status: 'completed' });
    const onHoldProjects = await Project.countDocuments({ status: 'on_hold' });

    const projectsByDepartment = await Project.aggregate([
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $match: { _id: { $ne: null } } }
    ]);

    const projectsByPriority = await Project.aggregate([
      { $group: { _id: '$priority', count: { $sum: 1 } } }
    ]);

    // Calculate average progress
    const avgProgress = await Project.aggregate([
      { $group: { _id: null, avgProgress: { $avg: '$progress' } } }
    ]);

    res.json({
      success: true,
      stats: {
        totalProjects,
        planningProjects,
        activeProjects,
        completedProjects,
        onHoldProjects,
        projectsByDepartment,
        projectsByPriority,
        avgProgress: avgProgress.length > 0 ? Math.round(avgProgress[0].avgProgress) : 0
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
