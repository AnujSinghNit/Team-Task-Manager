const express = require('express');
const { body } = require('express-validator');
const {
  getTasks, getTask, createTask, updateTask,
  deleteTask, addComment, getDashboardStats
} = require('../controllers/task.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

const taskValidation = [
  body('title').trim().isLength({ min: 3, max: 200 }).withMessage('Title must be 3-200 characters'),
  body('status').optional().isIn(['todo', 'in-progress', 'review', 'done']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical']),
  body('dueDate').optional().isISO8601().withMessage('Invalid date format')
];

router.use(authenticate);

router.get('/dashboard/stats', getDashboardStats);
router.get('/', getTasks);
router.post('/', [
  ...taskValidation,
  body('project').notEmpty().withMessage('Project ID required')
], createTask);
router.get('/:id', getTask);
router.put('/:id', taskValidation, updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/comments', addComment);

module.exports = router;
