const mongoose = require('mongoose');
const subjectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  examDate: { type: Date, required: true },
  color: { type: String, default: "hsl(258, 89%, 66%)" },
  progress: { type: Number, default: 0 }
});
module.exports = mongoose.model('Subject', subjectSchema);