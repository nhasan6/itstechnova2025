const express = require('express');
const router = express.Router();
const GeminiController = require('../controllers/GeminiController.js');

router.get('/', GeminiController.getFinancialAdvice);

module.exports = router;
