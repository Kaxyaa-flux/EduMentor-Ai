# IMPLEMENTATION_PLAN.md

# EduMentor AI

## Implementation Plan

Version: 2.0

Status: MVP

Duration: 7 Days

Team Size: 4 Developers

---

# Project Goal

Build a production-ready MVP that enables users to:

* Register and authenticate
* Complete onboarding
* Learn Python with an AI tutor
* Maintain persistent chat sessions
* Generate adaptive quizzes
* Track learning progress
* Resume previous learning sessions

---

# Development Strategy

The project will follow a vertical-slice approach.

Each day should produce deployable functionality.

Deployment begins on Day 1 and continues throughout development.

---

# Development Timeline

```text
Day 1 → Project Setup & Deployment
Day 2 → Authentication
Day 3 → Database & Security
Day 4 → Dashboard & Learning Sessions
Day 5 → AI Tutor Integration
Day 6 → Adaptive Quiz System
Day 7 → Progress Tracking & Final QA
```

---

# DAY 1

# Project Setup & Continuous Deployment

## Goals

* Create project foundation
* Configure infrastructure
* Deploy immediately

---

## Tasks

### Repository Setup

```bash
git init
git remote add origin <repository>
```

---

### Next.js Setup

```bash
npx create-next-app@latest
```

Configuration:

* TypeScript
* App Router
* Tailwind CSS

---

### Install Dependencies

```bash
npm install

@supabase/supabase-js
groq-sdk
react-hook-form
zod
lucide-react
recharts
```

---

### Configure Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=

SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
```

---

### Deploy to Render

Create:

* Render Web Service
* GitHub Integration
* Auto Deploy

Deploy landing page immediately.

---

## Deliverables

* Repository Ready
* Render Deployment Live
* Continuous Deployment Active
* Environment Variables Configured

---

# DAY 2

# Authentication System

## Goals

Implement secure authentication.

---

## Pages

```text
/login

/register
```

---

## Features

### Registration

* Name
* Email
* Password

---

### Login

* Email
* Password

---

### Session Management

* Protected Routes
* Authentication Middleware
* Logout

---

## Deliverables

Users can:

* Register
* Login
* Logout

---

# DAY 3

# Database & Security Foundation

## Goals

Create database schema and secure it properly.

---

## Database Setup

Enable pgvector.

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

---

## Create Tables

* profiles
* user_preferences
* conversations
* messages
* quizzes
* quiz_results
* progress
* learning_analytics
* api_usage
* knowledge_chunks

---

# Security Setup

## Enable Row Level Security

Enable RLS on:

* profiles
* user_preferences
* conversations
* messages
* quizzes
* quiz_results
* progress
* learning_analytics
* api_usage

---

## Create RLS Policies

Ensure users only access:

* Their chats
* Their quizzes
* Their analytics
* Their preferences

---

## User Isolation Testing

Verify:

```text
User A cannot access User B data
```

---

## Onboarding

Route:

```text
/onboarding
```

Collect:

* Learning Topic
* Skill Level
* Learning Goal
* Daily Study Time

---

## Deliverables

* Database Created
* pgvector Enabled
* RLS Enabled
* Policies Created
* User Isolation Verified
* Onboarding Functional

---

# DAY 4

# Dashboard & Learning Sessions

## Goals

Create persistent learning sessions.

---

## Dashboard

Route:

```text
/dashboard
```

Components:

* Continue Learning
* Progress Overview
* Recent Sessions
* Weak Topics

---

## Learning Page

Route:

```text
/dashboard/learn
```

---

## Features

* Create Session
* Rename Session
* Delete Session
* Resume Session

---

## Database Operations

* Create Conversation
* Fetch Conversations
* Fetch Messages
* Delete Conversations

---

## Deliverables

* Dashboard Functional
* Session History Functional
* Persistent Learning Sessions

---

# DAY 5

# AI Tutor Integration

## Goals

Integrate Groq and secure API communication.

---

## API Route

```text
/api/chat
```

---

## Architecture

```text
Frontend
     ↓
POST /api/chat
     ↓
Server
     ↓
Groq
     ↓
Server
     ↓
