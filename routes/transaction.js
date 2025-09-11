const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');
const auth = require('../middlewares/auth');

router.post('/create-transaction', auth.authenticate, TransactionController.createTransaction); 
router.delete('/delete-transaction/:id', auth.authenticate, TransactionController.deleteTransaction);
router.get('/transactions/barbershop/:barbershop', auth.authenticate, TransactionController.getTransactionsByBarbershop);
router.get('/transactions-by-period/barbershop/:barbershop/:startDate/:endDate', auth.authenticate, TransactionController.getTransactionByPeriod);

module.exports = router;