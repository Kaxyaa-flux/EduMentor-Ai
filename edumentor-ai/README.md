# 🌌 EduMentor AI
> AI-powered personalized coding tutor that actually remembers your mistakes.

EduMentor AI is a next-generation adaptive learning platform built for the **AI in EdTech** hackathon. It doesn't just answer coding questions; it analyzes your recurring mistakes, dynamically adjusts quiz difficulty based on your mastery level, and provides daily challenges to keep you engaged.

![EduMentor AI Demo Cover](./public/demo-cover.png) *(Note: Please add a cover image or demo GIF here)*

---

## ✨ Unique Features

- **🧠 Mistake Memory System**: The AI remembers your recurring conceptual errors across sessions. It subtly corrects you and builds customized questions based on what you struggle with the most.
- **🔬 Code Analyzer**: Paste in a block of code, and the AI will break it down line-by-line with inline annotations and explanations.
- **⚡ Adaptive Quizzes**: Generates personalized assessments. The difficulty automatically scales based on your exact mastery score for that specific topic.
- **🔥 Daily Challenges**: A streak-based daily coding challenge (one per day per language) to drive engagement, complete with adaptive hints and solutions.
- **💬 Conversational AI Tutor**: A beautiful, floating holographic AI companion powered by Groq (Llama 3.3 70B) for lightning-fast responses. Supports 6 languages (Python, JavaScript, Java, C, C++, HTML/CSS).
- **📊 Progress Dashboard**: Visualize your mastery, track your study streaks, and see exactly which concepts you are currently struggling with.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **AI / LLM**: Groq API (Llama 3.3 70B Versatile)
- **Styling**: Tailwind CSS & Framer Motion
- **Deployment**: Render

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
# PostgreSQL Database (e.g. from Neon.tech, Supabase, or local)
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

## ☁️ Deployment (Vercel & Neon)

This project is optimized for deployment on Vercel with a Neon Serverless Postgres database.

1. Create a free Postgres database on [Neon.tech](https://neon.tech/) and copy your Connection String.
2. Push your code to GitHub.
3. Import your repository into [Vercel](https://vercel.com).
4. Add the following Environment Variables in Vercel before deploying:
   - `DATABASE_URL` (Your Neon connection string)
   - `NEXTAUTH_SECRET` (Your random secret string)
   - `NEXTAUTH_URL` (Set to your Vercel project URL, e.g., `https://my-app.vercel.app`)
   - `GROQ_API_KEY` (Your Groq API key)
5. Deploy! Vercel will automatically run `prisma generate && next build`.

---

*Built with ❤️ for the AI in EdTech Hackathon.*
