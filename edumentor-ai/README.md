# 🌌 EduMentor AI
> The Next-Generation Adaptive Learning Platform. Your personal AI tutor that actually remembers your mistakes and grows with you.

EduMentor AI is a state-of-the-art educational platform designed to make learning programming languages intuitive, adaptive, and highly personalized. Powered by the blistering speed of Groq and Llama 3.3 70B, it goes beyond simple Q&A by analyzing your recurring conceptual mistakes, dynamically scaling quiz difficulty, and challenging you daily.

![EduMentor AI Dashboard](./public/demo-cover.png) *(Note: Add a cover image or demo GIF here)*

---

## ✨ Core Features

- **🧠 Mistake Memory System**: The AI remembers your recurring conceptual errors across sessions. It subtly corrects you and builds customized questions based on what you struggle with the most.
- **🔬 Deep Code Analyzer**: Paste in a block of code, and the AI will break it down line-by-line with inline annotations and explanations.
- **⚡ Adaptive Quizzes**: Generates personalized assessments. The difficulty automatically scales based on your exact mastery score for that specific topic.
- **🔥 Daily Challenges**: A streak-based daily coding challenge (one per day per language) to drive engagement, complete with adaptive hints and solutions.
- **💬 Conversational AI Tutor**: A beautiful, floating holographic AI companion that responds instantly. Supports 6 languages (Python, JavaScript, Java, C, C++, HTML/CSS).
- **📊 Progress Dashboard**: Visualize your mastery, track your study streaks, and see exactly which concepts you are currently struggling with.

---

## 🛡️ Architecture & Security Updates

We take application security and API abuse seriously. EduMentor AI is built around a secure **Backend Proxy Server Pattern**:

- **No Exposed Secrets**: All API keys remain securely on the backend. The frontend browser never interacts directly with external LLM APIs.
- **Strict Input Validation (Zod)**: All AI endpoints feature aggressive Zod schema validation. Malicious or oversized payloads are immediately rejected (`400 Bad Request`) to protect token usage and prevent Denial of Service.
- **Granular Rate Limiting**: AI endpoints are rate-limited via the database (`apiUsage` table). Authenticated users are strictly allocated quotas for Chat Requests (100/day), Quizzes (50/day), and Code Analyses (50/day).
- **Responsive & Polished UI**: Fully optimized for mobile screens. Navigation bars, learning path SVGs (Constellation & Learning Galaxy), and form layouts dynamically adapt to prevent horizontal overflow and ensure a premium mobile experience.

---

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL (Neon Serverless)
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI / LLM**: Groq API (Llama 3.3 70B Versatile)
- **Validation**: Zod
- **Styling**: Tailwind CSS & Framer Motion
- **Deployment**: Vercel

---

## 🚀 Local Setup

**1. Clone the repository**
```bash
git clone https://github.com/Kaxyaa-flux/EduMentor-Ai.git
cd EduMentor-Ai/edumentor-ai
```

**2. Install dependencies**
```bash
npm install
```

**3. Configure Environment Variables**
Create a `.env.local` file in the `edumentor-ai` directory with the following keys:
```env
# PostgreSQL Database (e.g. from Neon.tech)
DATABASE_URL="postgresql://user:password@host:port/db?schema=public"

# NextAuth Secret for session signing (generate with `openssl rand -base64 32`)
NEXTAUTH_SECRET="your-super-secret-string"
NEXTAUTH_URL="http://localhost:3000"

# Groq API Key (Get from https://console.groq.com)
GROQ_API_KEY="gsk_your_real_key_here"
```

**4. Push Database Schema**
```bash
npx prisma db push
npx prisma generate
```

**5. Start the Development Server**
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## ☁️ Deployment

This project is optimized for deployment on Vercel with a Neon Postgres database.

1. Create a free Postgres database on [Neon.tech](https://neon.tech/) and copy your Connection String.
2. Push your code to GitHub.
3. Import your repository into [Vercel](https://vercel.com).
4. Add the Environment Variables (`DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GROQ_API_KEY`) in Vercel before deploying.
5. Deploy! Vercel will automatically run `prisma generate && next build`.

---

*Built with ❤️ for the AI in EdTech Hackathon.*
