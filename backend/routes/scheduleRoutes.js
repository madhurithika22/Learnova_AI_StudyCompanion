const express = require('express');
const router = express.Router();
const { getSmartDashboard } = require('../controllers/scheduleController');
const auth = require('../middleware/auth');

router.use(auth);

router.get('/dashboard', getSmartDashboard);

module.exports = router;