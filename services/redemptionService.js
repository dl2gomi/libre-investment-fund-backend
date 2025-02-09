const { ethers } = require('ethers');
const { Investor, Transaction } = require('../models');
const logger = require('../utils/logger');

exports.handleRedemption = async (investorAddress, shares, usdAmount, sharePrice, txId) => {
  const formattedShares = ethers.formatUnits(shares, 6);
  const formattedUsdAmount = ethers.formatUnits(usdAmount, 6);

  // Find txId transaction in the DB
  const existingTransaction = await Transaction.findOne({ where: { txId } });

  // Return null if this transaction is already handled
  if (existingTransaction) {
    logger.warn(`Transaction already exists: ${txId}`);
    return null;
  }

  // Find the investor
  const investor = await Investor.findOne({ where: { walletAddress: investorAddress } });

  if (investor) {
    investor.balance = parseFloat(investor.balance) - parseFloat(formattedShares);
    await investor.save();
  } else {
    return null;
  }

  // Record the redemption transaction
  await Transaction.create({
    investorId: investor.id,
    txId,
    transactionType: 'redemption',
    usdAmount: formattedUsdAmount,
    shares: formattedShares
  });

  return { investor: investorAddress, redeemedShares: formattedShares, usdAmount: formattedUsdAmount };
};
