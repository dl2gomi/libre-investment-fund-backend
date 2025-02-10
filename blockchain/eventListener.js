require('dotenv').config();
const { handleInvestment } = require('../services/investmentService');
const { handleRedemption } = require('../services/redemptionService');
const { handleMetricsUpdated } = require('../services/metricsService');
const fundContract = require('./fundContract');
const logger = require('../utils/logger');

async function listenEvents() {
  // Event: Investment
  fundContract.on('Investment', async (investor, usdAmount, sharesIssued, sharePrice, event) => {
    try {
      const result = await handleInvestment(investor, usdAmount, sharesIssued, sharePrice, event);
      if (result) logger.info(`Processed Investment Event: `, result);
    } catch (error) {
      logger.error(`Error processing investment event: `, error);
    }
  });

  // Event: Redemption
  fundContract.on('Redemption', async (investor, shares, usdAmount, sharePrice, event) => {
    try {
      const result = await handleRedemption(investor, shares, usdAmount, sharePrice, event);
      if (result) logger.info(`Processed Redemption Event: `, result);
    } catch (error) {
      logger.error(`Error processing investment event: `, error);
    }
  });

  // Event: MetricsUpdated
  fundContract.on('MetricsUpdated', async (totalAssetValue, sharesSupply, sharePrice, event) => {
    try {
      const result = await handleMetricsUpdated(totalAssetValue, sharesSupply, sharePrice, event);
      if (result) logger.info(`Processed Metrics Update: `, result);
    } catch (error) {
      logger.error(`Error processing metrics update: `, error);
    }
  });
}

module.exports = { listenEvents };
