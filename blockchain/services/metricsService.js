const { ethers } = require('ethers');
const { FundMetric, LastBlock } = require('../../models');
const redisClient = require('../../utils/redisClient');

exports.handleMetricsUpdated = async (totalAssetValue, sharesSupply, sharePrice, event) => {
  const block = await event.getBlock();
  const blocktime = new Date(block.timestamp * 1000);
  const blockNumber = block.number;

  const formattedAssetValue = ethers.formatUnits(totalAssetValue, 6);
  const formattedSharesSupply = ethers.formatUnits(sharesSupply, 6);
  const formattedSharePrice = ethers.formatUnits(sharePrice, 6);

  // Save updated fund metrics
  await FundMetric.create({
    totalAssetValue: formattedAssetValue,
    sharesSupply: formattedSharesSupply,
    sharePrice: formattedSharePrice,
    lastUpdateTime: blocktime
  });

  await redisClient.del('latestFundMetrics');

  // Record the last block number
  await LastBlock.upsert({ eventName: 'MetricsUpdated', blockNumber });

  return {
    totalAssetValue: formattedAssetValue,
    sharesSupply: formattedSharesSupply,
    sharePrice: formattedSharePrice,
    lastUpdateTime: blocktime
  };
};
