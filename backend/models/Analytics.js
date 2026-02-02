const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  studySeconds: {
    type: Number,
    default: 0
  },
  topicsCompleted: {
    type: Number,
    default: 0
  },
  focusSubject: {
    type: String
  }
}, { timestamps: true });

analyticsSchema.index({ userId: 1, date: 1 });

module.exports = mongoose.model('Analytics', analyticsSchema);