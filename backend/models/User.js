const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  streak: { type: Number, default: 0 },
  badges: [String],
  studyPreferences: {
    startTime: { type: String, default: "17:00" },
    endTime: { type: String, default: "22:00" },
    breakDuration: { type: Number, default: 30 },
    lunchTime: { type: String, default: "19:00" }
  }
});
module.exports = mongoose.model('User', userSchema);