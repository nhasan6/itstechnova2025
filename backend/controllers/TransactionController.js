const Transaction = require('../models/Transaction') 
const PiggyBank = require('../models/PiggyBank') 


// get all transactions
const getTransactions = async (req,res) => {
    try {
        const transactions = await Transaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({message: 'Error fetching transactions'});
    }
}

const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            return res.status(404).json({error: 'not found'});
        } 
        res.status(200).json(transaction);
    } catch (err) {
        res.status(500).json({error: err.message}); 
    }
}

const createTransaction = async (req, res) => {
    try {
        const piggyBank = await Transaction.create(req.body);
        res.status(201).json(piggyBank);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const allocateBalance = async (req,res) => {
    try {
        const { piggyBankId, amount } = req.body;

        const piggyBank = await Transaction.findById(piggyBankId);

        if (!piggyBank) {
            return res.status(404).json({error: 'not found'});
        }
        piggyBank.balance = piggyBank.balance + amount;

        await piggyBank.save()

        res.status(200).json(piggyBank);
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    allocateBalance,
    openBank
};