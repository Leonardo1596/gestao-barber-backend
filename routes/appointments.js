const express = require('express');
const router = express.Router();
const AppointmentController = require('../controllers/AppointmentController');
const auth = require('../middlewares/auth');

router.post('/create-appointment', auth.authenticate, AppointmentController.createAppointment);
router.put('/update-appointment/:id', auth.authenticate, AppointmentController.updateAppointment);
router.delete('/delete-appointment/:id', auth.authenticate, AppointmentController.deleteAppointment);
router.get('/available-times/:date/:barber/:barbershop', auth.authenticate, AppointmentController.getAvailableTimes);
router.get('/appointments/barbershop/:barbershop', auth.authenticate, AppointmentController.getAllAppointments);
router.get('/appointments-by-date/barbershop/:barbershop', auth.authenticate, AppointmentController.getAppointmentsByDate);

module.exports = router;