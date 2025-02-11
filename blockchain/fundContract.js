const { ethers } = require('ethers');
const logger = require('../utils/logger');
require('dotenv').config();

let fundContract;
let httpProvider;
let wsProvider;
let wallet;

try {
  // Ethereum Provider
  httpProvider = new ethers.JsonRpcProvider(process.env.RPC_URL);
  wsProvider = new ethers.WebSocketProvider(process.env.WS_RPC_URL);

  // Wallet (for signing transactions)
  wallet = new ethers.Wallet(process.env.PRIVATE_KEY, httpProvider);

  // Contract Instance
  fundContract = new ethers.Contract(process.env.CONTRACT_ADDRESS, require('../abi/FundToken.abi.json'), wallet);
} catch (error) {
  logger.error('Error loading contract: ', error);
}

module.exports = { fundContract, httpProvider, wsProvider };
