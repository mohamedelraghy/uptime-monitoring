const express = require('express');
const router = express.Router();

const checkController = require('../controllers/checks');
const auth = require('../middleware/is-Auth');

//? POST: /api/checks/ ===> Create a check
router.post('/', auth, checkController.create);

//? GET: /api/checks/  ===> get all check for auth user 
router.get('/', auth, checkController.allChecks);

//? GET: /api/checks/id ===> get check by ID 
router.get('/:id', auth, checkController.getCheck);

//? PUT: /api/checks/id ===> edit check
router.put('/:id', auth, checkController.editCheck);

//? DELETE: /api/checks/id ===> delete check
router.delete('/:id', auth, checkController.deleteCheck);

module.exports = router