# SECURITY_AND_PRIVACY.md

# EduMentor AI

## Security & Privacy Document

Version: 2.0

Status: MVP

---

# Purpose

This document defines the security, privacy, data protection, authentication, authorization, and API security standards for EduMentor AI.

The goal is to ensure:

* User data remains private
* AI credentials remain secure
* Conversations remain protected
* Unauthorized access is prevented
* Future scaling remains secure

---

# Security Principles

EduMentor AI follows five core principles:

1. Least Privilege Access
2. Secure By Default
3. Private User Data
4. Server-Side AI Access
5. Zero Trust Architecture

---

# Security Architecture

```text
Browser
    ↓
Next.js Frontend
    ↓
Protected API Routes
    ↓
Supabase Database
    ↓
Groq API
```

All sensitive operations occur on the server.

The browser never communicates directly with Groq.

---

# API Key Protection

## Requirement

The Groq API key must never be exposed to users.

---

## Allowed Flow

```text
Browser
    ↓
POST /api/chat
    ↓
Server
    ↓
Groq
```

---

## Forbidden Flow

```text
Browser
    ↓
Groq
```

This would expose the API key and must never be implemented.

---

# Environment Variables

## Public Variables

Safe for browser usage.

```env
NEXT_PUBLIC_SUPABASE_URL=

NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

---

## Private Variables

Server-side only.

```env
SUPABASE_SERVICE_ROLE_KEY=

GROQ_API_KEY=
```

---

# Security Rule

Never:

* Commit keys to Git
* Store keys in frontend code
* Store keys in public repositories
* Log keys to console

---

# Authentication Security

Provider:

```text
Supabase Auth
```

---

## Authentication Methods

Supported:

* Email + Password

Future:

* Google OAuth
* GitHub OAuth

---

## Session Management

Every protected request must verify:

```text
User Session
```

before executing logic.

---

# Protected Routes

Require authentication.

```text
/dashboard

/dashboard/learn

/dashboard/quiz

/dashboard/progress

/profile

/settings
```

Unauthenticated users must be redirected to:

```text
/login
```

---

# Authorization Security

Authentication answers:

```text
Who are you?
```

Authorization answers:

```text
What are you allowed to access?
```

Both are required.

---

# Row Level Security (RLS)

## Requirement

RLS is mandatory.

If RLS is not enabled, the system is considered insecure and must not be deployed.

---

## Required Tables

Enable RLS on:

```text
profiles

user_preferences

conversations

messages

quizzes

quiz_results

progress

learning_analytics

api_usage
```

---

# Example Policy

```sql
CREATE POLICY "Users can access only their own data"
ON conversations
FOR ALL
USING (
    auth.uid() = user_id
);
```

---

# User Data Isolation

Requirement:

```text
User A must never access User B data.
```

Applies to:

* Chats
* Quizzes
* Analytics
* Preferences
* Progress

---

# Chat Security

All conversations are private.

---

## Message Storage

Messages are stored in:

```text
messages
```

table.

---

## Ownership Verification

Before loading chat history:

```text
Verify User
      ↓
Verify Conversation Owner
      ↓
Return Messages
```

---

# Conversation Privacy Rules

Users may:

* Read their own conversations
* Delete their own conversations

Users may not:

* Access other conversations
* Modify other conversations
* Delete other conversations

---

# AI Privacy Rules

User prompts are sent to Groq for processing.

No prompt data should be:

* Shared publicly
* Logged unnecessarily
* Exposed to other users

---

# Data Storage Policy

Stored Data:

* User Profile
* Learning Preferences
* Learning Sessions
* Chat Messages
* Quiz Results
* Progress Metrics

---

# Sensitive Data Policy

Never store:

* Passwords
* API Keys
* Access Tokens
* Credit Card Data

Passwords are managed entirely by Supabase Auth.

---

# Rate Limiting

Purpose:

* Prevent Abuse
* Protect Infrastructure
* Reduce API Costs

---

# Chat Limits

Per User:

```text
100 Requests / Day
```

---

# Quiz Limits

Per User:

```text
50 Quiz Generations / Day
```

---

# Rate Limiting Flow

```text
Incoming Request
        ↓
Check api_usage
        ↓
Limit Reached?
        ↓
Yes → Reject

No → Continue
```

---

# Database Security

Provider:

```text
Supabase PostgreSQL
```

---

## Access Rules

Only backend services may perform privileged operations.

Frontend should use:

```text
Supabase Authenticated Client
```

only.

---

# Service Role Key Security

The service role key:

```env
SUPABASE_SERVICE_ROLE_KEY
```

must remain server-side.

Never expose it to the browser.

---

# Input Validation

All user input must be validated.

Recommended:

```text
Zod
```

---

# Validation Targets

* Registration
* Login
* Chat Messages
* Quiz Requests
* Profile Updates

---

# Error Handling Security

Never expose:

* Stack traces
* SQL errors
* Internal exceptions
* API secrets

---

## Safe Error Example

```json
{
  "success": false,
  "message": "Something went wrong."
}
```

---

# Logging Policy

Allowed:

* API Errors
* Database Errors
* Performance Metrics

---

Forbidden:

* Passwords
* Access Tokens
* API Keys
* Full Chat Content

---

# HTTPS Requirement

Production deployment must use:

```text
HTTPS
```

All communication must be encrypted in transit.

---

# Security Testing Checklist

Before deployment verify:

### Authentication

* Register
* Login
* Logout

---

### Authorization

* User Isolation
* Protected Routes

---

### Database

* RLS Enabled
* Policies Working

---

### API Security

* Groq Key Hidden
* Service Role Hidden

---

### Chat Security

* User Ownership Verified
* Conversation Isolation Verified

---

### Rate Limiting

* Chat Limits Working
* Quiz Limits Working

---

# Privacy Policy Summary

EduMentor AI collects only the information required to provide learning services.

Collected Data:

* Name
* Email
* Learning Preferences
* Chat History
* Quiz Results
* Progress Metrics

---

EduMentor AI does not:

* Sell user data
* Share user data with other users
* Expose conversations publicly

---

# Incident Response Plan

If a security issue is discovered:

1. Disable affected functionality.
2. Revoke compromised credentials.
3. Rotate API keys.
4. Review logs.
5. Patch vulnerability.
6. Redeploy application.

---

# MVP Security Acceptance Criteria

The system is considered secure when:

* Groq API key remains private.
* Service role key remains private.
* RLS is enabled on all required tables.
* User isolation is verified.
* Protected routes require authentication.
* Rate limiting is enforced.
* Chat history remains private.
* HTTPS is enabled.
* No sensitive information is logged.

---

# Final Security Objective

Every user should be able to learn, chat, take quizzes, and track progress with confidence that:

* Their account is protected.
* Their conversations remain private.
* Their learning data is secure.
* Their information is never exposed to other users.

Security is a core feature of EduMentor AI, not an afterthought.