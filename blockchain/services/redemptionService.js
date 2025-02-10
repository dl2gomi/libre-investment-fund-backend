const { ethers } = require('ethers');
const { Investor, Transaction, LastBlock } = require('../../models');

exports.handleRedemption = async (investorAddress, shares, usdAmount, sharePrice, event) => {
  const block = await event.getBlock();
  const txId = event.log?.transactionHash ?? event.transactionHash;
  const blockNumber = block.number;

  const lastBlock = await LastBlock.findOne({ where: { eventName: 'Redemption' } });

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

  const formattedShares = ethers.formatUnits(shares, 6);
  const formattedUsdAmount = ethers.formatUnits(usdAmount, 6);

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

  // Record the last block number
  await LastBlock.upsert({ eventName: 'Redemption', blockNumber });

  return { investor: investorAddress, redeemedShares: formattedShares, usdAmount: formattedUsdAmount };
};
