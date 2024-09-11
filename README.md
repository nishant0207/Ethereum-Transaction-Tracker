# **Ethereum Deposit Tracker with Telegram Alerts**

This project monitors Ethereum blockchain deposits in real-time, stores the deposit details in a MongoDB database, and sends instant Telegram alerts whenever a new deposit is detected. It uses the Alchemy API to interact with the Ethereum blockchain and the ethers.js library to fetch transaction data.

---

## **Features:**

- **Real-time Deposit Monitoring**: Tracks deposits made to a specific Ethereum contract (such as the Beacon Deposit Contract).
- **Blockchain Interaction**: Fetches block data and transactions from the Ethereum mainnet using ethers.js and Alchemy API.
- **MongoDB Integration**: Stores deposit information, including block number, timestamp, sender, receiver, value, and transaction hash in MongoDB.
- **Telegram Alerts**: Automatically sends alerts to a specified Telegram chat for every new deposit.
- **Manual Deposit Entry**: A REST API allows for manual entry of deposits, which also triggers a Telegram alert.

---

## **Project Workflow:**

Here's the step-by-step flow of the project:

1. **Initialization**: 
   - The application connects to the Ethereum mainnet via Alchemy API.
   - MongoDB is connected to store deposit information.
   - A Telegram bot is initialized to send notifications.

2. **Tracking Deposits**:
   - The system listens for new blocks and transactions on the Ethereum network.
   - For each transaction, it checks whether the recipient is the specified deposit contract address.

3. **Validation**:
   - The transaction is validated to confirm it is a deposit to the contract.

4. **Data Storage**:
   - Valid deposit data is saved to the MongoDB database, including details like the block number, timestamp, sender, receiver, value in ETH, and the transaction hash.

5. **Telegram Notification**:
   - A detailed message with the deposit information is sent via Telegram to notify users of the new deposit.

---

## **Diagram:**

The process is illustrated in this flowchart:

```plaintext
        +-----------------------+
        |      Initialization    |
        +-----------------------+
                   |
                   v
        +-----------------------+
        |   Track Deposits from  |
        |   Ethereum Blockchain  |
        +-----------------------+
                   |
                   v
        +-----------------------+
        |  Validate Transaction  |
        |  (Is it a deposit?)    |
        +-----------------------+
                   |
                   v
        +-----------------------+
        |   Save to MongoDB      |
        +-----------------------+
                   |
                   v
        +-----------------------+
        |  Send Telegram Alert   |
        +-----------------------+
                   |
                   v
        +-----------------------+
        |        End Process     |
        +-----------------------+
```

---

## **Tech Stack:**

- **Node.js**: JavaScript runtime for backend services.
- **Express.js**: RESTful API framework for handling deposit submissions.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **MongoDB**: NoSQL database for storing deposit information.
- **Winston**: Logging library for tracking events.
- **Telegram Bot API**: For sending notifications about deposits.
- **Alchemy API**: Ethereum infrastructure provider for blockchain data.

---

## **Installation and Setup:**

Follow these steps to get the project running:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/ethereum-deposit-tracker.git
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create a `.env` file** in the root directory and add the following variables:
   ```bash
   ALCHEMY_API_KEY=your_alchemy_key
   MONGODB_URI=your_mongo_connection_uri
   TELEGRAM_BOT_TOKEN=your_telegram_bot_token
   TELEGRAM_CHAT_ID=your_telegram_chat_id
   PORT=your_desired_port
   ```

4. **Run the application**:
   ```bash
   npm start
   ```

---

## **API Endpoints:**

1. **`POST /deposits`**: Manually add a new deposit.
   - Example request body:
     ```json
     {
       "blockNumber": 1234567,
       "from": "0xSenderAddress",
       "to": "0xContractAddress",
       "value": "1.234",
       "hash": "0xTransactionHash"
     }
     ```
   - Response:
     ```json
     {
       "message": "Deposit added successfully!",
       "deposit": { ... }
     }
     ```

2. **`GET /deposits`**: Retrieve all saved deposits from MongoDB.

3. **`GET /deposits/:hash`**: Retrieve a specific deposit by its transaction hash.

---

## **Telegram Alerts:**

Each time a new deposit is detected or manually entered, a Telegram notification is sent with the following details:
- Block Number
- Sender Address
- Receiver (Contract) Address
- Deposit Value in ETH
- Transaction Hash

---

## **Environment Variables:**

Make sure to configure the following environment variables in your `.env` file:

- **`ALCHEMY_API_KEY`**: Your Alchemy API key for connecting to the Ethereum network.
- **`MONGODB_URI`**: The MongoDB connection string.
- **`TELEGRAM_BOT_TOKEN`**: The token for your Telegram bot.
- **`TELEGRAM_CHAT_ID`**: The chat ID where the Telegram bot will send messages.
- **`PORT`**: Port on which the application will run.

---

## **Contributing:**

Feel free to submit issues, feature requests, or pull requests. Contributions are welcome!

---

## **License:**

This project is licensed under the MIT License.

---
![Uploading image.png…]()
