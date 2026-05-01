const express = require('express');
const User = require('../models/User');
const { authenticate } = require('../middleware/auth.middleware');

const router = express.Router();
router.use(authenticate);

// Search users by email (for adding to projects)
router.get('/search', async (req, res) => {
  try {
    const { email } = req.query;
    if (!email || email.length < 3) {
      return res.status(400).json({ message: 'Provide at least 3 characters to search.' });
    }

    const users = await User.find({
      email: { $regex: email, $options: 'i' },
      _id: { $ne: req.user._id }
    }).select('name email avatar').limit(10);

    res.json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get user by ID
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found.' });
    res.json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
