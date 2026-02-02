const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');
router.patch('/preferences', auth, async (req, res) => {
  try {
    const { startTime, breakDuration } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      {
        "studyPreferences.startTime": startTime,
        "studyPreferences.breakDuration": parseInt(breakDuration)
      },
      { new: true }
    );
    res.json(user.studyPreferences);
  } catch (err) {
    res.status(500).json({ message: "Update failed" });
  }
});

module.exports = router;