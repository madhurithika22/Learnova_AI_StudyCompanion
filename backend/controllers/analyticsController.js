const Analytics = require('../models/Analytics');
const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

exports.getReports = async (req, res) => {
    try {
        const userId = req.user.id;
        const today = new Date();
        const sevenDaysAgo = new Date(today);
        sevenDaysAgo.setDate(today.getDate() - 7);

        const weeklyStats = await Analytics.find({
            userId,
            date: { $gte: sevenDaysAgo }
        }).sort({ date: 1 });

        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const weeklyData = weeklyStats.map(stat => ({
            day: days[new Date(stat.date).getDay()],
            hours: parseFloat((stat.studySeconds / 3600).toFixed(1)),
            topics: stat.topicsCompleted
        }));

        const fullWeeklyData = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(today.getDate() - i);
            const dayName = days[d.getDay()];
            const found = weeklyData.find(w => w.day === dayName);
            fullWeeklyData.push(found || { day: dayName, hours: 0, topics: 0 });
        }

        const subjects = await Subject.find({ userId });
        const subjectIds = subjects.map(s => s._id);
        const topics = await Topic.find({ subjectId: { $in: subjectIds } });

        const topicStatusData = [
            { name: "Revised", value: topics.filter(t => t.status === 'revised').length, color: "hsl(142, 71%, 45%)" },
            { name: "Learning", value: topics.filter(t => t.status === 'learning').length, color: "hsl(45, 93%, 47%)" },
            { name: "New", value: topics.filter(t => t.status === 'new').length, color: "hsl(217, 91%, 60%)" }
        ];

        const subjectProgress = subjects.map(s => {
            const subjectTopics = topics.filter(t => t.subjectId.toString() === s._id.toString());
            const completedCount = subjectTopics.filter(t => t.status === 'revised').length;
            const progress = subjectTopics.length > 0
                ? Math.round((completedCount / subjectTopics.length) * 100)
                : 0;

            return {
                id: s._id,
                name: s.name,
                progress: progress,
                color: s.color,
                topicsCount: subjectTopics.length
            };
        });

        const progressTrend = [
            { week: "W1", progress: 20 },
            { week: "W2", progress: 40 },
            { week: "W3", progress: 60 },
            { week: "W4", progress: subjects.reduce((acc, s) => acc + s.progress, 0) / (subjects.length || 1) }
        ];

        res.json({
            weeklyData: fullWeeklyData,
            topicStatusData,
            subjectProgress,
            progressTrend,
            summary: {
                totalHours: fullWeeklyData.reduce((acc, d) => acc + d.hours, 0).toFixed(1),
                totalTopics: fullWeeklyData.reduce((acc, d) => acc + d.topics, 0)
            }
        });

    } catch (error) {
        console.error("Error fetching reports:", error);
        res.status(500).json({ message: "Failed to fetch reports" });
    }
};
