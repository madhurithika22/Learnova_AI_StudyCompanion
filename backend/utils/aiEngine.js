const calculateAdvancedScore = (topic, subject, user) => {
  const today = new Date();

  if (!subject || !subject.examDate) {
    return {
      score: 1,
      retention: 100,
      insight: "Set an exam date to enable AI prioritization"
    };
  }

  const examDate = new Date(subject.examDate);
  const diffTime = examDate - today;
  const daysLeft = Math.max(1, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  const daysSinceLast = topic.lastStudied
    ? (today - new Date(topic.lastStudied)) / (1000 * 60 * 60 * 24)
    : 14;

  const retentionPower = Math.pow(2, -(daysSinceLast / 7));
  const memoryUrgency = (1 - retentionPower) * 5;

  const urgency = Math.log(100 / daysLeft);
  const userStreak = user?.streak || 0;
  const staminaFactor = userStreak > 5 ? 1.2 : 0.8;
  const effortRequired = (topic.difficulty || 3) * staminaFactor;
  const totalScore = (memoryUrgency * 0.4) + (urgency * 0.4) + (effortRequired * 0.2);

  let insight = "Retention stable";
  if (daysLeft <= 3) insight = "Exam imminent: High focus mode";
  else if (retentionPower < 0.5) insight = "Memory fade detected: Review suggested";
  else if (topic.difficulty >= 4 && userStreak < 3) insight = "Challenging topic: Take extra breaks";

  return {
    score: totalScore,
    retention: Math.round(retentionPower * 100),
    insight: insight
  };
};

const calculatePriorityScore = (topic, examDate) => {
  const today = new Date();
  const exam = new Date(examDate);
  const daysRemaining = Math.max(1, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));

  const urgencyScore = (1 / daysRemaining) * 10;
  const difficultyScore = topic.difficulty || 3;

  const totalScore = (urgencyScore * 0.5) + (difficultyScore * 0.5);

  return {
    score: totalScore,
    reason: daysRemaining <= 5 ? `Exam in ${daysRemaining} days` : `Regular study session`
  };
};

module.exports = {
  calculateAdvancedScore,
  calculatePriorityScore
};