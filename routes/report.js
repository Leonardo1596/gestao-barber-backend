const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/ReportController');
const auth = require('../middlewares/auth');

router.get('/report-by-period/barbershop/:barbershop/:startDate/:endDate', auth.authenticate, ReportController.getReportByPeriod);
router.get('/report-by-barber-and-period/barbershop/:barbershop/:barber/:startDate/:endDate', auth.authenticate, ReportController.getReportByBarberAndPeriod);

module.exports = router;