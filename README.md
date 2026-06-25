# 🎓 EduMentor AI

> An AI-powered adaptive learning platform that personalizes your programming education with intelligent tutoring, adaptive quizzes, and mastery tracking.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![Groq](https://img.shields.io/badge/Groq_AI-LLaMA_3.3-FF6B00)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss)

---

## ✨ Features

### 🤖 AI Tutor Chat
- **Personalized conversations** powered by Groq's LLaMA 3.3 70B model
- Context-aware tutoring based on your skill level and learning goals
- Multi-session conversation management with rename/delete
- Code block rendering with syntax highlighting
- Quick action buttons: "Explain Simpler", "Show Code Example", "Practice Challenge"
- Floating chat widget accessible from any dashboard page

### 📝 Adaptive Quiz Engine
- **Dynamic difficulty scaling** — quizzes get harder as your mastery grows
- Topic-based Python quizzes: Variables, Control Flow, Lists, Functions, Dictionaries
- Real-time mastery score tracking per topic
- Detailed question review with tutor-generated explanations
- Score tracking with percentage breakdowns

### 📊 Progress & Mastery Dashboard
- **Visual mastery analytics** with interactive bar charts (Recharts)
- Learning streak tracker with animated fire visualization
- Weak topic detection with "Ask Tutor" quick actions
- Quiz performance history table with date tracking
- Overall accuracy and quiz count metrics

### ⚙️ Settings & Personalization
- **Profile management** — custom display name and avatar upload
- **AI Configuration** — bring your own Groq API key (verified before saving)
- **Learning Preferences** — language/topic selector (Python, JavaScript, Java, C, C++, HTML/CSS), skill level, daily study goals

### 🎨 Premium UI/UX
- Dark-first design with light mode support (next-themes)
- Neural network animated backgrounds
- Hologram AI orb with state-based animations
- Constellation path visualizations
- Smooth page transitions with Framer Motion
- Fully responsive layout

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 4 + Framer Motion |
| **Database** | SQLite (dev) / PostgreSQL (production) via Prisma ORM |
| **AI Engine** | Groq SDK → LLaMA 3.3 70B Versatile |
| **Authentication** | NextAuth.js (Credentials Provider) |
| **State Management** | Zustand |
| **Charts** | Recharts |
| **UI Components** | shadcn/ui |

---

## 📁 Project Structure

```
edumentor-ai/
├── prisma/
│   └── schema.prisma          # Database schema (User, Conversation, Quiz, Progress)
├── src/
│   ├── app/
│   │   ├── (auth)/             # Login & Register pages
│   │   ├── (dashboard)/        # Dashboard, Learn, Quiz, Progress, Settings
│   │   ├── api/                # API routes (chat, conversations, quiz, progress, settings)
│   │   ├── onboarding/         # First-time user onboarding flow
│   │   ├── changelog/          # Product changelog page
│   │   └── pricing/            # Pricing page
│   ├── components/
│   │   ├── chat/               # ChatInterface with full messaging UI
│   │   ├── dashboard/          # Dashboard content & widgets
│   │   ├── layout/             # Sidebar, Header, Footer, Sections
│   │   ├── providers/          # Theme & Session providers
│   │   └── ui/                 # Reusable UI components (FloatingOrb, HologramOrb, etc.)
│   ├── lib/                    # Auth config, DB client, Groq setup, utilities
│   ├── store/                  # Zustand global store
│   └── types/                  # TypeScript type definitions
├── .env.example                # Environment variable template
├── Dockerfile                  # Docker build for deployment
├── render.yaml                 # Render.com deployment blueprint
└── vercel.json                 # Vercel deployment config
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+
- **npm** 10+
- **Groq API Key** — [Get one free at console.groq.com](https://console.groq.com)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Kaxyaa-flux/EduMentor-Ai.git
cd EduMentor-Ai/edumentor-ai

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
# Edit .env.local and add your GROQ_API_KEY

# 4. Initialize the database
npx prisma db push

# 5. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### First-Time Setup

1. **Register** — Create an account at `/register`
2. **Onboarding** — Select your learning topic, skill level, and goals
3. **Settings → AI Config** — Add your Groq API key to enable AI features
4. **Start Learning!** — Use the AI Tutor, take quizzes, and track progress

---

## 🌐 Deployment

### Option 1: Vercel (Recommended)

1. Push your repo to GitHub
2. Import the project on [vercel.com](https://vercel.com)
3. Set the **Root Directory** to `edumentor-ai`
4. Add environment variables:
   - `DATABASE_URL` — Your PostgreSQL connection string
   - `NEXTAUTH_SECRET` — Generate with `openssl rand -base64 32`
   - `NEXTAUTH_URL` — Your production URL
   - `GROQ_API_KEY` — Your Groq API key
5. Deploy!

### Option 2: Render

1. Push your repo to GitHub
2. Go to [render.com](https://render.com) → **New Blueprint**
3. Connect your GitHub repo
4. Render will detect the `render.yaml` and create:
   - A web service (Docker)
   - A PostgreSQL database
5. Add `GROQ_API_KEY` and `NEXTAUTH_URL` manually in the dashboard

---

## 🔑 API Routes

| Endpoint | Method | Description |
|---|---|---|
| `/api/auth/[...nextauth]` | GET/POST | NextAuth authentication |
| `/api/chat` | POST | Send message to AI tutor |
| `/api/conversations` | GET/POST/PATCH/DELETE | Manage chat sessions |
| `/api/quiz/generate` | POST | Generate adaptive quiz |
| `/api/quiz/submit` | POST | Submit quiz answers & get results |
| `/api/progress` | GET | Fetch mastery data & analytics |
| `/api/onboarding` | GET/POST | User preferences |
| `/api/settings/profile` | GET/PATCH | Profile management |
| `/api/settings/groq` | GET/POST/DELETE | Groq API key management |
| `/api/settings/preferences` | PATCH | Learning preferences |

---

## 🧠 How the Adaptive System Works

1. **User takes a quiz** on a topic (e.g., "Variables & Types")
2. **Score updates mastery** — the `Progress` model tracks per-topic mastery scores
3. **Difficulty adapts** — next quiz difficulty is chosen based on mastery:
   - 0-40% → Beginner questions
   - 41-70% → Intermediate questions
   - 71-100% → Advanced questions
4. **Weak topics detected** — topics below 60% mastery are flagged for review
5. **AI tutor personalizes** — chat responses adapt to the student's skill level and learning goals

---

## 👥 Team

- **Kanak Bharara** — [@Kaxyaa-flux](https://github.com/Kaxyaa-flux)
- **Akhil Biju Varghese** — [@DeadlyPro34](https://github.com/DeadlyPro34)
- **Shivaxi Dave** — [@shivaxidave510-ui](https://github.com/shivaxidave510-ui)
- **Ayushi Bhundiya**

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](../LICENSE) file for details.
