const express = require('express');
const router = express.Router();
const {
  addSubject,
  getSubjects,
  getSubjectById,
  addTopic,
  toggleTopicStatus,
  addSubTopic
} = require('../controllers/subjectController');
const auth = require('../middleware/auth');
router.use(auth);

router.get('/', getSubjects);
router.post('/', addSubject);
router.post('/topics', addTopic);
router.get('/:id', getSubjectById);
router.patch('/topics/:topicId/toggle', toggleTopicStatus);
router.post('/topics/:topicId/subtopics', addSubTopic);

module.exports = router;