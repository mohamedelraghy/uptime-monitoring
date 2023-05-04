const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');

//? POST: /api/users/signup
router.post('/signup', userController.signup);

//? GET: /api/users/login
router.get('/login', userController.login);

module.exports = router;