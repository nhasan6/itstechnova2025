const express = require('express');
const router = express.Router();
const TransactionController = require('../controllers/TransactionController');

router.get('/', TransactionController.getTransactions);
router.get('/:id', TransactionController.getTransactionById);
router.post('/', TransactionController.createTransaction); 
router.post('/allocate', TransactionController.allocateTransaction); 

module.exports = router;
