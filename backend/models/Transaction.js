const { MongoClient, ObjectId } = require('mongodb');
const { performance } = require('perf_hooks');

// Replace with your Atlas DB credentials
const uri = "mongodb+srv://mayyuchencao:2025TechNova@25technova.cm7fhyt.mongodb.net/?retryWrites=true&w=majority&appName=25TechNova";
const client = new MongoClient(uri);

// Global collection variables
let piggybanks;
let transactions;

class PiggyBank {
    constructor(name, type, goal, icon_id = "default_piggy") {
        this.data = {
            name: name,
            type: type,         // savings, treat, sos, debt, custom
            balance: 0.0,
            goal: goal,
            completed: false,
            opened: false,
            transactions: [],   // This will store transaction ObjectIds
            createdAt: new Date(),
            updatedAt: new Date(),
            iconId: icon_id
        };
    }

    async save() {
        const result = await piggybanks.insertOne(this.data);
        this.data._id = result.insertedId;
        return this.data._id;
    }

    static async getAll() {
        // .find() returns a cursor, .toArray() gets all documents
        return await piggybanks.find({}).toArray();
    }

    static async getById(piggybankId) {
        // In the JS driver, ObjectId needs to be instantiated with 'new'
        return await piggybanks.findOne({ "_id": new ObjectId(piggybankId) });
    }

    static async addFunds(piggybankId, amount, transactionId) {
        await piggybanks.updateOne(
            { "_id": new ObjectId(piggybankId) },
            {
                $inc: { "balance": amount },
                $push: { "transactions": new ObjectId(transactionId) },
                $set: { "updatedAt": new Date() }
            }
        );
    }
}


class Transaction {
    constructor(amount, label, source, piggyBankId = null, note = "") {
        this.data = {
            amount: amount,
            label: label,
            source: source,       // manual, e-transfer, cash, etc.
            piggyBankId: piggyBankId, // Use null for unallocated
            note: note,
            createdAt: new Date()
        };
    }

    async save() {
        const result = await transactions.insertOne(this.data);
        this.data._id = result.insertedId;
        return this.data._id;
    }

    static async getUnallocated() {
        // In JS, Python's `None` is `null`
        return await transactions.find({ "piggyBankId": null }).toArray();
    }

    static async allocate(transactionId, piggybankId) {
        // 1. Update the transaction to link it to the piggy bank
        await transactions.updateOne(
            { "_id": new ObjectId(transactionId) },
            { "$set": { "piggyBankId": new ObjectId(piggybankId) } }
        );

        // 2. Get the transaction to find its amount
        const tx = await transactions.findOne({ "_id": new ObjectId(transactionId) });
        if (tx) {
            // 3. Add the funds to the piggy bank
            await PiggyBank.addFunds(piggybankId, tx.amount, transactionId);
        } else {
            console.error("Could not find transaction to allocate.");
        }
    }
}


// Main function to run the demonstration
async function main() {
    try {
        // Connect to the database
        await client.connect();
        console.log("Connected to MongoDB Atlas!");

        const db = client.db("girlmath");
        piggybanks = db.collection("piggybanks");
        transactions = db.collection("transactions");

        // 1. Create a new PiggyBank
        const vacation = new PiggyBank("Vacation Fund", "savings", 100.0);
        const piggyId = await vacation.save();
        console.log("PiggyBank created with id:", piggyId);

        // 2. Create a new Transaction
        const coffeeSkip = new Transaction(5.0, "Skipped Coffee", "manual");
        const txId = await coffeeSkip.save();
        console.log("Transaction created with id:", txId);

        // 3. Allocate the Transaction to the PiggyBank
        await Transaction.allocate(txId, piggyId);
        console.log("Allocated $5 to Vacation Fund");

        // 4. Show all PiggyBanks
        const allPiggyBanks = await PiggyBank.getAll();
        console.log("\n--- All PiggyBanks in DB ---");
        allPiggyBanks.forEach(pb => console.log(pb));
        console.log("----------------------------");

        // 5. Show unallocated Transactions
        const unallocated = await Transaction.getUnallocated();
        console.log("\nUnallocated Transactions:", unallocated);

    } catch (e) {
        console.error(e);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
        console.log("\nConnection closed.");
    }
}

// Run the main function and catch any errors
main().catch(console.error);
