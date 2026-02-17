const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    required: [true, 'Project description is required']
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  startDate: {
    type: Date,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['planning', 'active', 'on_hold', 'completed', 'cancelled'],
    default: 'planning'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedEmployees: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  totalTasks: {
    type: Number,
    default: 0
  },
  completedTasks: {
    type: Number,
    default: 0
  },
  progress: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Calculate progress before saving
projectSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.totalTasks > 0) {
    this.progress = Math.round((this.completedTasks / this.totalTasks) * 100);
  } else {
    this.progress = 0;
  }
  
  // Auto-update status based on progress
  if (this.progress === 100 && this.status !== 'completed') {
    this.status = 'completed';
  }
  
  next();
});

// Index for efficient queries
projectSchema.index({ status: 1 });
projectSchema.index({ department: 1 });
projectSchema.index({ assignedEmployees: 1 });

module.exports = mongoose.model('Project', projectSchema);
