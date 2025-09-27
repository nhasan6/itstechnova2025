const express = require('express');
const router = express.Router();
const PiggyBankController = require('../controllers/PiggyBankController');

router.get('/', PiggyBankController.getPiggyBanks);
router.get('/:id', PiggyBankController.getPiggyBankById);
router.post('/', PiggyBankController.createPiggyBank);
router.patch('/:id', PiggyBankController.openBank); 

module.exports = router;



