import { AlchemyProvider, formatEther } from 'ethers';
import dotenv from 'dotenv';
import winston from 'winston';
import mongoose from 'mongoose';
import Deposit from './deposit.js'; // Import the Mongoose model
import { sendTelegramAlert } from './telegram.js'; // Import the Telegram alert function

dotenv.config(); // Load environment variables from .env

// Set up logging using winston
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new winston.transports.File({ filename: 'combined.log' }),
        new winston.transports.Console({ format: winston.format.simple() })
    ],
});

// Beacon Deposit Contract address
const beaconDepositContractAddress = "0x00000000219ab540356cBB839Cbe05303d7705Fa";

// Initialize AlchemyProvider with ethers v6
const provider = new AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY || process.env.ALCHEMY_API_URL);

// Connect to MongoDB with proper error handling (Remove deprecated options)
mongoose.connect(process.env.MONGODB_URI).then(() => {
    logger.info("Connected to MongoDB");
}).catch((error) => {
    logger.error("Error connecting to MongoDB", error);
    process.exit(1); // Exit if there's an error connecting to the database
});

// Function to track deposits from Ethereum blockchain
async function trackDeposits() {
    logger.info(`Tracking deposits to contract: ${beaconDepositContractAddress}`);
    
    provider.on("block", async (blockNumber) => {
        try {
            const block = await provider.getBlock(blockNumber);
            
            for (const txHash of block.transactions) {
                const tx = await provider.getTransaction(txHash);

                if (tx.to && tx.to.toLowerCase() === beaconDepositContractAddress.toLowerCase()) {
                    const depositInfo = {
                        blockNumber: tx.blockNumber,
                        blockTimestamp: new Date(block.timestamp * 1000), // Convert to JavaScript Date
                        from: tx.from,
                        to: tx.to,
                        value: formatEther(tx.value), // Format value to ETH
                        hash: tx.hash
                    };

                    logger.info(`New deposit detected in transaction: ${tx.hash}`, depositInfo);

                    try {
                        // Save the deposit to the database
                        const newDeposit = new Deposit(depositInfo);
                        await newDeposit.save(); // Ensure the save operation completes

                        logger.info(`Deposit saved to MongoDB: ${tx.hash}`);

                        // Send a Telegram notification with the new deposit details
                        const message = `
New deposit detected:
- Block Number: ${depositInfo.blockNumber}
- From: ${depositInfo.from}
- To: ${depositInfo.to}
- Value: ${depositInfo.value} ETH
- Transaction Hash: ${depositInfo.hash}
                        `;
                        sendTelegramAlert(message); // Send the alert to Telegram
                    } catch (saveError) {
                        logger.error("Error saving deposit to MongoDB:", saveError);
                    }
                }
            }
        } catch (error) {
            logger.error("Error fetching block transactions:", error);
        }
    });
}

// Start tracking blockchain deposits
trackDeposits().catch((error) => {
    logger.error("Error tracking deposits:", error);
    process.exit(1);
});

// Optional: Log message on server start
logger.info("Server started, monitoring for deposits...");