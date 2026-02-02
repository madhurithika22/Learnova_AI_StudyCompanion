const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Analytics = require('./models/Analytics');
const User = require('./models/User');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB Connected for Seeding'))
    .catch(err => console.error(err));

const seedAnalytics = async () => {
    try {
        const user = await User.findOne();
        if (!user) {
            console.error("No user found! Please signup first.");
            process.exit(1);
        }

        await Analytics.deleteMany({ userId: user._id });

        const entries = [];
        const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "History"];


        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);

            const isWeekend = date.getDay() === 0 || date.getDay() === 6;
            const baseSeconds = isWeekend ? 7200 : 10800;
            const randomSeconds = Math.floor(Math.random() * 3600);

            entries.push({
                userId: user._id,
                date: date,
                studySeconds: Math.max(0, baseSeconds + (Math.random() > 0.5 ? randomSeconds : -randomSeconds)),
                topicsCompleted: Math.floor(Math.random() * 5),
                focusSubject: subjects[Math.floor(Math.random() * subjects.length)]
            });
        }

        await Analytics.insertMany(entries);
        console.log(`✅ Seeded ${entries.length} days of analytics data for user: ${user.name}`);
        process.exit();
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
};

seedAnalytics();
