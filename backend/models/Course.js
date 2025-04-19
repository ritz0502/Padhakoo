const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    enum: ['Computer Engineering', 'Computer Science and Engineering', 'Electronics and Telecommunication']
  },
  description: {
    type: String,
    trim: true
  },
  isDefault: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for unit count
CourseSchema.virtual('unitCount').get(function() {
  return this.units ? this.units.length : 0;
});

module.exports = mongoose.model('Course', CourseSchema);