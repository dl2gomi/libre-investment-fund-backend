const { ethers } = require('ethers');
const logger = require('../utils/logger');
require('dotenv').config();

let fundContract;

try {
  // Load contract ABI
  const fundTokenABI = require('../abi/FundToken.abi.json').abi;

  // Ethereum Provider (use Infura, Alchemy, or a local node)
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Wallet (for signing transactions)
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Contract Instance
  fundContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, fundTokenABI, wallet);
} catch (error) {
  logger.error('Error loading contract: ', error);
}

module.exports = fundContract;
