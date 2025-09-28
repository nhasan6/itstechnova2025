const express = require('express');
const router = express.Router();
const GeminiController = require('../controllers/GeminiController.js');

// POST route because controller expects req.body.prompt
router.post('/', GeminiController.getFinancialAdvice);

module.exports = router;
