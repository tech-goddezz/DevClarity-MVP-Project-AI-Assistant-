# DevClarity

**AI-powered code analysis for developers who want to understand their code, not just ship it.**

DevClarity reviews your code using advanced AI models and returns a quality score, a plain-English summary, detected issues, and actionable improvement suggestions — instantly.

🔗 **Live:** [dev-clarity-mvp-project-ai-assistan.vercel.app](https://dev-clarity-mvp-project-ai-assistan.vercel.app)

---

## Features

- AI code analysis with quality scoring (0–10)
- Issue detection and improvement suggestions
- JavaScript, TypeScript, and Python support
- Fast AI and Smart AI model switching
- Analysis history with session persistence
- Animated score ring and typing summary effect
- Glassmorphism dashboard UI

## Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express  
**AI:** Groq API (Llama 3)  
**Deployment:** Vercel (frontend) + Render (backend)

---

## Local Setup

### 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/DevClarity-MVP-Project-AI-Assistant.git
cd DevClarity-MVP-Project-AI-Assistant

### 2. Install dependencies
npm install

### 3. Set up environment variables
cp .env.example .env
# Then open .env and fill in your values

### 4. Start the dev server
npm run dev

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_URL` | Your backend URL (Render in production, localhost:5000 in dev) |

---

## Project Structure

src/
├── api/          # All backend fetch calls
├── components/   # Reusable UI components
├── hooks/        # Custom React hooks
├── lib/          # Utility/helper functions
├── pages/        # Page-level components
└── types/        # TypeScript type definitions

---

Built by Elizabeth Omigie · [@elizabth](https://twitter.com/elizabth)

Linkedin: https://www.linkedin.com/in/elizabethomigie