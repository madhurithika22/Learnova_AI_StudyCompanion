export interface Subject {
  id: string;
  name: string;
  examDate: string;
  progress: number;
  xpEarned: number;
  topics: Topic[];
  color: string;
}

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: number;
  status: "new" | "learning" | "revised";
  lastStudied?: string;
  aiDifficultyEstimate?: boolean;
}

export interface ScheduleBlock {
  id: string;
  topicId: string;
  topicName: string;
  subjectName: string;
  startTime: string;
  endTime: string;
  type: "study" | "break" | "revision" | "review";
  priority: "high" | "medium" | "low";
  aiReason: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export const subjects: Subject[] = [
  {
    id: "1",
    name: "Mathematics",
    examDate: "2026-02-06",
    progress: 65,
    xpEarned: 850,
    color: "hsl(258, 89%, 66%)",
    topics: [
      { id: "1-1", subjectId: "1", name: "Calculus - Derivatives", difficulty: 4, status: "revised", lastStudied: "2026-01-31" },
      { id: "1-2", subjectId: "1", name: "Calculus - Integration", difficulty: 5, status: "learning", lastStudied: "2026-01-30" },
      { id: "1-3", subjectId: "1", name: "Linear Algebra", difficulty: 3, status: "new" },
      { id: "1-4", subjectId: "1", name: "Probability", difficulty: 3, status: "revised", lastStudied: "2026-01-28" },
      { id: "1-5", subjectId: "1", name: "Statistics", difficulty: 2, status: "learning", lastStudied: "2026-01-29" },
    ],
  },
  {
    id: "2",
    name: "Physics",
    examDate: "2026-02-08",
    progress: 45,
    xpEarned: 520,
    color: "hsl(217, 91%, 60%)",
    topics: [
      { id: "2-1", subjectId: "2", name: "Mechanics", difficulty: 4, status: "learning", lastStudied: "2026-01-30" },
      { id: "2-2", subjectId: "2", name: "Thermodynamics", difficulty: 4, status: "new" },
      { id: "2-3", subjectId: "2", name: "Electromagnetism", difficulty: 5, status: "new" },
      { id: "2-4", subjectId: "2", name: "Optics", difficulty: 3, status: "revised", lastStudied: "2026-01-27" },
    ],
  },
  {
    id: "3",
    name: "Chemistry",
    examDate: "2026-02-10",
    progress: 80,
    xpEarned: 1100,
    color: "hsl(142, 71%, 45%)",
    topics: [
      { id: "3-1", subjectId: "3", name: "Organic Chemistry", difficulty: 5, status: "revised", lastStudied: "2026-01-31" },
      { id: "3-2", subjectId: "3", name: "Inorganic Chemistry", difficulty: 3, status: "revised", lastStudied: "2026-01-30" },
      { id: "3-3", subjectId: "3", name: "Physical Chemistry", difficulty: 4, status: "learning", lastStudied: "2026-01-29" },
    ],
  },
];

export const todaySchedule: ScheduleBlock[] = [
  {
    id: "s1",
    topicId: "1-2",
    topicName: "Calculus - Integration",
    subjectName: "Mathematics",
    startTime: "17:00",
    endTime: "18:00",
    type: "study",
    priority: "high",
    aiReason: "Exam in 5 days • High difficulty • Needs more practice",
  },
  {
    id: "s2",
    topicId: "2-1",
    topicName: "Mechanics",
    subjectName: "Physics",
    startTime: "18:00",
    endTime: "19:00",
    type: "revision",
    priority: "medium",
    aiReason: "Last studied 2 days ago • Medium retention expected",
  },
  {
    id: "s3",
    topicId: "break",
    topicName: "Dinner Break",
    subjectName: "",
    startTime: "19:00",
    endTime: "19:30",
    type: "break",
    priority: "low",
    aiReason: "Scheduled break for rest and nutrition",
  },
  {
    id: "s4",
    topicId: "1-3",
    topicName: "Linear Algebra",
    subjectName: "Mathematics",
    startTime: "19:30",
    endTime: "20:30",
    type: "study",
    priority: "high",
    aiReason: "New topic • Needs introduction before exam",
  },
  {
    id: "s5",
    topicId: "3-3",
    topicName: "Physical Chemistry",
    subjectName: "Chemistry",
    startTime: "20:30",
    endTime: "21:30",
    type: "revision",
    priority: "medium",
    aiReason: "Revision due • Last studied 3 days ago",
  },
  {
    id: "s6",
    topicId: "review",
    topicName: "Light Review",
    subjectName: "All Subjects",
    startTime: "21:30",
    endTime: "22:00",
    type: "review",
    priority: "low",
    aiReason: "Quick recap of today's topics for better retention",
  },
];

export const badges: Badge[] = [
  {
    id: "early_finisher",
    name: "Early Finisher",
    description: "Complete your daily plan before the scheduled end time",
    icon: "🌟",
    unlocked: false,
    unlockedAt: undefined,
  },
  {
    id: "revision_master",
    name: "Revision Master",
    description: "Complete 10 revision sessions",
    icon: "📚",
    unlocked: false,
    unlockedAt: undefined,
  },
  {
    id: "consistency_champ",
    name: "Consistency Champ",
    description: "Maintain a 7-day study streak",
    icon: "🔥",
    unlocked: false,
    unlockedAt: undefined,
  },
  {
    id: "exam_warrior",
    name: "Exam Warrior",
    description: "Complete all topics for a subject before exam",
    icon: "⚔️",
    unlocked: false,
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Study past midnight and still complete your plan",
    icon: "🦉",
    unlocked: false,
  },
  {
    id: "perfect_week",
    name: "Perfect Week",
    description: "Complete all daily plans for a full week",
    icon: "💎",
    unlocked: false,
  },
];

export const motivationalQuotes = [
  "Every expert was once a beginner. Keep going! 💪",
  "Small progress is still progress. You're doing great! ✨",
  "Your future self will thank you for studying today. 🌟",
  "Believe in yourself. You've got this! 💜",
  "Success is the sum of small efforts repeated daily. 🎯",
  "The only way to do great work is to love what you're learning. 📚",
];

export function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 17) return "Good Afternoon";
  if (hour < 21) return "Good Evening";
  return "Good Night";
}

export function getDaysUntilExam(examDate: string): number {
  const today = new Date();
  const exam = new Date(examDate);
  const diffTime = exam.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function getRandomQuote(): string {
  return motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];
}
