const mongoose = require('mongoose');
const topicSchema = new mongoose.Schema({
  subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
  name: { type: String, required: true },
  difficulty: { type: Number, default: 3 },
  status: { type: String, enum: ['new', 'learning', 'revised'], default: 'new' },
  lastStudied: Date,
  subTopics: [{
    name: String,
    completed: { type: Boolean, default: false }
  }]
});
module.exports = mongoose.model('Topic', topicSchema);