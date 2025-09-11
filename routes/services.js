const express = require('express');
const router = express.Router();
const ServiceController = require('../controllers/ServiceController');
const auth = require('../middlewares/auth');

router.post('/create-service', auth.authenticate, ServiceController.createService);
router.delete('/delete-service/:id', auth.authenticate, ServiceController.deleteService);
router.put('/update-service/:id', auth.authenticate, ServiceController.updateService);
router.get('/services/barbershop/:barbershopId', auth.authenticate, ServiceController.getServicesByBarbershop);

module.exports = router;