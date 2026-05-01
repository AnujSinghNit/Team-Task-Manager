const Project = require('../models/Project');
const Task = require('../models/Task');
const User = require('../models/User');
const { validationResult } = require('express-validator');

// GET /api/projects
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({
      'members.user': req.user._id
    })
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar')
      .sort({ updatedAt: -1 });

    // Add task counts
    const projectsWithCounts = await Promise.all(projects.map(async (p) => {
      const obj = p.toObject();
      obj.taskCount = await Task.countDocuments({ project: p._id });
      obj.completedCount = await Task.countDocuments({ project: p._id, status: 'done' });
      obj.overdueCount = await Task.countDocuments({
        project: p._id,
        dueDate: { $lt: new Date() },
        status: { $ne: 'done' }
      });
      return obj;
    }));

    res.json({ projects: projectsWithCounts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate('owner', 'name email avatar')
      .populate('members.user', 'name email avatar');

    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const obj = project.toObject();
    obj.taskCount = await Task.countDocuments({ project: project._id });
    obj.completedCount = await Task.countDocuments({ project: project._id, status: 'done' });

    res.json({ project: obj });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects
const createProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { name, description, status, priority, deadline, color } = req.body;

    const project = await Project.create({
      name, description, status, priority, deadline, color,
      owner: req.user._id
    });

    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.status(201).json({ message: 'Project created', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id
const updateProject = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const allowed = ['name', 'description', 'status', 'priority', 'deadline', 'color'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) project[field] = req.body[field];
    });

    await project.save();
    await project.populate('owner', 'name email avatar');
    await project.populate('members.user', 'name email avatar');

    res.json({ message: 'Project updated', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the owner can delete this project.' });
    }

    await Task.deleteMany({ project: project._id });
    await project.deleteOne();

    res.json({ message: 'Project and all its tasks deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/projects/:id/members
const addMember = async (req, res) => {
  try {
    const { email, role = 'Member' } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found with that email.' });

    if (project.isMember(user._id)) {
      return res.status(409).json({ message: 'User is already a member.' });
    }

    project.members.push({ user: user._id, role });
    await project.save();
    await project.populate('members.user', 'name email avatar');

    res.json({ message: 'Member added', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/projects/:id/members/:userId
const removeMember = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }
    if (project.owner.toString() === req.params.userId) {
      return res.status(400).json({ message: 'Cannot remove the project owner.' });
    }

    project.members = project.members.filter(
      m => m.user.toString() !== req.params.userId
    );
    await project.save();

    res.json({ message: 'Member removed', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/projects/:id/members/:userId/role
const updateMemberRole = async (req, res) => {
  try {
    const { role } = req.body;
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found.' });
    if (!project.isAdmin(req.user._id)) {
      return res.status(403).json({ message: 'Admin access required.' });
    }

    const member = project.members.find(m => m.user.toString() === req.params.userId);
    if (!member) return res.status(404).json({ message: 'Member not found.' });

    member.role = role;
    await project.save();

    res.json({ message: 'Role updated', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getProjects, getProject, createProject, updateProject,
  deleteProject, addMember, removeMember, updateMemberRole
};
