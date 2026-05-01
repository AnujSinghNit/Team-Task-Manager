const express = require('express');
const { body } = require('express-validator');
const {
  getProjects, getProject, createProject, updateProject,
  deleteProject, addMember, removeMember, updateMemberRole
} = require('../controllers/project.controller');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();

const projectValidation = [
  body('name').trim().isLength({ min: 3, max: 100 }).withMessage('Name must be 3-100 characters'),
  body('description').optional().isLength({ max: 500 }).withMessage('Description max 500 chars'),
  body('status').optional().isIn(['active', 'on-hold', 'completed', 'archived']),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
];

router.use(authenticate);

router.get('/', getProjects);
router.post('/', projectValidation, createProject);
router.get('/:id', getProject);
router.put('/:id', projectValidation, updateProject);
router.delete('/:id', deleteProject);

// Member management
router.post('/:id/members', addMember);
router.delete('/:id/members/:userId', removeMember);
router.put('/:id/members/:userId/role', updateMemberRole);

module.exports = router;
