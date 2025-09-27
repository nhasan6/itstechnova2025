const PiggyBank = require('../models/PiggyBank') 

const getPiggyBanks = async (req,res) => {
    try {
        const piggybanks = await PiggyBank.find();
        res.status(200).json(piggybanks);
    } catch (err) {
        res.status(500).json({message: 'Error fetching piggy banks'});
    }
}

const getPiggyBankById = async (req, res) => {
    try {
        const piggybank = await PiggyBank.findById(req.params.id);
        if (!piggybank) {
            return res.status(404).json({error: 'not found'});
        } 
        res.status(200).json(piggybank);
    } catch (err) {
        res.status(500).json({error: err.message}); 
    }
}

const createPiggyBank = async (req, res) => {
    try {
        const piggyBank = await PiggyBank.create(req.body);
        res.status(201).json(piggyBank);
    } catch (err) {
        res.status(400).json({error: err.message});
    }
}

const openBank = async (req,res) => {
    try {
        const { piggyBankId } = req.body;
        const piggyBank = await PiggyBank.findById(piggyBankId);

        if (!piggyBank) {
            return res.status(400).json({error: 'Piggy Bank not found'});
        }
        if ((piggyBank.balance < piggyBank.goal) || piggyBank.opened) {
            return res.status(400).json({error: 'Bank has not reached goal or it has already been opened'});
        }
        piggyBank.opened = true;
        piggyBank.balance -= piggyBank.goal;
        await piggyBank.save();
        res.status(200).json(piggyBank);

    } catch (err) {
        res.status(500).json({error: err.message})
    }
}

module.exports = {
    getPiggyBanks,
    getPiggyBankById,
    createPiggyBank,
    openBank
};