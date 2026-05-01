const Task = require('../models/Task');
const Project = require('../models/Project');
const { validationResult } = require('express-validator');

// GET /api/tasks?project=id&status=&assignee=&priority=
const getTasks = async (req, res) => {
  try {
    const { project, status, assignee, priority, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (project) {
      const proj = await Project.findById(project);
      if (!proj || !proj.isMember(req.user._id)) {
        return res.status(403).json({ message: 'Access denied.' });
      }
      filter.project = project;
    } else {
      // Only return tasks from projects user is a member of
      const userProjects = await Project.find({ 'members.user': req.user._id }).select('_id');
      filter.project = { $in: userProjects.map(p => p._id) };
    }

    if (status) filter.status = status;
    if (assignee) filter.assignee = assignee;
    if (priority) filter.priority = priority;
    if (search) filter.title = { $regex: search, $options: 'i' };

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await Task.countDocuments(filter);

    const tasks = await Task.find(filter)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      tasks,
      pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/:id
const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignee', 'name email avatar')
      .populate('createdBy', 'name email avatar')
      .populate('project', 'name color members')
      .populate('comments.author', 'name email avatar');

    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project._id);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json({ task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks
const createTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { title, description, status, priority, project, assignee, dueDate, tags } = req.body;

    const proj = await Project.findById(project);
    if (!proj) return res.status(404).json({ message: 'Project not found.' });
    if (!proj.isMember(req.user._id)) {
      return res.status(403).json({ message: 'You must be a project member to create tasks.' });
    }

    // Validate assignee is project member
    if (assignee && !proj.isMember(assignee)) {
      return res.status(400).json({ message: 'Assignee must be a project member.' });
    }

    const task = await Task.create({
      title, description, status, priority, project, assignee, dueDate, tags,
      createdBy: req.user._id
    });

    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    res.status(201).json({ message: 'Task created', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// PUT /api/tasks/:id
const updateTask = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project);
    if (!project.isMember(req.user._id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const allowed = ['title', 'description', 'status', 'priority', 'assignee', 'dueDate', 'tags'];
    allowed.forEach(field => {
      if (req.body[field] !== undefined) task[field] = req.body[field];
    });

    await task.save();
    await task.populate('assignee', 'name email avatar');
    await task.populate('createdBy', 'name email avatar');
    await task.populate('project', 'name color');

    res.json({ message: 'Task updated', task });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE /api/tasks/:id
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    const project = await Project.findById(task.project);
    const isAdmin = project.isAdmin(req.user._id);
    const isCreator = task.createdBy.toString() === req.user._id.toString();

    if (!isAdmin && !isCreator) {
      return res.status(403).json({ message: 'Only admins or task creators can delete tasks.' });
    }

    await task.deleteOne();
    res.json({ message: 'Task deleted.' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/tasks/:id/comments
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) return res.status(400).json({ message: 'Comment text is required.' });

    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found.' });

    task.comments.push({ author: req.user._id, text });
    await task.save();
    await task.populate('comments.author', 'name email avatar');

    res.status(201).json({ message: 'Comment added', comments: task.comments });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET /api/tasks/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const userProjects = await Project.find({ 'members.user': req.user._id }).select('_id');
    const projectIds = userProjects.map(p => p._id);

    const [total, todo, inProgress, done, overdue, myTasks] = await Promise.all([
      Task.countDocuments({ project: { $in: projectIds } }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'todo' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'in-progress' }),
      Task.countDocuments({ project: { $in: projectIds }, status: 'done' }),
      Task.countDocuments({
        project: { $in: projectIds },
        status: { $ne: 'done' },
        dueDate: { $lt: new Date() }
      }),
      Task.countDocuments({ project: { $in: projectIds }, assignee: req.user._id, status: { $ne: 'done' } })
    ]);

    res.json({
      stats: { total, todo, inProgress, done, overdue, myTasks, projects: projectIds.length }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getTasks, getTask, createTask, updateTask,
  deleteTask, addComment, getDashboardStats
};
