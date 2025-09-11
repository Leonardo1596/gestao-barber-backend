const express = require('express');
const router = express.Router();
const BarberController = require('../controllers/BarberController');
const auth = require('../middlewares/auth');

router.post('/create-barber', auth.authenticate, BarberController.createBarber);
router.delete('/delete-barber/:id', auth.authenticate, BarberController.deleteBarber);
router.put('/update-barber/:id', auth.authenticate, BarberController.updateBarber);
router.get('/barbers/barbershop/:barbershopId', auth.authenticate, BarberController.getBarbersByBarbershop);

module.exports = router;