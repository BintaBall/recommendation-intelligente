const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'User Service is running',
    timestamp: new Date().toISOString()
  });
});


router.get('/info', (req, res) => {
  res.status(200).json({
    name: 'User Service',
    version: '1.0.0',
    description: 'Service for managing user profiles',
    endpoints: {
      users: '/api/users/*'
    }
  });
});

// Endpoints temporaires pour les utilisateurs
router.get('/', (req, res) => {
  res.json([
    { id: '1', username: 'user1', email: 'user1@example.com' },
    { id: '2', username: 'user2', email: 'user2@example.com' }
  ]);
});

router.get('/:id', (req, res) => {
  res.json({ 
    id: req.params.id, 
    username: `user${req.params.id}`, 
    email: `user${req.params.id}@example.com` 
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    id: '3',
    ...req.body,
    message: 'User created successfully'
  });
});

router.put('/:id', (req, res) => {
  res.json({
    id: req.params.id,
    ...req.body,
    message: 'User updated successfully'
  });
});

router.delete('/:id', (req, res) => {
  res.json({
    message: `User ${req.params.id} deleted successfully`
  });
});

module.exports = router;