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
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const allocateTransaction = async (req,res) => {
    try {
        const { transactionId, piggyBankId } = req.body;

        const piggyBank = await PiggyBank.findById(piggyBankId);

        if (!piggyBank)  {
            return res.status(404).json({error: 'not found'});
        }

        const transaction = await Transaction.findById(transactionId);

        if (!transaction)  {
            return res.status(404).json({error: 'not found'});
        }

        if (transaction.piggyBankId) {
            return res.status(400).json({error: 'already allocated'});
        }

        // use static method
        const updatedTransaction = await Transaction.allocate(transactionId, piggyBankId);

        res.status(200).json({
            message: "Transaction allocated successfully",
            transaction: updatedTransaction,
            piggyBankId: piggyBankId });
    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getTransactions,
    getTransactionById,
    createTransaction,
    allocateTransaction,
};