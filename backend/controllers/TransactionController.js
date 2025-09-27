const Transaction = require('../models/Transaction') 

const getTransactions = async (req,res) => {
    try {
        const transactions = Transaction.find();
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({message: 'Error fetching transactions'});
    }
}

const getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findById(req.params.id);
        if (!transaction) {
            res.status(404).json({error: 'not found'});
        } else {
            res.status(200).json(transaction);
        } 
    } catch (err) {
        res.status(500).json({error: err.message}); x
    }
}

const createTransaction = async (req, res) => {
    try {
        const piggyBank = await Transaction.create(req.body);
        res.status(201);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const addFunds = async (req, res) => {
    try {
    } catch (err) {
        res.status()
    }
}

const allocateBalance = async (req,res) => {}
const  = async (req,res) => {}
const openBank = async (req,res) => {}