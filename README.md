# Team Task Manager - Enterprise Team Task Manager

## 📌 1. Project Overview
**Team Task Manager** is a premium, full-stack web application designed to help teams organize, track, and complete their work efficiently. In simple words, it is a digital workspace where you can create big projects, break them down into smaller tasks, and assign them to your team members. 

Built with a sophisticated **"Cyber Deep"** dark aesthetic, Team Task Manager focuses on high-visibility data and a modern **Circular (Pill-shaped)** design language, making project management not just productive, but also visually stunning.

---

## 🚀 2. Features

### 🔐 Authentication (Login/Signup)
A secure entry point for all users. It features a branded login and registration system using **JWT (JSON Web Tokens)**.
*   **Branded UI**: Custom Team Task Manager logo and high-tech glow effects.
*   **Demo Access**: One-click login for Admin and Member roles to quickly test features.

### 📁 Project Creation
Users can create high-level projects with titles, descriptions, and deadlines. 
*   **Organization**: Keeps all related tasks grouped under a single project folder.

### 📝 Task Creation & Assignment
The heart of the app. Break down projects into actionable tasks.
*   **Assignees**: Assign tasks to specific team members with their avatars.
*   **Priority Levels**: Set tasks as Low, Medium, or High priority to focus on what matters.

### 🔄 Status Tracking
Move tasks through their lifecycle with a simple dropdown:
*   **To Do**: Not started yet.
*   **In Progress**: Currently being worked on.
*   **Completed**: Successfully finished.
*   **Overdue**: Automatically flagged if the deadline has passed.

### 📊 Dashboard with Real-Time Stats
A high-level "Command Center" that gives you a bird's-eye view of everything:
*   **Brackets (Stat Cards)**: Visual boxes showing Total Tasks, Progress, and Overdue counts.
*   **Watermark Branding**: Subtle Team Task Manager logos inside every stat box.

### 🔍 Filters & Search
*   **Global Search**: Quickly find any project by name using the shortened, branded search bar.
*   **Task Filters**: Filter tasks by status or project to narrow down your focus.

### 👤 Role-Based Access Control (RBAC)
*   **Admin**: Can create projects, add/remove members, and manage all tasks.
*   **Member**: Can view projects and update the status of tasks assigned to them.

---

## 🛠️ 3. Tech Stack

*   **React.js (Frontend)**: Used to build a fast, responsive, and dynamic user interface.
*   **Node.js & Express (Backend)**: The engine that handles the logic, API requests, and server communication.
*   **MongoDB & Mongoose (Database)**: A flexible NoSQL database used to store users, projects, and tasks.
*   **Vanilla CSS (Styling)**: Custom-coded "Cyber Deep" theme with CSS variables for a premium, unique look.
*   **Railway (Deployment)**: A modern cloud platform used to host the app and make it live for users.

---

## 📂 4. Project Structure

The project is organized into a **Monorepo** structure for easy management:

```text
ethara-ai/
├── frontend/             # React application
│   ├── src/
│   │   ├── components/   # Reusable UI elements (Layout, Modals)
│   │   ├── pages/        # Main views (Dashboard, Projects, Tasks)
│   │   ├── styles/       # Global CSS and Theme variables
│   │   └── utils/        # API configuration (Axios)
├── backend/              # Node.js + Express API
│   ├── src/
│   │   ├── models/       # Database Schemas (User, Project, Task)
│   │   ├── routes/       # API Endpoints
│   │   └── server.js     # Main Entry Point
├── package.json          # Root orchestration file
└── railway.toml          # Deployment configuration
```

---

## ⚙️ 5. Installation & Setup

Follow these steps to run the project locally on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ethara-ai.git
cd ethara-ai
```

### 2. Install Dependencies
Install all required packages for both the frontend and backend using the root command:
```bash
npm run install-all
```

### 3. Setup Environment Variables
Create a `.env` file in the `backend/` folder and add:
```env
PORT=5001
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_key
```

### 4. Run the Project
Start both the backend and frontend simultaneously:
```bash
# To run in development mode
npm run dev
```
The app will be available at `http://localhost:3000`.

---

## 🌐 6. Deployment (Railway)

The project is fully optimized for **Railway** deployment.

### Steps to Deploy:
1.  **Push Code**: Push your latest code to a GitHub repository.
2.  **Connect Railway**: Go to [Railway.app](https://railway.app/), click "New Project," and select your GitHub repo.
3.  **Variables**: In the "Variables" tab, add:
    *   `NODE_ENV`: `production`
    *   `JWT_SECRET`: `your_random_secret_string`
4.  **Deploy**: Railway will automatically detect the `railway.toml` file, build the React frontend, and start the Node server.

---

## 📊 7. How It Works (Flow Explanation)

1.  **Login**: User enters credentials. The system generates a JWT token stored in the browser.
2.  **Dashboard**: The app fetches real-time stats (Total Tasks, Overdue) and displays them in the branded brackets.
3.  **Create Project**: Admin creates a new project. It appears instantly in the Project Grid.
4.  **Add Task**: Tasks are created and linked to a project.
5.  **Assign**: The task is assigned to a member, who sees it in their "My Tasks" section.
6.  **Update Status**: As the member works, they change the status (e.g., to "Completed").
7.  **Live Updates**: The Dashboard stats automatically update to reflect the new progress.

---

## 🧠 8. Data Handling (NoSQL Architecture)

This project uses a **NoSQL (MongoDB)** database architecture, which provides the flexibility needed for dynamic project management.

### How Data is Stored:
*   **MongoDB Atlas (Production)**: For the live Railway deployment, we use MongoDB Atlas. This ensures all user data, projects, and tasks are saved permanently in the cloud.
*   **Mongoose ODM**: We use Mongoose to create structured schemas (User, Project, Task) while maintaining the flexibility of NoSQL.
*   **In-Memory Fallback (Development)**: To ensure the project is "Ready-to-Run" instantly, we've implemented an **Automatic Memory Server**. If you don't provide a database link, the app will create a temporary database in the RAM.

### Data Flow:
`Frontend (React) ──► API Request (Axios) ──► Express Logic ──► Mongoose Schema ──► MongoDB Storage`

---

## 🔄 9. Future Improvements

*   **Real-Time Notifications**: Push alerts when a task is assigned or completed.
*   **Dark/Light Mode Toggle**: Allow users to switch between the Cyber Deep theme and a clean light mode.
*   **File Attachments**: Ability to upload documents and images directly to tasks.
*   **Mobile App**: Building a dedicated mobile version using React Native.

---

## 🧩 10. Architecture Diagram

### System Overview
```text
User ──► [ React Frontend ] ──► [ Express API ] ──► [ MongoDB ]
            (UI Updates)         (Logic/Auth)      (Data Storage)
```

### Action Flows
*   **Project Creation**: 
    `UI Form ──► POST /api/projects ──► DB Save ──► Refresh Grid`
*   **Task Assignment**: 
    `Admin Selects Member ──► PUT /api/tasks/:id ──► JWT Validation ──► DB Update`
*   **Status Update**: 
    `User Clicks Status ──► API Call ──► DB Update ──► Dashboard Stats Recalculate`

---

## 📌 11. Conclusion
**Team Task Manager** is more than just a task manager; it is a complete solution for modern teams who value both efficiency and high-end design. With its robust backend, flexible data handling, and stunning "Cyber Deep" interface, it is ready to scale from a small team to a large enterprise.

---
*Developed by Team Task Manager Engineering Team*
