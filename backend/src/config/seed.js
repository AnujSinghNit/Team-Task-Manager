const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('../models/User');
const Project = require('../models/Project');
const Task = require('../models/Task');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Project.deleteMany({});
    await Task.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const admin = await User.create({
      name: 'Alice Admin',
      email: 'alice@example.com',
      password: 'password123'
    });

    const member = await User.create({
      name: 'Bob Member',
      email: 'bob@example.com',
      password: 'password123'
    });

    console.log('Created users');

    // Create project
    const project = await Project.create({
      name: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design',
      status: 'active',
      priority: 'high',
      deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      owner: admin._id,
      color: '#6366f1'
    });

    // Add Bob as member
    project.members.push({ user: member._id, role: 'Member' });
    await project.save();
    console.log('Created project');

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

    console.log('Created tasks');
    console.log('\n✅ Seed complete!');
    console.log('Login credentials:');
    console.log('  Admin: alice@example.com / password123');
    console.log('  Member: bob@example.com / password123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
};

seed();
