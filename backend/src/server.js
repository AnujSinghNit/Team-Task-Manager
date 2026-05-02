const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth.routes');
const projectRoutes = require('./routes/project.routes');
const taskRoutes = require('./routes/task.routes');
const userRoutes = require('./routes/user.routes');

// Models for auto-seeding
const User = require('./models/User');
const Project = require('./models/Project');
const Task = require('./models/Task');

const app = express();

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc)
    if (!origin) return callback(null, true);
    // Allow localhost and any Railway domain
    if (origin.includes('localhost') || origin.includes('railway.app')) {
      return callback(null, true);
    }
    return callback(null, true); // Allow all in production for now
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root route (only in development — in production, React app handles this)
if (process.env.NODE_ENV !== 'production') {
  app.get('/', (req, res) => {
    res.send(`
      <div style="font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #0f172a; color: #f8fafc;">
        <h1 style="color: #6366f1;">🚀 Team Task Manager Backend is Running</h1>
        <p>The API is live on port ${process.env.PORT || 5001}.</p>
        <a href="http://localhost:3000" style="color: #6366f1; text-decoration: none; border: 1px solid #6366f1; padding: 10px 20px; border-radius: 8px; margin-top: 20px;">Go to Frontend →</a>
      </div>
    `);
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Serve Static Files in Production
const path = require('path');
if (process.env.NODE_ENV === 'production') {
  // Serve the static files from the React app
  app.use(express.static(path.join(__dirname, '../../frontend/build')));

  // Handle any requests that don't match the ones above
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(__dirname, '../../frontend/build', 'index.html'));
    } else {
      res.status(404).json({ message: 'API Route not found' });
    }
  });
}

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

const startServer = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('🔄 Attempting to start in-memory MongoDB...');
    
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log('✅ Connected to In-Memory MongoDB');
    } catch (memErr) {
      console.error('❌ In-Memory MongoDB failed:', memErr.message);
      process.exit(1);
    }
  }

  const PORT = process.env.PORT || 5001;
  app.listen(PORT, '0.0.0.0', async () => {
    console.log(`🚀 Server running on port ${PORT} (bound to 0.0.0.0)`);
    
    // Auto-seed if database is empty
    try {
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Database is empty. Seeding demo data...');
        const seedData = async () => {
          // Create users
          const admin = await User.create({
            name: 'Alice Admin',
            email: 'alice@example.com',
            password: 'password123',
            avatar: 'https://ui-avatars.com/api/?name=Alice+Admin&background=6366f1&color=fff'
          });

          const member = await User.create({
            name: 'Bob Member',
            email: 'bob@example.com',
            password: 'password123',
            avatar: 'https://ui-avatars.com/api/?name=Bob+Member&background=10b981&color=fff'
          });

          // Create project
          const project = await Project.create({
            name: 'Website Redesign',
            description: 'Complete overhaul of the company website with modern design and improved UX.',
            status: 'active',
            priority: 'high',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            owner: admin._id,
            color: '#6366f1'
          });

          // Add Bob as member
          project.members.push({ user: member._id, role: 'Member' });
          await project.save();

          // Create tasks
          const tasks = [
            { title: 'Design wireframes', status: 'done', priority: 'high', assignee: admin._id },
            { title: 'Set up React project', status: 'done', priority: 'high', assignee: member._id },
            { title: 'Build homepage component', status: 'in-progress', priority: 'high', assignee: member._id },
            { title: 'Write API documentation', status: 'in-progress', priority: 'medium', assignee: admin._id },
            { title: 'Implement authentication', status: 'todo', priority: 'critical', assignee: admin._id },
            { title: 'Add unit tests', status: 'todo', priority: 'medium', assignee: member._id },
            { title: 'Deploy to Railway', status: 'todo', priority: 'high', assignee: admin._id, dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) }
          ];

          for (const t of tasks) {
            await Task.create({ ...t, project: project._id, createdBy: admin._id });
          }
          console.log('✅ Demo data seeded successfully!');
          console.log('Credentials: alice@example.com / password123');
        };
        await seedData();
      }
    } catch (seedErr) {
      console.error('❌ Auto-seeding failed:', seedErr.message);
    }
  });
};

startServer();

module.exports = app;
