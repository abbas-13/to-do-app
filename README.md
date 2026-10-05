# AI-Powered Task Manager

<<<<<<< Updated upstream
A full-stack task management app with an AI planning feature that automatically 
breaks down any project into prioritised, deadline-assigned subtasks.
=======
An AI powered, easy to use to-do app that helps in task management.
>>>>>>> Stashed changes

**[Live Demo](https://to-do-app-server-qkgr.onrender.com/)**

---

## ✨ AI Feature — Project Breakdown

Click **"Plan with AI"**, describe a project in plain English, and the app 
automatically generates 3–6 subtasks with priorities and deadlines assigned.

Powered by **Groq (LLaMA 3.1)** via structured JSON prompts.

<<<<<<< Updated upstream
---
=======
Plan with AI: Describe a project in a sentence and AI breaks it into subtasks with priorities and deadlines.

Analytics: Track completed, active and overdue tasks, completion rate, per-priority counts and average time to complete — for all lists combined or scoped to a single list.
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
Set up environment variables in `.env`:
=======
Navigate to the directory and install dependencies:

`npm i`

Install dependencies of the client side:

`cd client` <br/>
`npm i`

Run the app:

`npm run dev`

Setup environment variables:

.env.development

`MONGO_URI="mongodb+srv://..."` <br/>
`NODE_ENV=development` <br/>
`GOOGLE_CLIENT_ID="..."` <br/>
`GOOGLE_CLIENT_SECRET="...` <br/>
`COOKIE_KEY="..."` <br/>

Open your web browser and go to (http://localhost:3000) to view the app.

# Usage

Login: Click on "Sign in with Google" to sign in

Theme: On the top right corner, click on the avatar and select either light or dark theme.

Create a list: Click on "Create List" to create a list and add the name.

Adding a Task: Click on the "Add Task +" button and use the input fields to add a new task.

Deleting a Task: Click on the elipses icon and select "Delete" to delete the task.

Checking off a Task: Click on the checkbox next to a task to mark it as completed.

Switching Lists: Click on any list in the sidebar to switch and view the tasks in that list.

Searching Lists: Enter a keyword in the search bar to search for the list by name.

Analytics: After signing in you land on the "All Lists" overview with combined analytics. Selecting a list shows analytics scoped to that list, and "Overview" in the sidebar returns to the combined view.

Plan with AI: Click "Plan With AI" in the sidebar, enter a project title and submit — a new list is created with AI-generated subtasks, priorities and deadlines.

## Tech used:

- Powered by Vite
- Created with React.js + TypeScript
- ShadCN for components
- TailwindCSS for styling
- React Router for routing
- Luicide React for icons
- Node.js - Express.js for APIs
- Passport.js for OAuth
- MongoDB for data storage and mongoose
- Groq (LLaMA) for AI task planning
>>>>>>> Stashed changes
