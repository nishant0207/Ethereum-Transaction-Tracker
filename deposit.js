// deposit.js
import mongoose from 'mongoose';

const depositSchema = new mongoose.Schema({
    blockNumber: Number,
    blockTimestamp: Date,
    from: String,
    to: String,
    value: String, // ETH value as a string to avoid precision issues
    hash: String
});

// Create the model from the schema and export it
const Deposit = mongoose.model('Deposit', depositSchema);

export default Deposit;