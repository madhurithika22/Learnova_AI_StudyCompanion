const Subject = require('../models/Subject');
const Topic = require('../models/Topic');
const User = require('../models/User');
const { getAIPlan } = require('../utils/aiScheduler');

exports.getSmartDashboard = async (req, res) => {
  try {

    const userId = req.user?.id || req.user?._id;
    if (!userId) {
      return res.status(401).json({ message: "User context missing. Please re-login." });
    }

    const [user, subjects] = await Promise.all([
      User.findById(userId),
      Subject.find({ userId })
    ]);

    if (!subjects || subjects.length === 0) {
      return res.json({
        greeting: "Welcome to Lernova",
        schedule: [],
        aiInsight: "Add a subject with an exam date to generate your AI plan."
      });
    }

    const topics = await Topic.find({
      subjectId: { $in: subjects.map(s => s._id) },
      status: { $ne: 'revised' }
    });

    if (!topics || topics.length === 0) {
      return res.json({
        greeting: `Hello, ${user?.name || 'Scholar'}`,
        schedule: [],
        aiInsight: "No active topics found. Add topics to your subjects to start studying!"
      });
    }

    const enrichedTopics = topics.map(topic => {
      const parentSubject = subjects.find(s => s._id.toString() === topic.subjectId.toString());
      return {
        ...topic._doc,
        subjectName: parentSubject ? parentSubject.name : "General"
      };
    });

    try {
      const aiResponse = await getAIPlan(user, subjects, enrichedTopics);
      const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good Morning";
        if (hour < 17) return "Good Afternoon";
        return "Good Evening";
      };

      res.json({
        greeting: getGreeting(),
        schedule: aiResponse.schedule,
        aiInsight: aiResponse.aiInsight || "Your schedule is ready."
      });
    } catch (aiError) {
      console.error("AI Fallback Triggered:", aiError.message);

      const fallbackSchedule = enrichedTopics.slice(0, 3).map((t, i) => ({
        topicName: t.name,
        subjectName: t.subjectName,
        startTime: `${17 + i}:00`,
        endTime: `${18 + i}:00`,
        type: "study",
        priority: "medium",
        aiReason: "AI is offline; using basic sequence."
      }));

      res.json({
        greeting: "Hello",
        schedule: fallbackSchedule,
        aiInsight: "AI providers are busy. Using a standard priority queue."
      });
    }
  } catch (err) {
    console.error("General Controller Error:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};