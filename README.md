# 🚀 Team Task Manager — Project & Task Management App

> A full-stack web app where teams can create projects, give tasks to members, and see how work is going. It has **login system with roles** (Admin and Member), built with **React + Node.js + MongoDB** and live on **Railway**.

🌐 **Live App:** [https://team-task-manager-production-f241.up.railway.app](https://team-task-manager-production-f241.up.railway.app)

> 💡 Use the **Demo Login** buttons on the login page to try Admin or Member access instantly.

---

## 📋 Table of Contents

1. [What This Project Does](#-what-this-project-does)
2. [Features](#-features)
3. [Technologies Used](#-technologies-used)
4. [How The App Is Built](#-how-the-app-is-built)
5. [Folder Structure](#-folder-structure)
6. [How To Run Locally](#-how-to-run-locally)
7. [API Endpoints](#-api-endpoints)
8. [User Roles & Permissions](#-user-roles--permissions)
9. [How We Deployed It](#-how-we-deployed-it)
10. [How Data Is Stored](#-how-data-is-stored)
11. [Security](#-security)
12. [Common Problems & Fixes](#-common-problems--fixes)
13. [What We Can Add Next](#-what-we-can-add-next)

---

## 📌 What This Project Does

**Team Task Manager** is a web app that helps teams work together better. Think of it like a digital office board where you can:

- Create projects (like "Build a Website" or "Marketing Plan")
- Break each project into small tasks (like "Design login page" or "Write content")
- Give tasks to team members
- Track if tasks are done, in progress, or late

The app has a dark-themed design called **"Cyber Deep"** which looks modern and clean.

### What Makes It Special

- **One App, One Deploy** — Both the website (React) and the server (Node.js) live in one folder and deploy together
- **No Database Needed To Start** — If you don't have MongoDB set up, the app creates a temporary one in memory
- **Auto Demo Data** — When the app starts fresh, it creates sample users and tasks so you can test right away
- **Quick Demo Login** — Just click "Admin User" or "Member User" button to login instantly
- **Already Live** — The app is deployed and running on Railway right now

---

## ✨ Features

### 🔐 Login & Signup
- Users can **register** with name, email, and password
- **Login** gives you a token (JWT) that keeps you logged in
- You can **update your profile** — change name, picture
- You can **change your password** with the old password check
- Pages that need login will **send you back to login page** if you're not logged in
- **Demo buttons** — click one button to fill in admin or member login details

### 📁 Projects
- **Create new projects** with a title, description, and deadline
- **Edit or delete** your projects
- Set project **status** — Active, On Hold, Completed, or Archived
- Set **how important** it is — Low, Medium, High, or Critical
- Add a **color label** to each project
- See a **progress bar** showing how many tasks are done

### 👥 Team
- **Add team members** to a project using their email
- Give them a **role** — Admin or Member
- **Remove members** from the project (only Admins can do this)
- The person who made the project can never be removed

### ✅ Tasks
- **Create tasks** inside any project
- Set task **status** — To Do, In Progress, Review, or Done
- Set **priority** — Low, Medium, High, or Critical (with colors)
- **Assign a task** to any member of that project
- Set a **due date** — late tasks get marked with a warning sign
- Add **tags** like "frontend", "bug", "urgent"
- **Change status quickly** using a dropdown right on the card
- **Add comments** on any task to discuss it

### 📊 Dashboard (Home Page)
- **Greeting** that changes by time — "Good morning", "Good afternoon", etc.
- **6 number boxes** showing: Total Tasks, In Progress, Done, Late, My Tasks, Projects
- **Recent tasks** list — click on any task status to change it
- **Projects list** with progress bars

### 🗂️ Different Views
- **Kanban Board** — tasks shown in columns by status (like Trello)
- **Table View** — tasks in a list with all details
- **Members View** — see and manage team members

### 🔍 Search & Filter
- Filter tasks by **project, status, priority**, or **search words**
- **Clear all filters** with one click
- Search projects by name

---

## 🛠 Technologies Used

### Backend (Server Side)
| Tool | What It Does |
|---|---|
| **Node.js** | Runs JavaScript on the server |
| **Express.js** | Makes it easy to create API routes |
| **MongoDB** | Database that stores all data |
| **Mongoose** | Helps talk to MongoDB with easy-to-use code |
| **JWT** | Creates login tokens so users stay logged in |
| **bcryptjs** | Hides passwords so no one can read them |
| **express-validator** | Checks if user input is correct |
| **mongodb-memory-server** | Creates a temporary database if no real one is given |
| **cors** | Lets the frontend talk to the backend |
| **dotenv** | Reads secret settings from a file |

### Frontend (What Users See)
| Tool | What It Does |
|---|---|
| **React 18** | Builds the user interface |
| **React Router v6** | Handles page navigation without reload |
| **Axios** | Sends requests to the backend API |
| **react-hot-toast** | Shows pop-up messages (like "Task created!") |
| **date-fns** | Makes dates look nice (like "May 2, 2026") |
| **Context API** | Shares login info across all pages |
| **CSS (custom)** | Our own dark theme called "Cyber Deep" |

### Hosting & Deployment
| Service | What It Does |
|---|---|
| **Railway** | Hosts our app on the internet |
| **GitHub** | Stores our code and auto-deploys when we push |
| **MongoDB Atlas** | Cloud database (optional — app works without it too) |

---

## 🏗 How The App Is Built

### The Big Picture

```
┌─────────────────────────────────────────────────────────────┐
│                    USER'S BROWSER                            │
│                                                              │
│  React App (What you see and click)                         │
│  ┌────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐           │
│  │ Login  │ │Dashboard │ │Projects  │ │ Tasks  │           │
│  │ Page   │ │  Page    │ │  Page    │ │  Page  │           │
│  └────────┘ └──────────┘ └──────────┘ └────────┘           │
│                                                              │
│  Login Info (JWT Token) is saved in the browser              │
│  Axios sends requests to the server with that token          │
└──────────────────────────┬───────────────────────────────────┘
                           │ Sends requests over the internet
                           ▼
┌─────────────────────────────────────────────────────────────┐
│                   RAILWAY SERVER                             │
│                                                              │
│  Express.js (Handles all the logic)                         │
│  ┌─────────────────────────────────────────────────────┐    │
│  │ API Routes                                           │    │
│  │ /api/auth     → Login, Signup, Profile               │    │
│  │ /api/projects → Create, Edit, Delete projects        │    │
│  │ /api/tasks    → Create, Edit, Delete, Comment tasks  │    │
│  │ /api/users    → Search users                         │    │
│  └─────────────┬───────────────────────────────────────┘    │
│                │                                             │
│  Security Checks (runs before every request):               │
│  1. Is the login token valid? (JWT check)                   │
│  2. Does this user have permission? (Role check)            │
│  3. Is the data correct? (Input check)                      │
│                │                                             │
│  Mongoose (talks to the database)                           │
│                │                                             │
│  Also serves the React website files                        │
└────────────────┼────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│                    DATABASE (MongoDB)                        │
│                                                              │
│  3 Collections:                                              │
│  ┌────────┐  ┌───────────┐  ┌─────────┐                    │
│  │ Users  │  │ Projects  │  │  Tasks  │                    │
│  └────────┘  └───────────┘  └─────────┘                    │
└─────────────────────────────────────────────────────────────┘
```

### How A Request Works

```
You click "Create Task"
        │
        ▼
React sends a request (with your login token)
        │
        ▼
Express server gets it
        │
        ├── Step 1: Check if your token is real ✓
        ├── Step 2: Check if you're allowed to do this ✓
        ├── Step 3: Check if the data looks right ✓
        │
        ▼
Save the new task to MongoDB
        │
        ▼
Send back the result
        │
        ▼
React shows the new task on your screen
```

---

## 📂 Folder Structure

```
team-task-manager/
├── backend/                           # Server code
│   ├── src/
│   │   ├── config/
│   │   │   └── seed.js               # Creates sample data
│   │   ├── controllers/
│   │   │   ├── auth.controller.js    # Login, Signup, Profile logic
│   │   │   ├── project.controller.js # Project create/edit/delete logic
│   │   │   └── task.controller.js    # Task create/edit/delete logic
│   │   ├── middleware/
│   │   │   └── auth.middleware.js    # Checks login token & user role
│   │   ├── models/
│   │   │   ├── User.js              # What a user looks like in database
│   │   │   ├── Project.js           # What a project looks like
│   │   │   └── Task.js              # What a task looks like
│   │   ├── routes/
│   │   │   ├── auth.routes.js       # /api/auth/login, /register, etc.
│   │   │   ├── project.routes.js    # /api/projects endpoints
│   │   │   ├── task.routes.js       # /api/tasks endpoints
│   │   │   └── user.routes.js       # /api/users endpoints
│   │   └── server.js                # Main file — starts everything
│   └── package.json
│
├── frontend/                          # Website code (what users see)
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskModal.js          # Pop-up form to create/edit tasks
│   │   │   └── layout/
│   │   │       ├── Layout.js         # Sidebar menu + top bar
│   │   │       └── Layout.css
│   │   ├── context/
│   │   │   └── AuthContext.js        # Saves login info for all pages
│   │   ├── pages/
│   │   │   ├── LoginPage.js          # Login form + demo buttons
│   │   │   ├── RegisterPage.js       # Signup form
│   │   │   ├── DashboardPage.js      # Home page with stats
│   │   │   ├── ProjectsPage.js       # All projects grid
│   │   │   ├── ProjectDetailPage.js  # One project — Kanban, list, team
│   │   │   ├── TasksPage.js          # All tasks with filters
│   │   │   └── ProfilePage.js        # Edit your profile
│   │   ├── styles/
│   │   │   └── global.css            # Dark theme colors & styles
│   │   ├── utils/
│   │   │   └── api.js                # Sets up Axios to talk to server
│   │   ├── App.js                    # All page routes defined here
│   │   └── index.js                  # App starts here
│   └── package.json
│
├── package.json                       # Root file for building everything
├── railway.toml                       # Tells Railway how to build & run
├── nixpacks.toml                      # Extra settings for Railway
├── Procfile                           # Backup run command
└── README.md                         # This file
```

---

## 🚀 How To Run Locally

### What You Need First

- **Node.js** version 18 or higher
- **npm** (comes with Node.js)
- **Git**
- **MongoDB** — optional! The app works without it

### Steps

#### 1. Download the code

```bash
git clone https://github.com/AnujSinghNit/Team-Task-Manager.git
cd Team-Task-Manager
```

#### 2. Install everything

```bash
# Go to backend folder and install
cd backend && npm install

# Go to frontend folder and install
cd ../frontend && npm install
```

#### 3. Set up settings (optional)

Create a file called `.env` inside the `backend/` folder:

```env
PORT=5001
NODE_ENV=development
JWT_SECRET=any_secret_word_here
```

> 💡 **Don't have MongoDB?** That's fine! The app will create a temporary database in memory and add sample data.

#### 4. Start the app

**Terminal 1 — Start the server:**
```bash
cd backend
npm run dev
# You'll see: ✅ Server running on port 5001
# You'll see: ✅ Connected to MongoDB
# You'll see: 🌱 Demo data created!
```

**Terminal 2 — Start the website:**
```bash
cd frontend
npm start
# Opens http://localhost:3000
```

#### 5. Login and try it

Open `http://localhost:3000` → Click the **"Admin User"** or **"Member User"** demo button → Click **Sign In**

---

## 📡 API Endpoints

**Base URL:** `https://team-task-manager-production-f241.up.railway.app/api`

Every request (except login/register) needs this header:
```
Authorization: Bearer YOUR_LOGIN_TOKEN
```

### Login & Signup

| Method | URL | Needs Login? | What It Does |
|--------|-----|:---:|-------------|
| `POST` | `/api/auth/register` | ❌ | Create a new account |
| `POST` | `/api/auth/login` | ❌ | Login and get a token |
| `GET` | `/api/auth/me` | ✅ | Get your profile info |
| `PUT` | `/api/auth/profile` | ✅ | Update your name or picture |
| `PUT` | `/api/auth/change-password` | ✅ | Change your password |

### Projects

| Method | URL | Who Can Do It | What It Does |
|--------|-----|:---:|-------------|
| `GET` | `/api/projects` | Any logged-in user | See your projects |
| `POST` | `/api/projects` | Any logged-in user | Create a new project |
| `GET` | `/api/projects/:id` | Project member | See one project |
| `PUT` | `/api/projects/:id` | Admin only | Edit a project |
| `DELETE` | `/api/projects/:id` | Owner only | Delete project + all its tasks |
| `POST` | `/api/projects/:id/members` | Admin only | Add a member to the project |
| `DELETE` | `/api/projects/:id/members/:userId` | Admin only | Remove a member |

### Tasks

| Method | URL | What It Does |
|--------|-----|-------------|
| `GET` | `/api/tasks` | Get tasks (you can filter them) |
| `POST` | `/api/tasks` | Create a new task |
| `GET` | `/api/tasks/:id` | See one task |
| `PUT` | `/api/tasks/:id` | Edit a task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `POST` | `/api/tasks/:id/comments` | Add a comment to a task |
| `GET` | `/api/tasks/dashboard/stats` | Get numbers for the dashboard |

**Filters you can use with `GET /api/tasks`:**
```
?project=ID
?status=todo OR in-progress OR review OR done
?priority=low OR medium OR high OR critical
?search=any word
?page=1&limit=50
```

### Users

| Method | URL | What It Does |
|--------|-----|-------------|
| `GET` | `/api/users/search?email=` | Find a user by email |
| `GET` | `/api/users/:id` | Get user details |

---

## 🔐 User Roles & Permissions

There are 3 levels of access:

| What You Can Do | Owner | Admin | Member |
|----------------|:-----:|:-----:|:------:|
| See the project | ✅ | ✅ | ✅ |
| Create and edit tasks | ✅ | ✅ | ✅ |
| Delete any task | ✅ | ✅ | Only your own |
| Edit project name/details | ✅ | ✅ | ❌ |
| Add or remove members | ✅ | ✅ | ❌ |
| Delete the whole project | ✅ | ❌ | ❌ |

> **Note:** When you create a project, you become the **Owner** with **Admin** powers. You can never be removed from your own project.

---

## ☁️ How We Deployed It

### The Deployment Flow (GitHub → Railway → Live App)

The app uses a **single-service setup** — one Railway service runs both the React website and the Node.js server together.

```
Step 1: Developer pushes code to GitHub
            │
            ▼
Step 2: Railway sees the new code (auto-deploy is ON)
            │
            ▼
Step 3: Railway builds the app:
            ├── Installs backend packages (npm install)
            ├── Installs frontend packages (npm install)
            └── Builds the React website (npm run build)
            │
            ▼
Step 4: Railway starts the server:
            └── node backend/src/server.js
                ├── Connects to MongoDB (or creates temporary one)
                ├── Creates demo data if database is empty
                ├── Serves API on /api/*
                └── Serves React website on everything else
            │
            ▼
Step 5: App is live at the Railway URL! ✅
```

### Settings We Used

**`railway.toml`** — Tells Railway what to do:
```toml
[build]
builder = "NIXPACKS"
installCommand = "echo 'Skipping default install'"
buildCommand = "cd backend && npm install && cd ../frontend && npm install && CI=false npm run build"

[deploy]
startCommand = "PORT=5001 NODE_ENV=production node backend/src/server.js"
```

### Environment Variables (set in Railway dashboard)

| Name | Value | Why We Need It |
|------|-------|----------------|
| `NODE_ENV` | `production` | Makes the server serve the React website |
| `JWT_SECRET` | `(secret)` | Used to create login tokens |
| `MONGODB_URI` | `(database link)` | Where to save data |

### Problems We Fixed During Deployment

| # | Problem | Why It Happened | How We Fixed It |
|---|---------|----------------|-----------------|
| 1 | Build failed with `npm ci` error | Package files were out of sync | Used custom install command that runs `npm install` instead |
| 2 | Build failed because of "warnings" | Railway treats warnings as errors (CI=true) | Added `CI=false` so warnings don't stop the build |
| 3 | Website showed "502 Bad Gateway" | The port number didn't match | Set `PORT=5001` directly in the start command |
| 4 | Website showed blank page | React files weren't being served | Added `NODE_ENV=production` to turn on file serving |
| 5 | Home page showed "Backend Running" text | The root route was showing server info instead of React | Made that page only show in development mode |
| 6 | Server couldn't be reached | Server was only listening on localhost | Changed to listen on `0.0.0.0` (all addresses) |
| 7 | API calls were blocked | CORS was too strict | Made CORS accept Railway domain addresses |

---

## 🧠 How Data Is Stored

### Database Tables (Collections)

We use MongoDB which stores data as documents (like JSON files):

```
┌──────────────┐       ┌────────────────────┐       ┌──────────────────┐
│    Users     │       │     Projects       │       │      Tasks       │
├──────────────┤       ├────────────────────┤       ├──────────────────┤
│ _id          │◄──────│ owner (→ User)     │       │ _id              │
│ name         │       │ name               │◄──────│ project (→ Proj) │
│ email        │◄──┐   │ description        │       │ title            │
│ password     │   │   │ status             │       │ description      │
│ avatar       │   │   │ priority           │   ┌──►│ assignee (→ User)│
│ isActive     │   │   │ deadline           │   │   │ status           │
└──────────────┘   │   │ color              │   │   │ priority         │
                   │   │ members: [         │   │   │ dueDate          │
                   │   │   user (→ User) ───┼───┘   │ tags: []         │
                   │   │   role (Admin/     │       │ comments: [      │
                   │   │         Member)    │       │   user (→ User)  │
                   │   │ ]                  │       │   text           │
                   │   └────────────────────┘       │ ]                │
                   │                                │ createdBy(→User) │
                   └────────────────────────────────└──────────────────┘
```

### 3 Database Modes

| When | Which Database | Data Saved Forever? | When To Use |
|------|----------------|:---:|------|
| **Live app** | MongoDB Atlas (cloud) | ✅ Yes | When the app is running on Railway |
| **Your computer** | Local MongoDB | ✅ Yes | When you develop on your own machine |
| **No database** | Temporary in-memory | ❌ No (resets on restart) | Quick testing — no setup needed |

### How Data Flows

```
You do something on the website (like click "Add Task")
    │
    ▼
React sends a request using Axios (with your login token)
    │
    ▼
Express server gets the request
    │
    ├── 1. Checks your login token is real
    ├── 2. Checks you have the right role
    ├── 3. Checks the data is valid
    │
    ▼
Controller runs the business logic
    │
    ▼
Mongoose saves/reads data from MongoDB
    │
    ▼
Result sent back to React → Screen updates
```

---

## 🔒 Security

| What We Protect | How We Do It |
|----------------|--------------|
| **Passwords** | Hashed with bcrypt (12 rounds) — nobody can read them |
| **Login sessions** | JWT tokens that expire after 7 days |
| **Who can do what** | Middleware checks your role before every action |
| **Cross-site requests** | CORS only allows our own frontend and Railway domains |
| **Bad input** | express-validator checks every form submission |
| **Database attacks** | Mongoose only accepts data that matches our schemas |
| **Error details** | In production, error details are hidden from users |

---

## 🐛 Common Problems & Fixes

| Problem | What To Do |
|---------|-----------|
| `MongoNetworkError` | Check your database link, or just remove it and let the app use temporary memory |
| `401 Unauthorized` | Your login expired — log out and log in again |
| `403 Forbidden` | You don't have permission — you might need Admin role |
| CORS error in browser | Make sure the backend allows your frontend URL |
| Railway build fails | Check for code warnings; make sure `CI=false` is in the build command |
| 502 Bad Gateway | Check that PORT matches; look at deploy logs |
| Blank page after deploy | Make sure `NODE_ENV=production` is set |

---

## 🔄 What We Can Add Next

- [ ] **Live Notifications** — get alerts when someone gives you a task
- [ ] **Light/Dark Mode Switch** — let users pick their theme
- [ ] **File Upload** — attach documents and images to tasks
- [ ] **Drag & Drop** — move tasks between columns by dragging
- [ ] **Activity History** — see who changed what and when
- [ ] **Mobile App** — a phone version using React Native
- [ ] **Email Invites** — send project invites through email

---

## 🧪 Testing the API

You can test the API using these commands in your terminal:

```bash
# Create a new account
curl -X POST https://team-task-manager-production-f241.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Your Name","email":"your@email.com","password":"yourpassword"}'

# Login
curl -X POST https://team-task-manager-production-f241.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"your@email.com","password":"yourpassword"}'

# Check if app is running
curl https://team-task-manager-production-f241.up.railway.app/health
```

> **Built by Anuj Singh** — Full-Stack Developer  
> This project shows skills in: React, Node.js, Express, MongoDB, JWT login, role-based access, and cloud deployment on Railway.
