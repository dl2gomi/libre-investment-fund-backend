const { Investor, Transaction } = require('../models');
const { ethers } = require('ethers');
const logger = require('../utils/logger');

exports.handleInvestment = async (investorAddress, usdAmount, sharesIssued, sharePrice, txId) => {
  const formattedShares = ethers.formatUnits(sharesIssued, 6);
  const formattedUsdAmount = ethers.formatUnits(usdAmount, 6);

  // Find txId transaction in the DB
  const existingTransaction = await Transaction.findOne({ where: { txId } });

  // Return null if this transaction is already handled
  if (existingTransaction) {
    logger.warn(`Transaction already exists: ${txId}`);
    return null;
  }

  // Find or create the investor
  const [investor, created] = await Investor.findOrCreate({
    where: { walletAddress: investorAddress },
    defaults: { balance: formattedShares }
  });

  // If investor already exists, update their balance
  if (!created) {
    investor.balance = parseFloat(investor.balance) + parseFloat(formattedShares);
    await investor.save();
  }

  // Record the investment transaction
  await Transaction.create({
    investorId: investor.id,
    txId,
    transactionType: 'investment',
    usdAmount: formattedUsdAmount,
    shares: formattedShares
  });

  return { investor: investorAddress, sharesIssued: formattedShares, usdAmount: formattedUsdAmount };
};
