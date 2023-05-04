const express = require('express');
const router = express.Router();

const userController = require('../controllers/users');
const auth = require('../middleware/is-Auth');

//? POST: /api/users/signup
router.post('/signup', userController.signup);

//? GET: /api/users/login
router.get('/login', userController.login);

//? POST /api/users/verifiy
router.post('/verifiy', auth, userController.verifiy);

module.exports = router;