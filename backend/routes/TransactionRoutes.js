const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.get('/transactions', TransactionControllerController.getTransactions);
router.get('/piggybanks/:id', TransactionController.getTransactionById);
router.post('/piggybanks', TransactionController.createTransaction);
router.patch('/piggybanks/:id', TransactionController.allocateBalance);

module.exports = router;
