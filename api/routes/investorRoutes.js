const express = require('express');
const router = express.Router();
const { getAllInvestors, getInvestorByWallet } = require('../controllers/investorController');

// Get all investors with pagination, ordering, and last transaction time
router.get('/', getAllInvestors);

// Get details of an individual investor by wallet address
router.get('/:walletAddress', getInvestorByWallet);

module.exports = router;
