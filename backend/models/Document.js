const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Document title is required'],
    trim: true,
    maxlength: 200
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['form', 'report', 'circular', 'order', 'guideline', 'manual', 'other'],
    default: 'other'
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  department: {
    type: String
  },
  tags: [String],
  isPublic: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['active', 'archived', 'deleted'],
    default: 'active'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  version: {
    type: Number,
    default: 1
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

// Update timestamp on save
documentSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Index for efficient queries
documentSchema.index({ category: 1, status: 1 });
documentSchema.index({ uploadedBy: 1 });

module.exports = mongoose.model('Document', documentSchema);
