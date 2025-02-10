const express = require('express');
const router = express.Router();
const { getAllTransactions, getTransactionsByWallet } = require('../controllers/transactionController');

// Get all transactions with pagination, ordering, and type filtering
router.get('/', getAllTransactions);

// Get transactions for a specific wallet with pagination, ordering, and type filtering
router.get('/:walletAddress', getTransactionsByWallet);

module.exports = router;
