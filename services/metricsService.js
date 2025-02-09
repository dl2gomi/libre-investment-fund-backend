const { ethers } = require('ethers');
const { FundMetric } = require('../models');

exports.handleMetricsUpdated = async (totalAssetValue, sharesSupply, sharePrice, blocktime) => {
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

  return {
    totalAssetValue: formattedAssetValue,
    sharesSupply: formattedSharesSupply,
    sharePrice: formattedSharePrice,
    lastUpdateTime: blocktime
  };
};
