const express = require('express');
const router = express.Router();

const reportController = require('../controllers/report');
const auth = require('../middleware/is-Auth');

//? GET: /api/report/checkId ===> return report for Check
router.get('/:checkId', auth, reportController.getReport);

module.exports = router;