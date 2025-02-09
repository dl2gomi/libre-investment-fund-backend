const { ethers } = require('ethers');
require('dotenv').config();

// Load contract ABI
const fundTokenABI = require('../abi/FundToken.json');

// Ethereum Provider (use Infura, Alchemy, or a local node)
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

// Wallet (for signing transactions)
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Contract Instance
const contractAddress = process.env.CONTRACT_ADDRESS;
const fundContract = new ethers.Contract(contractAddress, fundTokenABI, wallet);

module.exports = fundContract;
