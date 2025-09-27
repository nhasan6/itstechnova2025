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
 * @param {number} transactionId The ID of the transaction.
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
