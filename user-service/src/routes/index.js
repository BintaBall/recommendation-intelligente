const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
;

router.get('/:id', userController.getUserById);
router.put('/:id', userController.updateUser);
router.delete('/:id', userController.deleteUser);
router.get('/api', userController.getAllUsers);

module.exports = router;