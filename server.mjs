import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';  // Import body-parser
import Deposit from './deposit.js';
import path from 'path';  // Import the path module
import { fileURLToPath } from 'url';  // Import to resolve __dirname
import { sendTelegramAlert } from './telegram.js'; // Import Telegram Bot utility
import cors from 'cors';  // Import CORS

dotenv.config(); // Load environment variables from .env

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Resolve __dirname since it's not available by default in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Enable CORS for all routes
app.use(cors());

// Add body-parser middleware to handle JSON requests
app.use(bodyParser.json());

// Serve the form.html file (for frontend deposit submission)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'form.html'));
});

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1);
    });

// Route to manually insert a deposit
app.post('/deposits', async (req, res) => {
    try {
        const deposit = new Deposit({
            blockNumber: req.body.blockNumber,
            blockTimestamp: new Date(),
            from: req.body.from,
            to: req.body.to,
            value: req.body.value,
            hash: req.body.hash
        });

        // Save the deposit to MongoDB
        await deposit.save();

        // Send a Telegram notification with the new deposit details
        const message = `
New deposit added:
- Block Number: ${deposit.blockNumber}
- From: ${deposit.from}
- To: ${deposit.to}
- Value: ${deposit.value} ETH
- Transaction Hash: ${deposit.hash}
        `;
        sendTelegramAlert(message); // Send the alert to Telegram

        // Respond with success message
        res.status(201).json({ message: 'Deposit added successfully!', deposit });
    } catch (error) {
        console.error("Error adding deposit:", error);
        res.status(500).json({ error: 'Error adding deposit' });
    }
});

// Route to fetch all deposits
app.get('/deposits', async (req, res) => {
    try {
        const deposits = await Deposit.find(); // Fetch all deposits
        res.json(deposits);
    } catch (error) {
        console.error("Error fetching deposits:", error);
        res.status(500).json({ error: 'Error fetching deposits' });
    }
});

// Route to fetch deposit by transaction hash
app.get('/deposits/:hash', async (req, res) => {
    try {
        const deposit = await Deposit.findOne({ hash: req.params.hash }); // Fetch deposit by transaction hash
        if (!deposit) {
            return res.status(404).json({ error: 'Deposit not found' });
        }
        res.json(deposit);
    } catch (error) {
        console.error("Error fetching deposit:", error);
        res.status(500).json({ error: 'Error fetching deposit' });
    }
});

// Start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});