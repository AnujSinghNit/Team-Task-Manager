# 🚀 Team Task Manager — Enterprise-Grade Project Management

> A production-ready, full-stack web application for managing projects, assigning tasks, and tracking team progress with **Role-Based Access Control (RBAC)**, built with the MERN stack and deployed on **Railway**.

🌐 **Live Demo:** [https://team-task-manager-production-f241.up.railway.app](https://team-task-manager-production-f241.up.railway.app)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `alice@example.com` | `password123` |
| **Member** | `bob@example.com` | `password123` |

---

## 📋 Table of Contents

1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Tech Stack](#-tech-stack)
4. [Architecture](#-architecture)
5. [Project Structure](#-project-structure)
6. [Getting Started](#-getting-started)
7. [API Documentation](#-api-documentation)
8. [Role-Based Access Control](#-role-based-access-control)
9. [Deployment Pipeline](#-deployment-pipeline)
10. [Data Handling & NoSQL Design](#-data-handling--nosql-design)
11. [Security Implementation](#-security-implementation)
12. [Troubleshooting](#-troubleshooting)
13. [Future Roadmap](#-future-roadmap)

---

## 📌 Project Overview

**Team Task Manager** is a premium, full-stack web application designed to help teams organize, track, and complete their work efficiently. It serves as a digital workspace where users can create projects, break them down into smaller tasks, and assign them to team members.

Built with a sophisticated **"Cyber Deep" dark aesthetic**, the application features high-visibility data presentation and a modern design language, making project management not just productive but visually engaging.

### What Makes It Stand Out

- **Monorepo Architecture** — Single repository, single deployment for both frontend and backend
- **Zero-Config Database** — Auto-falls back to in-memory MongoDB if no database URL is provided
- **Auto-Seeding** — Demo data is created automatically on first startup
- **One-Click Demo** — Pre-filled login buttons for instant feature testing
- **Production-Ready** — Deployed and live on Railway with CI/CD via GitHub

---

## ✨ Key Features

### 🔐 Authentication System
- **JWT-based Login/Signup** with secure token storage in `localStorage`
- **Password Hashing** using bcrypt with 12 salt rounds
- **Profile Management** — update name, avatar URL, and change password
- **Protected Routes** — unauthorized access redirects to login page
- **Demo Access** — One-click login for Admin and Member roles

### 📁 Project Management
- **Full CRUD** — Create, Read, Update, Delete projects
- **Status Lifecycle** — Active, On Hold, Completed, Archived
- **Priority Levels** — Low, Medium, High, Critical
- **Deadline Tracking** — with visual overdue indicators
- **Color Labels** — custom color per project
- **Progress Bar** — calculated from completed tasks / total tasks

### 👥 Team Collaboration
- **Invite Members** by email address
- **Role Assignment** — Admin or Member per project
- **Member Removal** — Admin-only capability
- **Owner Protection** — project creator cannot be removed

### ✅ Task Engine
- **Status Pipeline** — To Do → In Progress → Review → Done
- **Priority Tagging** — Low / Medium / High / Critical with color codes
- **Assignees** — assign tasks to project members with avatars
- **Due Dates** — overdue tasks automatically flagged with ⚠ indicator
- **Tags** — comma-separated labels for categorization
- **Quick Status Change** — dropdown directly on Kanban cards
- **Comments** — discussion thread on each task

### 📊 Dashboard (Command Center)
- **Time-Based Greeting** — "Good morning/afternoon/evening, {name}"
- **6 Stat Cards** — Total Tasks, In Progress, Completed, Overdue, My Tasks, Projects
- **Stat Card Watermarks** — branded Team Task Manager logo inside each card
- **Recent Tasks** — last 8 tasks with clickable status badges
- **Project Overview** — top 5 projects with progress bars

### 🗂️ Multiple Views
- **Kanban Board** — column-based view organized by status
- **List/Table View** — sortable, filterable task table with all details
- **Members View** — team management per project

### 🔍 Advanced Filtering
- Filter by **Project**, **Status**, **Priority**, and **Search Term**
- **Clear All Filters** with one click
- Global project search by name

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|---|---|---|
| **Node.js** | ≥ 18.x | Server runtime environment |
| **Express.js** | 4.18.x | REST API framework |
| **MongoDB** | 7.x | NoSQL database |
| **Mongoose** | 8.0.x | MongoDB ODM with schema validation |
| **JWT** (jsonwebtoken) | 9.0.x | Stateless authentication tokens |
| **bcryptjs** | 2.4.x | Password hashing (12 rounds) |
| **express-validator** | 7.0.x | Request body validation |
| **mongodb-memory-server** | 11.1.x | In-memory database fallback |
| **cors** | 2.8.x | Cross-origin resource sharing |
| **dotenv** | 16.3.x | Environment variable management |

### Frontend
| Technology | Version | Purpose |
|---|---|---|
| **React** | 18.x | Component-based UI library |
| **React Router** | v6 | Client-side routing with guards |
| **Axios** | 1.x | HTTP client with JWT interceptors |
| **react-hot-toast** | 2.x | Toast notification system |
| **date-fns** | 2.x | Date formatting and comparison |
| **Context API** | — | Global auth state management |
| **Vanilla CSS** | — | Custom "Cyber Deep" dark theme |

### DevOps & Deployment
| Service | Purpose |
|---|---|
| **Railway** | Cloud deployment (Nixpacks builder) |
| **GitHub** | Source control + CI/CD trigger |
| **MongoDB Atlas** | Managed production database (optional) |

---

## 🏗 Architecture

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT (Browser)                          │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    React 18 SPA                              │   │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │   │
│  │  │  Login   │  │Dashboard │  │ Projects │  │  Tasks   │   │   │
│  │  │  Page    │  │  Page    │  │  Page    │  │  Page    │   │   │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │   │
│  │              AuthContext (JWT State)                         │   │
│  │              Axios Instance (API Client)                     │   │
│  └──────────────────────────┬──────────────────────────────────┘   │
└─────────────────────────────┼──────────────────────────────────────┘
                              │ HTTPS (REST API)
                              ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     RAILWAY CLOUD (Production)                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                  Node.js + Express Server                    │   │
│  │                                                              │   │
│  │  ┌─────────────┐  ┌──────────────┐  ┌──────────────────┐   │   │
│  │  │  Auth       │  │  Project     │  │  Task            │   │   │
│  │  │  Routes     │  │  Routes      │  │  Routes          │   │   │
│  │  │  /api/auth  │  │  /api/projects│ │  /api/tasks      │   │   │
│  │  └──────┬──────┘  └──────┬───────┘  └──────┬───────────┘   │   │
│  │         │                │                  │               │   │
│  │  ┌──────▼──────────────────────────────────▼───────────┐   │   │
│  │  │            Middleware Layer                          │   │   │
│  │  │  JWT Verify → Role Check → Validation → Controller  │   │   │
│  │  └──────────────────────┬──────────────────────────────┘   │   │
│  │                         │                                   │   │
│  │  ┌──────────────────────▼──────────────────────────────┐   │   │
│  │  │              Mongoose ODM Layer                      │   │   │
│  │  │  User Model  │  Project Model  │  Task Model        │   │   │
│  │  └──────────────────────┬──────────────────────────────┘   │   │
│  │                         │                                   │   │
│  │  ┌─────────────┐  ┌────▼────────────────┐                 │   │
│  │  │ Static Files│  │  MongoDB            │                 │   │
│  │  │ (React Build)│ │  Atlas / In-Memory  │                 │   │
│  │  └─────────────┘  └─────────────────────┘                 │   │
│  └─────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

### Request-Response Flow

```
User Action ──► React Component ──► Axios (+ JWT Header)
                                         │
                                         ▼
                                   Express Router
                                         │
                               ┌─────────┼─────────┐
                               ▼         ▼         ▼
                          Auth MW    Validator   Controller
                               │         │         │
                               └─────────┼─────────┘
                                         ▼
                                   Mongoose Query
                                         │
                                         ▼
                                   MongoDB Response
                                         │
                                         ▼
                                   JSON Response ──► React State Update ──► UI Re-render
```

---

## 📂 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── seed.js                 # Database seeder script
│   │   ├── controllers/
│   │   │   ├── auth.controller.js      # Register, Login, Profile, Password
│   │   │   ├── project.controller.js   # CRUD + Member management
│   │   │   └── task.controller.js      # CRUD + Comments + Stats
│   │   ├── middleware/
│   │   │   └── auth.middleware.js      # JWT verify, role guards
│   │   ├── models/
│   │   │   ├── User.js                 # name, email, password, avatar
│   │   │   ├── Project.js             # name, members[], status, priority
│   │   │   └── Task.js                # title, assignee, status, comments[]
│   │   ├── routes/
│   │   │   ├── auth.routes.js          # POST /register, /login, GET /me
│   │   │   ├── project.routes.js       # CRUD + /members endpoints
│   │   │   ├── task.routes.js          # CRUD + /comments + /stats
│   │   │   └── user.routes.js          # GET /search, /:id
│   │   └── server.js                   # Express app, DB connection, auto-seed
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   ├── index.html
│   │   └── logo.png                    # Team Task Manager brand logo
│   ├── src/
│   │   ├── components/
│   │   │   ├── TaskModal.js            # Create/Edit task modal
│   │   │   └── layout/
│   │   │       ├── Layout.js           # Sidebar + topbar shell
│   │   │       └── Layout.css
│   │   ├── context/
│   │   │   └── AuthContext.js          # JWT state, login/logout actions
│   │   ├── pages/
│   │   │   ├── LoginPage.js            # Login + demo buttons
│   │   │   ├── RegisterPage.js         # Registration form
│   │   │   ├── DashboardPage.js        # Stats, recent tasks, projects
│   │   │   ├── ProjectsPage.js         # Project grid with CRUD
│   │   │   ├── ProjectDetailPage.js    # Kanban, list, members tabs
│   │   │   ├── TasksPage.js            # All tasks table with filters
│   │   │   └── ProfilePage.js          # Profile edit + password change
│   │   ├── styles/
│   │   │   └── global.css              # "Cyber Deep" theme + design tokens
│   │   ├── utils/
│   │   │   └── api.js                  # Axios instance + API wrappers
│   │   ├── App.js                      # Router + protected route guards
│   │   └── index.js                    # React entry point
│   └── package.json
│
├── package.json                         # Root orchestration (install + build)
├── railway.toml                         # Railway deployment configuration
├── nixpacks.toml                        # Nixpacks environment variables
├── Procfile                             # Process declaration
└── README.md                           # This file
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** v18 or higher
- **npm** v9+
- **Git**
- **MongoDB** (optional — app auto-creates in-memory DB if none provided)

### Local Development

#### 1. Clone the Repository

```bash
git clone https://github.com/AnujSinghNit/Team-Task-Manager.git
cd Team-Task-Manager
```

#### 2. Install Dependencies

```bash
# Install backend dependencies
cd backend && npm install

# Install frontend dependencies  
cd ../frontend && npm install
```

#### 3. Configure Environment

Create `backend/.env`:

```env
PORT=5001
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/team-task-manager   # Optional
JWT_SECRET=your_super_secret_key
FRONTEND_URL=http://localhost:3000
```

> 💡 **No MongoDB installed?** No problem — the app automatically starts an in-memory MongoDB server and seeds demo data.

#### 4. Start the Application

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev
# ✅ Server running on port 5001
# ✅ Connected to MongoDB (or In-Memory MongoDB)
# 🌱 Demo data seeded automatically!
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm start
# ✅ React app running on http://localhost:3000
```

#### 5. Login

Open `http://localhost:3000` and use:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `alice@example.com` | `password123` |
| **Member** | `bob@example.com` | `password123` |

---

## 📡 API Documentation

**Base URL:** `https://team-task-manager-production-f241.up.railway.app/api`

All protected routes require: `Authorization: Bearer <JWT_TOKEN>`

### Authentication Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/api/auth/register` | ❌ | Register a new user |
| `POST` | `/api/auth/login` | ❌ | Login → returns JWT token |
| `GET` | `/api/auth/me` | ✅ | Get current user profile |
| `PUT` | `/api/auth/profile` | ✅ | Update name / avatar |
| `PUT` | `/api/auth/change-password` | ✅ | Change password |

### Project Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `GET` | `/api/projects` | ✅ | Any | List user's projects |
| `POST` | `/api/projects` | ✅ | Any | Create new project |
| `GET` | `/api/projects/:id` | ✅ | Member | Get project details |
| `PUT` | `/api/projects/:id` | ✅ | Admin | Update project |
| `DELETE` | `/api/projects/:id` | ✅ | Owner | Delete project + all tasks |
| `POST` | `/api/projects/:id/members` | ✅ | Admin | Add member by email |
| `DELETE` | `/api/projects/:id/members/:userId` | ✅ | Admin | Remove member |

### Task Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/tasks` | ✅ | Get tasks (filterable) |
| `POST` | `/api/tasks` | ✅ | Create a task |
| `GET` | `/api/tasks/:id` | ✅ | Get single task |
| `PUT` | `/api/tasks/:id` | ✅ | Update task |
| `DELETE` | `/api/tasks/:id` | ✅ | Delete task |
| `POST` | `/api/tasks/:id/comments` | ✅ | Add comment |
| `GET` | `/api/tasks/dashboard/stats` | ✅ | Dashboard statistics |

**Query Parameters for `GET /api/tasks`:**
```
?project=ID&status=todo|in-progress|review|done&priority=low|medium|high|critical&search=keyword&page=1&limit=50
```

### User Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/users/search?email=` | ✅ | Search users by email |
| `GET` | `/api/users/:id` | ✅ | Get user by ID |

---

## 🔐 Role-Based Access Control

| Action | Owner | Admin | Member |
|--------|:-----:|:-----:|:------:|
| View project | ✅ | ✅ | ✅ |
| Create tasks | ✅ | ✅ | ✅ |
| Edit any task | ✅ | ✅ | ✅ |
| Delete tasks | ✅ | ✅ | Creator only |
| Edit project details | ✅ | ✅ | ❌ |
| Add/remove members | ✅ | ✅ | ❌ |
| Delete project | ✅ | ❌ | ❌ |

> **Note:** The project creator is automatically assigned as **Owner** with **Admin** role and cannot be removed.

---

## ☁️ Deployment Pipeline

### How It's Deployed (Railway + GitHub CI/CD)

The application uses a **monorepo deployment strategy** — a single Railway service that builds both the React frontend and Node.js backend, then serves everything from one process.

#### Deployment Architecture

```
GitHub (main branch)
        │
        │  Push triggers auto-deploy
        ▼
Railway (Nixpacks Builder)
        │
        ├── 1. installCommand: Skip default npm ci
        ├── 2. buildCommand:
        │       ├── cd backend && npm install
        │       ├── cd frontend && npm install
        │       └── CI=false npm run build  (React production build)
        │
        └── 3. startCommand: PORT=5001 NODE_ENV=production node backend/src/server.js
                │
                ├── Express serves API routes on /api/*
                ├── Express serves React static files from frontend/build/
                └── Catch-all route serves index.html (React Router handles client routes)
```

#### Key Deployment Configurations

**`railway.toml`** — Tells Railway how to build and run:
```toml
[build]
builder = "NIXPACKS"
installCommand = "echo 'Skipping default install'"
buildCommand = "cd backend && npm install && cd ../frontend && npm install && CI=false npm run build"

[deploy]
startCommand = "PORT=5001 NODE_ENV=production node backend/src/server.js"
```

#### Environment Variables (Railway Dashboard)

| Variable | Value | Purpose |
|----------|-------|---------|
| `NODE_ENV` | `production` | Enables static file serving |
| `JWT_SECRET` | `(secret)` | Signs JWT tokens |
| `MONGODB_URI` | `(Atlas URI)` | Database connection string |

#### Deployment Challenges Solved

| Challenge | Solution |
|-----------|----------|
| `npm ci` sync failures | Custom `installCommand` skips default install, runs `npm install` inside `buildCommand` |
| ESLint warnings treated as errors | `CI=false` in build command prevents React from failing on warnings |
| Port mismatch (502 error) | `PORT=5001` explicitly set in `startCommand` |
| Root route showing backend HTML | Root route conditionally hidden in production; Express static middleware serves React |
| Server unreachable | Server bound to `0.0.0.0` for container networking |
| CORS blocking API calls | Dynamic CORS origin accepting all Railway domains |

---

## 🧠 Data Handling & NoSQL Design

### Database Schema Design

```
┌──────────────┐       ┌───────────────────┐       ┌──────────────────┐
│    User      │       │     Project       │       │      Task        │
├──────────────┤       ├───────────────────┤       ├──────────────────┤
│ _id          │◄──────│ owner (ref: User) │       │ _id              │
│ name         │       │ name              │◄──────│ project (ref)    │
│ email        │◄──┐   │ description       │       │ title            │
│ password     │   │   │ status            │       │ description      │
│ avatar       │   │   │ priority          │   ┌──►│ assignee (ref)   │
│ isActive     │   │   │ deadline          │   │   │ status           │
│ createdAt    │   │   │ color             │   │   │ priority         │
└──────────────┘   │   │ members: [{       │   │   │ dueDate          │
                   │   │   user (ref) ─────┼───┘   │ tags: []         │
                   │   │   role            │       │ comments: [{     │
                   │   │ }]                │       │   user (ref)     │
                   │   │ createdAt         │       │   text           │
                   │   └───────────────────┘       │ }]               │
                   │                               │ createdBy (ref)──┘
                   └───────────────────────────────│ createdAt        │
                                                   └──────────────────┘
```

### Data Strategy

| Mode | Database | Persistence | Use Case |
|------|----------|-------------|----------|
| **Production** | MongoDB Atlas (Cloud) | ✅ Permanent | Live deployment |
| **Development** | Local MongoDB | ✅ Permanent | Local development |
| **Fallback** | mongodb-memory-server | ❌ RAM only | No DB available — auto-seeds demo data |

### Data Flow

```
Frontend (React)
    │
    ├── User Action (click, form submit)
    │
    ▼
Axios HTTP Client
    │
    ├── Attaches JWT token from AuthContext
    ├── Sends to /api/* endpoint
    │
    ▼
Express Router → Middleware Chain
    │
    ├── 1. JWT Verification (auth.middleware.js)
    ├── 2. Role Check (isAdmin, isProjectMember)
    ├── 3. Input Validation (express-validator)
    │
    ▼
Controller Logic
    │
    ├── Business rules, calculations
    ├── Mongoose query construction
    │
    ▼
MongoDB (via Mongoose ODM)
    │
    ├── Schema validation
    ├── Pre-save hooks (password hashing)
    ├── Population (refs → full objects)
    │
    ▼
JSON Response → Axios → React State → UI Re-render
```

---

## 🔒 Security Implementation

| Layer | Implementation |
|-------|---------------|
| **Password Storage** | bcrypt with 12 salt rounds — never stored in plain text |
| **Authentication** | JWT tokens with 7-day expiration |
| **Authorization** | Role-based middleware (Owner > Admin > Member) |
| **CORS** | Restricted to known origins (localhost, Railway domains) |
| **Input Validation** | express-validator on all POST/PUT endpoints |
| **NoSQL Injection** | Prevented via Mongoose strict schema validation |
| **Token Security** | Stored in localStorage, sent via Authorization header |
| **Error Handling** | Global error middleware — stack traces hidden in production |

---

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| `MongoNetworkError` | Check `MONGODB_URI` or let it fallback to in-memory DB |
| `401 Unauthorized` | JWT expired — logout and login again |
| `403 Forbidden` | Your role doesn't have permission for this action |
| CORS error in browser | Ensure backend CORS allows your frontend origin |
| Railway build fails | Check for ESLint errors; ensure `CI=false` in build command |
| 502 Bad Gateway | Verify PORT matches domain target; check deploy logs |
| Blank page after deploy | Ensure `NODE_ENV=production` is set |

---

## 🔄 Future Roadmap

- [ ] **Real-Time Notifications** — WebSocket push alerts for task assignments
- [ ] **Dark/Light Mode Toggle** — switchable themes
- [ ] **File Attachments** — upload documents and images to tasks
- [ ] **Drag & Drop Kanban** — drag tasks between status columns
- [ ] **Activity Log** — audit trail of all project changes
- [ ] **Mobile App** — React Native companion app
- [ ] **Email Invitations** — send project invites via email

---

## 🧪 Testing the API

```bash
# Register a new user
curl -X POST https://team-task-manager-production-f241.up.railway.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'

# Login
curl -X POST https://team-task-manager-production-f241.up.railway.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"alice@example.com","password":"password123"}'

# Get projects (use token from login response)
curl https://team-task-manager-production-f241.up.railway.app/api/projects \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Health check
curl https://team-task-manager-production-f241.up.railway.app/health
```

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

> **Built by Anuj Singh** — Full-Stack Developer  
> Demonstrating expertise in REST API design, JWT authentication, RBAC, React SPA architecture, and cloud deployment on Railway.
