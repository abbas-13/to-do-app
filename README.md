# AI-Powered Task Manager

A full-stack task management app with an AI planning feature that automatically 
breaks down any project into prioritised, deadline-assigned subtasks.

**[Live Demo](https://to-do-app-server-qkgr.onrender.com/)**

---

## ✨ AI Feature — Project Breakdown

Click **"Plan with AI"**, describe a project in plain English, and the app 
automatically generates 3–6 subtasks with priorities and deadlines assigned.

Powered by **Groq (LLaMA 3.1)** via structured JSON prompts.

---

## Features

- **AI Project Breakdown** — describe a project, get subtasks with priorities 
  and deadlines auto-assigned
- **Google OAuth** — sign in with Google via Passport.js
- **Task Management** — create, complete, and delete tasks across multiple lists
- **Filtering** — filter tasks by priority, completion status, or deadline range
- **Theme Switching** — light and dark mode
- **Search** — search lists by name

---

## Tech Stack

**Frontend**
React.js · TypeScript · Tailwind CSS · shadcn/ui · React Router · Lucide React · Vite

**Backend**
Node.js · Express.js · MongoDB · Mongoose · Passport.js (Google OAuth)

**AI**
Groq API (LLaMA 3.1 8B) · Structured JSON prompt engineering

---

## Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/abbas-13/to-do-app
npm i
cd client && npm i
```

Set up environment variables in `.env`:
