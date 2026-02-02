const { GoogleGenerativeAI } = require("@google/generative-ai");
const Anthropic = require("@anthropic-ai/sdk");
const axios = require("axios");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
const cleanJSON = (text) => {
  try {
    const regex = /\{[\s\S]*\}/;
    const match = text.match(regex);
    const jsonString = match ? match[0] : text;
    return match ? JSON.parse(match[0]) : JSON.parse(text);
  } catch (e) {
    console.error("Failed to parse AI JSON:", text);
    throw new Error("AI returned invalid JSON structure");
  }
};

async function tryGemini(prompt) {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();

  return cleanJSON(text);
}
const generatePrompt = (user, subjects, topics) => {
  return `
    You are an AI Study Scheduler. Create a JSON study plan for today.
    
    User Context:
    - Start Time: ${user.studyPreferences?.startTime || "17:00"}
    - Break Duration: ${user.studyPreferences?.breakDuration || 15} mins
    - Today's Date: ${new Date().toISOString().split('T')[0]}

    Prioritization Rules:
    1. IMMINENT EXAMS (within 3 days) must get "high" priority and earlier time slots.
    2. NO OVERLAPPING TIMES. Time slots must be distinct and sequential.
    3. Include 5-10 min breaks between long study blocks.

    Data:
    - Subjects (with Exam Dates): ${JSON.stringify(subjects.map(s => ({ name: s.name, exam: s.examDate })))}
    - Topics Pool: ${JSON.stringify(topics.map(t => ({ name: t.name, difficulty: t.difficulty, status: t.status })))}
    
    Format: { "schedule": [{"topicName": "...", "subjectName": "...", "startTime": "HH:MM", "endTime": "HH:MM", "type": "study/break/revision", "priority": "high/medium/low", "aiReason": "..."}] }
    Constraint: Output ONLY valid JSON. No markdown.
  `;
};

async function tryGemini(prompt) {
  const models = [
    "gemini-2.0-flash-exp",
    "gemini-1.5-flash",
    "gemini-1.5-flash-001",
    "gemini-1.5-flash-002",
    "gemini-1.5-pro",
    "gemini-1.5-pro-001",
    "gemini-1.5-pro-002",
    "gemini-pro"
  ];

  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Trying Gemini Model: ${modelName}...`);
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      if (!text) throw new Error("Empty response");
      return cleanJSON(text);
    } catch (err) {
      console.warn(`Gemini ${modelName} failed: ${err.message}`);
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini models failed");
}

async function tryGroq(prompt) {
  const models = [
    "llama-3.3-70b-versatile",
    "llama-3.1-70b-versatile",
    "llama-3.1-8b-instant",
    "llama3-70b-8192",
    "mixtral-8x7b-32768"
  ];

  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`Trying Groq Model: ${modelName}...`);
      const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
        model: modelName,
        messages: [
          { role: "system", content: "You are a helpful JSON scheduler. Output JSON only." },
          { role: "user", content: prompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2
      }, { headers: { Authorization: `Bearer ${process.env.GROQ_API_KEY}` } });

      return JSON.parse(response.data.choices[0].message.content);
    } catch (err) {
      console.warn(`Groq ${modelName} failed: ${err.message || err.response?.data?.error?.message}`);
      lastError = err;
    }
  }
  throw lastError || new Error("All Groq models failed");
}

async function tryAnthropic(prompt) {
  const msg = await anthropic.messages.create({
    model: "claude-3-haiku-20240307",
    max_tokens: 1000,
    messages: [{ role: "user", content: prompt + " Output JSON only." }],
  });
  return JSON.parse(msg.content[0].text);
}

async function tryOpenAI(prompt) {
  if (!process.env.OPENAI_API_KEY) throw new Error("OpenAI Key missing");
  const response = await axios.post("https://api.openai.com/v1/chat/completions", {
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful JSON scheduler. Output JSON only." },
      { role: "user", content: prompt }
    ],
    response_format: { type: "json_object" }
  }, { headers: { Authorization: `Bearer ${process.env.OPENAI_API_KEY}` } });
  return JSON.parse(response.data.choices[0].message.content);
}

exports.getAIPlan = async (user, subjects, topics) => {
  const slimSubjects = subjects.map(s => ({ n: s.name, d: s.examDate }));
  const slimTopics = topics.map(t => ({ n: t.name, d: t.difficulty }));

  const prompt = `
    Role: Study Scheduler. JSON Output.
    Ctx: Start ${user.studyPreferences?.startTime || "17:00"}, Break ${user.studyPreferences?.breakDuration || 15}m, Date ${new Date().toISOString().split('T')[0]}
    Rules: 1. Imminent exams(d) first. 2. No overlap.
    Subs: ${JSON.stringify(slimSubjects)}
    Tops: ${JSON.stringify(slimTopics)}
    Out: { "schedule": [{"topicName": "...", "subjectName": "...", "startTime": "HH:MM", "endTime": "HH:MM", "type": "study/break", "priority": "high/medium", "aiReason": "..."}] }
  `;

  const providers = [
    { name: "Gemini", fn: tryGemini },
    { name: "OpenAI", fn: tryOpenAI },
    { name: "Groq", fn: tryGroq },
    { name: "Anthropic", fn: tryAnthropic }
  ];

  for (const provider of providers) {
    try {
      if (provider.name === "OpenAI" && !process.env.OPENAI_API_KEY) continue;

      console.log(`Attempting schedule generation with ${provider.name}...`);
      const result = await provider.fn(prompt);
      return { ...result, provider: provider.name };
    } catch (err) {
      console.warn(`${provider.name} failed: ${err.message}. Trying next...`);
    }
  }

  console.error("All AI providers failed. Using Fallback.");

  const startHour = parseInt(user.studyPreferences?.startTime?.split(':')[0]) || 17;
  const richTopics = topics.map(t => {
    const subject = subjects.find(s => s._id.toString() === t.subjectId.toString());
    return {
      ...t,
      subjectName: subject?.name || "General Study",
      examDate: subject?.examDate ? new Date(subject.examDate) : new Date('2099-12-31')
    };
  });

  richTopics.sort((a, b) => {
    const timeA = a.examDate.getTime();
    const timeB = b.examDate.getTime();
    if (timeA !== timeB) return timeA - timeB;
    return (b.difficulty || 3) - (a.difficulty || 3);
  });

  const schedule = richTopics.slice(0, 4).map((t, i) => ({
    topicName: t.name,
    subjectName: t.subjectName,
    startTime: `${startHour + i}:00`,
    endTime: `${startHour + i + 1}:00`,
    type: "study",
    priority: i === 0 ? "high" : "medium",
    aiReason: i === 0
      ? `Urgent: Exam on ${t.examDate.toLocaleDateString()}`
      : "Scheduled based on exam proximity."
  }));

  return {
    provider: "Smart Fallback Engine",
    schedule
  };
};