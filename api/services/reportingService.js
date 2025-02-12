const { Investor, Transaction, FundMetrics } = require('../../models');
const { fetchLatestMetrics } = require('../services/metricsService');
const { Op } = require('sequelize');

// Service function for getting basic report
exports.fetchBasicReport = async (walletAddress) => {
  const totalUserCount = await Investor.count();
  const transactionVolInvest =
    (await Transaction.sum('usdAmount', {
      where: {
        transactionType: 'investment',
        created_at: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }
    })) ?? 0;
  const transactionVolRedeem =
    (await Transaction.sum('usdAmount', {
      where: {
        transactionType: 'redemption',
        created_at: { [Op.gte]: new Date(new Date() - 30 * 24 * 60 * 60 * 1000) } // Last 30 days
      }
    })) ?? 0;
  // top 10 investors
  const topInvestors = await Investor.findAll({
    attributes: ['walletAddress', 'balance'],
    order: [['balance', 'DESC']],
    limit: 10
  });

  const latestMetrics = (await fetchLatestMetrics()).data ?? null;

  return {
    success: true,
    message: 'Basic report generated successfully',
    data: {
      totalUserCount,
      transactionVolInvest,
      transactionVolRedeem,
      topInvestors,
      latestMetrics
    }
  };
};
