const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/reports', analyticsController.getReports);
router.get('/download-report', analyticsController.downloadReport);

module.exports = router;
