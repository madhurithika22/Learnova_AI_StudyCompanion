# Learnova: AI-Powered Smart Study Planner

Learnova is a production-grade educational productivity platform designed to transform how students prepare for exams. By leveraging agentic AI logic, Learnova analyzes subject complexity, topic density, and exam timelines to generate high-efficiency, personalized study schedules.

---

## Live Demo and Deployment

**Live URL:**  
[Learnova AI](https://learnova-ai-study-
companion.vercel.app?_vercel_share=xHWJ6jTTPu2sx4mFm6inZuKv2k47SdpN)

**Frontend:** React 
**Backend:** Express.js
**Deployment Platform:** Vercel (CI/CD via GitHub)

---

## Key Features

### AI Smart Scheduling
Uses LLM-based logic to prioritize study topics based on difficulty level, urgency, and available time before exams.

### Dynamic Subject Management
Provides full CRUD operations for subjects, topics, difficulty levels, and exam dates.

### Automated Time Blocking
Generates structured daily study sessions with intelligent break placement and revision intervals.

### Responsive Dashboard
Modern, mobile-first dashboard designed for seamless usage across devices.

### Secure Authentication
JWT-based authentication using a secure `learnova_token` to ensure data privacy and user isolation.

---

## AI Tools and Technologies Used

### Generative AI (OpenAI / Gemini)
Powers the intelligent scheduling engine and converts structured academic data into optimized study plans.

### Lovable
Used for rapid frontend prototyping and UI component architecture.

### Vercel
Cloud infrastructure for frontend hosting and automated deployment pipelines.

### Axios
Handles asynchronous communication between the frontend and backend APIs.

---

## System Architecture Overview

Learnova follows a modern MERN-style full-stack architecture with a dedicated AI orchestration layer.

### Client Layer
- Next.js application
- Handles UI rendering, routing, and state management
- Communicates with backend via REST APIs

### Server Layer
- Node.js with Express.js
- Manages authentication, business logic, and API routing

### AI Intelligence Layer
- Processes subject difficulty, deadlines, and analytics
- Generates structured JSON-based study schedules using LLMs

### Database Layer
- MongoDB for persistent storage
- Stores user profiles, subjects, topics, schedules, and analytics data

---

## Setup and Installation

### Prerequisites
- Node.js version 18.0 or higher
- npm or yarn
- Valid AI API key (OpenAI or Gemini)

---

1. Clone the Repository

```bash
git clone https://github.com/your-username/learnova.git
cd learnova
```

2. Install Dependencies
npm install

3. Environment Configuration

Create a .env file in the root directory (refer to .env.example):

PORT=5000
MONGODB_URI=your_mongodb_connection_string
AI_API_KEY=your_ai_api_key
JWT_SECRET=your_jwt_secret

4. Run the Application Locally
npm run dev

Deployment Steps
1. Connect GitHub to Vercel

Link the repository through the Vercel dashboard.

2. Configure Environment Variables

Add all variables from the .env file to Vercel’s Environment Variables section.

3. Deploy

Vercel will automatically detect the Next.js framework and build the application.

4. Continuous Integration

Every push to the main branch triggers an automatic redeploy via CI/CD.
