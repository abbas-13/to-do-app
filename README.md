# To-Do App

An easy to use to-do app that helps in task management.

### Features

Login: Login using Google

Create Tasks: Easily add new tasks to your to-do list.

Delete Tasks: Remove tasks that are no longer needed.

Check off Tasks: Mark tasks as completed once they are done.


**[Live running demo](https://to-do-app-server-qkgr.onrender.com/)**

## Installation

Clone the repo:

`git clone https://github.com/abbas-13-to-do-app-`

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
