const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

//? POST: /api/users/signup
router.post('/signup', userController.signup);

module.exports = router;