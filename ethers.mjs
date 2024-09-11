// ethers.mjs
import { JsonRpcProvider } from 'ethers';

// Connect to the Ethereum network
const provider = new JsonRpcProvider("https://eth-mainnet.g.alchemy.com/v2/4MPPuDLTihSEUPDFNPQcRYvVy-Hu3GyC");

async function getBlock() {
    try {
        // Get block by number
        const blockNumber = "latest";
        const block = await provider.getBlock(blockNumber);
        console.log(block);
    } catch (error) {
        console.error("Error fetching block:", error);
    }
}

// Call the function to get the block
getBlock();