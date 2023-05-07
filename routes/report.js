const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report');
const auth = require('../middleware/is-Auth');

router.get('/:checkId', auth, reportController.getReport);

module.exports = router