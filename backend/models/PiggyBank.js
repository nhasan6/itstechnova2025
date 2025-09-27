// import module
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
 * @param {number} transactionId The ID of the transaction to link.
 */
piggyBankSchema.statics.addFunds = async function(piggybankId, amount, transactionId) {
    // The `timestamps: true` option automatically handles `updatedAt`
    return this.findByIdAndUpdate(piggybankId, {
        $inc: { balance: amount },
        $push: { transactions: transactionId },
    });
};

module.exports = mongoose.model('PiggyBank', piggyBankSchema);