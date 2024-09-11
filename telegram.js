import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env

// Initialize the Telegram Bot with the token
const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: false });

// Function to send a Telegram alert
export function sendTelegramAlert(message) {
    bot.sendMessage(process.env.TELEGRAM_CHAT_ID, message)
        .then(() => console.log("Telegram alert sent"))
        .catch((error) => console.error("Error sending Telegram alert:", error));
}