Frontend
```

---

## Context Strategy

To avoid context overflow:

Send:

* Last 15 Messages
* Current User Message

Future:

* Top Knowledge Chunks

---

## Quick Actions

* Explain Simpler
* Show Example
* Generate Practice Challenge
* Explain Like Beginner

---

## Rate Limiting

Track usage using:

```text
api_usage
```

Limits:

```text
100 Chat Requests / Day
```

per user.

---

## Deliverables

* Groq Connected
* Secure API Layer
* Persistent Chat Storage
* Rate Limiting Functional

---

# DAY 6

# Adaptive Quiz System

## Goals

Build personalized assessments.

---

## Quiz Page

Route:

```text
/dashboard/quiz
```

---

## Features

* Generate Quiz
* Submit Quiz
* Quiz History
* Quiz Review

---

## Adaptive Learning Logic

Retrieve:

```text
Progress
```

Calculate:

```text
Mastery Score
```

Determine:

```text
Difficulty Level
```

Rules:

| Mastery Score | Difficulty   |
| ------------- | ------------ |
| 0 - 40        | Beginner     |
| 41 - 70       | Intermediate |
| 71 - 100      | Advanced     |

---

## API Routes

```text
/api/quiz/generate

/api/quiz/submit

/api/quiz/history
```

---

## Rate Limits

```text
50 Quiz Generations / Day
```

per user.

---

## Deliverables

* Adaptive Quiz Generation
* Quiz Evaluation
* Quiz History
* Difficulty Personalization

---

# DAY 7

# Progress Tracking & Final QA

## Goals

Complete analytics and verify application quality.

---

## Progress Page

Route:

```text
/dashboard/progress
```

---

## Components

* Topic Mastery
* Quiz Performance
* Learning Activity
* Weak Topics

---

## Progress Updates

Automatically update after:

* Quiz Submission
* Session Completion

---

## Final Testing

### Authentication

* Registration
* Login
* Logout

---

### Database

* RLS Policies
* User Isolation

---

### Sessions

* Create
* Rename
* Delete
* Resume

---

### AI Tutor

* Response Generation
* Message Storage

---

### Quiz

* Generation
* Submission
* Scoring

---

### Analytics

* Progress Updates
* Dashboard Metrics

---

## Deployment Verification

Verify:

* Render Deployment
* Supabase Connectivity
* Environment Variables
* HTTPS

---

## Deliverables

* Fully Functional MVP
* Production Deployment
* Security Validation
* Final Demo Ready

---

# Backend Services

## Authentication Service

```text
services/auth.service.ts
```

Responsibilities:

* Register
* Login
* Logout
* Session Validation

---

## Conversation Service

```text
services/conversation.service.ts
```

Responsibilities:

* Create Sessions
* Fetch Sessions
* Rename Sessions
* Delete Sessions

---

## Chat Service

```text
services/chat.service.ts
```

Responsibilities:

* Build Prompt
* Load History
* Call Groq
* Store Responses

---

## Quiz Service

```text
services/quiz.service.ts
```

Responsibilities:

* Generate Adaptive Quiz
* Evaluate Answers
* Store Results

---

## Progress Service

```text
services/progress.service.ts
```

Responsibilities:

* Calculate Mastery
* Update Analytics
* Identify Weak Topics

---

## Rate Limit Service

```text
services/rate-limit.service.ts
```

Responsibilities:

* Track Usage
* Enforce Limits
* Prevent Abuse

---

# MVP Completion Criteria

The MVP is complete when a user can:

1. Register an account.
2. Complete onboarding.
3. Start a learning session.
4. Chat with the AI tutor.
5. Generate adaptive quizzes.
6. Submit quiz answers.
7. View learning analytics.
8. Resume previous sessions.

---

# Phase 2 Roadmap

Not included in MVP.

* Voice Tutor
* JavaScript Learning Track
* File Uploads
* AI Learning Roadmaps
* Code Execution Sandbox
* Teacher Dashboard
* Parent Dashboard
* Certificates
* Collaborative Learning

---

# Success Definition

A new user should be able to:

Register
→ Complete Onboarding
→ Learn Python
→ Generate Quiz
→ Improve Mastery
→ View Progress
→ Return Later

without external assistance.

If this workflow functions successfully, the MVP is considered complete.