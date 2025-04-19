const mongoose = require('mongoose');

const UnitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Virtual for topic count
UnitSchema.virtual('topicCount').get(function() {
  return this.topics ? this.topics.length : 0;
});

module.exports = mongoose.model('Unit', UnitSchema);