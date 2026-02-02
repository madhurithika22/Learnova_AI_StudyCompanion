const calculatePriority = (topic, examDate) => {
  const daysLeft = Math.ceil((new Date(examDate) - new Date()) / (1000 * 60 * 60 * 24));
  const urgency = 1 / (daysLeft || 1);
  return (urgency * 0.4) + (topic.difficulty * 0.3) + (0.3);
};