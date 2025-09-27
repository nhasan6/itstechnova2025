const mongoose = require('mongoose');

// Your MongoDB connection URI
const uri = "mongodb+srv://mayyuchencao:2025TechNova@25technova.cm7fhyt.mongodb.net/girlmath?retryWrites=true&w=majority&appName=25TechNova";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(uri);
        console.log(`MongoDB Connected: ${conn.connection.host} 🚀`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
}

// Run the main function and catch any errors
main().catch(console.error);

//PiggyBank Model
const mongoose = require('mongoose');

const piggyBankSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a name'],
        trim: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['savings', 'treat', 'sos', 'debt', 'custom'], // Ensures type is one of these values
    },
    balance: {
        type: Number,
        required: true,
        default: 0.0,
    },
    goal: {
        type: Number,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
    opened: {
        type: Boolean,
        default: false,
    },
    // This creates a relationship with the Transaction model
    transactions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Transaction',
    }],
    iconId: {
        type: String,
        default: 'default_piggy',
    },
}, {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true,
});

/**
 * @description Add funds to a piggy bank and link the transaction.
 * @param {string} piggybankId The ID of the piggy bank to update.
 * @param {number} amount The amount to add.
 * @param {string} transactionId The ID of the transaction to link.
 */
piggyBankSchema.statics.addFunds = async function(piggybankId, amount, transactionId) {
    // The `timestamps: true` option automatically handles `updatedAt`
    return this.findByIdAndUpdate(piggybankId, {
        $inc: { balance: amount },
        $push: { transactions: transactionId },
    });
};

// The first argument 'PiggyBank' is the singular name of the model.
// Mongoose automatically looks for the plural, lowercased version of your model name.
// Thus, the model 'PiggyBank' is for the 'piggybanks' collection in the database.
module.exports = mongoose.model('PiggyBank', piggyBankSchema);

//Transaction Model
const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: [true, 'Please add an amount'],
    },
    label: {
        type: String,
        required: [true, 'Please add a label'],
        trim: true,
    },
    source: {
        type: String,
        required: true,
    },
    // Link to the PiggyBank this transaction is allocated to
    piggyBankId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'PiggyBank',
        default: null, // `null` indicates it's unallocated
    },
    note: {
        type: String,
        default: '',
    },
}, {
    timestamps: true,
});

/**
 * @description Allocate a transaction to a specific piggy bank.
 * @param {string} transactionId The ID of the transaction.
 * @param {string} piggybankId The ID of the piggy bank to allocate to.
 */
transactionSchema.statics.allocate = async function(transactionId, piggybankId) {
    // 1. Find the transaction and update its piggyBankId
    const transaction = await this.findByIdAndUpdate(
        transactionId,
        { piggyBankId: piggybankId },
        { new: true } // Return the updated document
    );

    if (!transaction) {
        throw new Error('Transaction not found');
    }

    // 2. Use the PiggyBank model to add the funds
    // We use mongoose.model('PiggyBank') to avoid circular dependency issues
    await mongoose.model('PiggyBank').addFunds(
        piggybankId,
        transaction.amount,
        transaction._id
    );

    return transaction;
};


module.exports = mongoose.model('Transaction', transactionSchema);








const PiggyBank = require('../models/piggyBankModel');
const Transaction = require('../models/transactionModel');

// @desc    Create a new piggy bank
// @route   POST /api/piggybanks
exports.createPiggyBank = async (req, res) => {
    try {
        const { name, type, goal } = req.body;
        const newPiggyBank = await PiggyBank.create({ name, type, goal });
        res.status(201).json(newPiggyBank);
    } catch (error) {
        res.status(400).json({ message: "Failed to create piggy bank", error: error.message });
    }
};

// @desc    Get all piggy banks
// @route   GET /api/piggybanks
exports.getAllPiggyBanks = async (req, res) => {
    try {
        const piggybanks = await PiggyBank.find({}).populate('transactions'); // .populate shows the full transaction docs
        res.status(200).json(piggybanks);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// @desc    Allocate an existing transaction
// @route   POST /api/transactions/allocate
exports.allocateTransaction = async (req, res) => {
    try {
        const { transactionId, piggybankId } = req.body;
        const updatedTransaction = await Transaction.allocate(transactionId, piggybankId);
        res.status(200).json({
            message: `Successfully allocated $${updatedTransaction.amount} to piggy bank ${piggybankId}`,
            transaction: updatedTransaction
        });
    } catch (error) {
        res.status(400).json({ message: "Allocation failed", error: error.message });
    }
};
