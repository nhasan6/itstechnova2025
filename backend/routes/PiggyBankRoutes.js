const express = require('express');
const router = express.Router();
const PiggyBankController = require('../controllers/PiggyBankController');

router.get('/piggybanks', piggyBankController.getPiggyBanks);
router.get('/piggybanks/:id', piggyBankController.getPiggyBankById);
router.post('/piggybanks', piggyBankController.createPiggyBank);
router.patch('/piggybanks/:id', piggyBankController.openBank);

module.exports = router;



