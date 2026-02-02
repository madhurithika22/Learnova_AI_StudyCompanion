const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const auth = require('../middleware/auth');

router.use(auth);
router.get('/', notificationController.getNotifications);

module.exports = router;
