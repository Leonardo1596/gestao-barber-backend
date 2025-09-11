const express = require('express');
const router = express.Router();
const HistoryReportController = require('../controllers/HistoryReportController');
const auth = require('../middlewares/auth');

router.post('/generate-report', auth.authenticate, HistoryReportController.generateReport);

module.exports = router;