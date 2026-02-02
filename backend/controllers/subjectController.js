const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

exports.addSubject = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { name, examDate, color } = req.body;

    if (!name || !examDate) {
      return res.status(400).json({ message: "Name and Exam Date are required" });
    }
    console.log("--- ADD SUBJECT REQUEST ---");
    console.log("User in Request:", req.user);
    console.log("Body:", req.body);

    const newSubject = new Subject({
      userId: req.user.id,
      name,
      examDate,
      color: `hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`,
      progress: 0
    });

    await newSubject.save();
    console.log("Subject saved successfully:", newSubject);
    res.status(201).json(newSubject);
  } catch (err) {
    console.error("CRITICAL ERROR creating subject:", err);
    res.status(500).json({
      message: "Failed to create subject",
      error: err.message,
      stack: err.stack
    });
  }
};

exports.addTopic = async (req, res) => {
  try {
    const { subjectId, name, difficulty } = req.body;
    const topic = new Topic({
      subjectId,
      name,
      difficulty: difficulty || 3,
      status: 'new'
    });
    await topic.save();
    res.status(201).json(topic);
  } catch (err) {
    res.status(400).json({ message: "Failed to add topic" });
  }
};

exports.getSubjects = async (req, res) => {
  try {
    const subjects = await Subject.find({ userId: req.user.id });
    const subjectsWithTopics = await Promise.all(subjects.map(async (subject) => {
      const topics = await Topic.find({ subjectId: subject._id });
      return { ...subject._doc, topics };
    }));

    res.json(subjectsWithTopics);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch subjects" });
  }
};

exports.getSubjectById = async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) return res.status(404).json({ message: "Subject not found" });

    const topics = await Topic.find({ subjectId: subject._id });

    res.json({ ...subject._doc, topics });
  } catch (err) {
    res.status(500).json({ message: "Error fetching subject details" });
  }
};

exports.toggleTopicStatus = async (req, res) => {
  try {
    const { topicId } = req.params;
    const { subTopicId } = req.body;
    const topic = await Topic.findById(topicId);

    if (subTopicId) {
      const sub = topic.subTopics.id(subTopicId);
      sub.completed = !sub.completed;
    } else {
      topic.status = topic.status === 'revised' ? 'learning' : 'revised';
      if (topic.status === 'revised') {
        topic.lastStudied = new Date();
      }
    }

    await topic.save();
    res.json(topic);
  } catch (err) {
    res.status(500).json({ message: "Toggle failed" });
  }
};

exports.addSubTopic = async (req, res) => {
  const { topicId } = req.params;
  const topic = await Topic.findById(topicId);
  topic.subTopics.push({ name: req.body.name });
  await topic.save();
  res.status(201).json(topic);
};