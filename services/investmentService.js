const { Investor, Transaction, LastBlock } = require('../models');
const { ethers } = require('ethers');

exports.handleInvestment = async (investorAddress, usdAmount, sharesIssued, sharePrice, event) => {
  const block = await event.getBlock();
  const txId = event.log?.transactionHash ?? event.transactionHash;
  const blockNumber = block.number;

  const lastBlock = await LastBlock.findOne({ where: { eventName: 'Investment' } });

  // Return null if this transaction is already handled
  if (lastBlock && lastBlock.blockNumber >= blockNumber) {
    return null;
  }

  // Find txId transaction in the DB
  const existingTransaction = await Transaction.findOne({ where: { txId } });

  // Return null if this transaction is already handled
  if (existingTransaction) {
    return null;
  }

  const formattedShares = ethers.formatUnits(sharesIssued, 6);
  const formattedUsdAmount = ethers.formatUnits(usdAmount, 6);

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

  // Record the last block number
  await LastBlock.upsert({ eventName: 'Investment', blockNumber });

  return { investor: investorAddress, sharesIssued: formattedShares, usdAmount: formattedUsdAmount };
};
