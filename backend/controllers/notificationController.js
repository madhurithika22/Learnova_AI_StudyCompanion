const Subject = require('../models/Subject');
const Topic = require('../models/Topic');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // User ID from auth middleware

        // Fetch subjects and topics
        const subjects = await Subject.find({ userId });

        // Find upcoming exams (next 7 days)
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        const upcomingExams = subjects
            .filter(s => s.examDate && new Date(s.examDate) >= now && new Date(s.examDate) <= nextWeek)
            .map(s => ({
                type: 'exam',
                title: `Exam: ${s.name}`,
                message: `Your exam for ${s.name} is on ${new Date(s.examDate).toLocaleDateString()}. Better start revising!`,
                date: s.examDate
            }));

        // Generate Notifications
        // For now, we also add a generic study reminder if it's past 9 AM and they have topics
        const notifications = [...upcomingExams];

        // Check if user has pending topics (simplified logic for study reminder)
        const pendingTopicsCount = subjects.reduce((acc, sub) => {
            const pending = sub.topics ? sub.topics.filter(t => t.status !== 'revised').length : 0;
            return acc + pending;
        }, 0);

        if (pendingTopicsCount > 0) {
            notifications.push({
                type: 'study',
                title: 'Study Reminder',
                message: `You have ${pendingTopicsCount} topics pending. Keep the streak alive!`,
                date: new Date()
            });
        }

        // Sort by date (exams first usually, or just most relevant)
        notifications.sort((a, b) => new Date(b.date) - new Date(a.date));

        res.json(notifications);

    } catch (error) {
        console.error("Notification Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
