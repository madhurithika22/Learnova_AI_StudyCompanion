# Learnova : AI Study Companion with Smart Topic Scheduling

## Objective
Design a study planner app that uses AI to auto-prioritize topics based on exam dates, difficulty levels, and learning history for effective revision scheduling.

---

## Technologies

### Frontend
*   **React + TailwindCSS**: For a modern, responsive, and dynamic user interface.
*   **Redux Toolkit**: For efficient state management across the application.
*   **Vite**: For fast build tooling and development environment.

### Backend
*   **Express.js**: For a robust and scalable RESTful API.
*   **JWT Auth**: For secure, stateless user authentication.
*   **MongoDB**: For flexible data storage of user profiles, subjects, and study history.

### AI Features
*   **Topic Prioritization**: Algorithms that weight topics based on upcoming exam deadlines and historical performance.
*   **Smart Study Schedule Generator**: Automatically creates balanced study plans to maximize retention.
*   **Revision Reminders**: Implements spaced repetition logic to ensure long-term memory retention.

---

## Core Requirements

### 1. User Authentication
*   Secure Login/Signup functionality.
*   Password hashing and JWT token management.
*   User onboarding for subject preferences and study habits.

### 2. Study Plan Management
*   **Subject & Topic Management**: Intuitive interface to add subjects and break them down into granular topics.
*   **Status Tracking**: Mark topics as "New", "Learning", or "Revised" to track progress visually.
*   **Exam Integrations**: Set specific exam dates to trigger the urgency algorithms.

### 3. AI Topic Scheduling
*   **Smart Recommendation Engine**: Suggests the optimal study order based on:
    *   Time remaining until exam.
    *   Topic complexity/difficulty level.
    *   Last studied date (Spaced Repetition).
*   **Urgency Alerts**: Highlights overdue or critical topics that require immediate attention.

### 4. Dashboard
*   **Visual Analytics**: Charts and graphs displaying weekly activity, current subject progress, and overall readiness.
*   **Daily Suggestions**: AI-curated list of what to focus on today.
*   **Exam Countdown**: Prominent reminders of upcoming deadlines.

---

## Setup Guide

### Prerequisites
*   Node.js (v18+)
*   MongoDB (Local or Atlas)
*   API Keys for LLM Providers (Gemini, Groq, or OpenAI)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone <repository-url>
    cd learnova
    ```

2.  **Backend Setup**
    ```bash
    cd backend
    npm install
    
    # Configure Environment Variables
    # Create a .env file with:
    # MONGO_URI=your_mongodb_uri
    # JWT_SECRET=your_secret_key
    # GEMINI_API_KEY=your_key
    
    npm run dev
    ```

3.  **Frontend Setup**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

4.  **Access the Application**
    *   Frontend: `http://localhost:5173`
    *   Backend: `http://localhost:5000`

---

## AI Scheduling Logic

The core scheduler utilizes a weighted scoring system to rank topics:

1.  **Urgency Score**: Calculated inversely proportional to days remaining until the exam.
2.  **Difficulty Multiplier**: Higher weighting for topics marked as complex.
3.  **Decay Factor**: Increases the score for topics not studied recently (Simulating the Forgetting Curve).

**Final Rank** = `(Urgency Score x Difficulty Multiplier) + Decay Factor`

This ensures users are always focused on the most critical material at the right time.
