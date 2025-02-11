const { Op } = require('sequelize');
const redisClient = require('../../utils/redisClient');
const { FundMetric } = require('../../models');

// Helper function for parsing query parameters (pagination and time range)
exports.parseQueryParams = (query) => {
  const page = query.page ? parseInt(query.page) : null;
  const limit = query.limit ? parseInt(query.limit) : null;
  const offset = page && limit ? (page - 1) * limit : null;

  const timeRange = query.range ? query.range.toLowerCase() : 'all';
  return { page, limit, offset, timeRange };
};

// Helper function to get date range based on timeRange query
exports.getTimeRangeFilter = (timeRange) => {
  const now = new Date();
  let startDate = null;

  switch (timeRange) {
    case '1d':
      startDate = new Date(now.setDate(now.getDate() - 1));
      break;
    case '1w':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case '1m':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case '3m':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case '1y':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    case 'all':
    default:
      startDate = null;
      break;
  }

  return startDate ? { lastUpdateTime: { [Op.gte]: startDate } } : {};
};

// Service function to fetch latest metrics
exports.fetchLatestMetrics = async () => {
  // Check if cached data exists in Redis
  const cachedMetrics = await redisClient.get('latestFundMetrics');
  if (cachedMetrics) {
    return { success: true, message: 'Fund metrics retrieved from cache', data: JSON.parse(cachedMetrics) };
  }

  // If no cached data, fetch from the database
  const latestMetrics = await FundMetric.findOne({
    order: [['lastUpdateTime', 'DESC']]
  });

  if (!latestMetrics) {
    return { success: false, message: 'No fund metrics available', code: 404 };
  }

  // Store metrics in Redis cache with TTL of 10 minutes
  await redisClient.setEx('latestFundMetrics', 600, JSON.stringify(latestMetrics));

  return { success: true, message: 'Latest fund metrics retrieved successfully', data: latestMetrics };
};

// Service function to fetch historical metrics data
exports.fetchHistoricalMetrics = async (page, limit, offset, timeRange) => {
  const timeFilter = exports.getTimeRangeFilter(timeRange);
  let metricsHistory;

  if (page && limit) {
    // Apply pagination if page and limit are provided
    metricsHistory = await FundMetric.findAndCountAll({
      where: timeFilter,
      order: [['lastUpdateTime', 'DESC']],
      limit,
      offset
    });

    if (!metricsHistory.count) {
      return { success: false, message: 'No fund metrics available for the selected range', code: 404 };
    }

    return {
      success: true,
      message: 'Historical fund metrics retrieved successfully',
      data: {
        totalItems: metricsHistory.count,
        totalPages: Math.ceil(metricsHistory.count / limit),
        currentPage: page,
        metrics: metricsHistory.rows
      }
    };
  } else {
    // If no pagination, fetch all metrics in the selected time range
    const allMetrics = await FundMetric.findAll({
      where: timeFilter,
      order: [['lastUpdateTime', 'DESC']]
    });

    if (!allMetrics.length) {
      return { success: false, message: 'No fund metrics available for the selected range', code: 404 };
    }

    return {
      success: true,
      message: 'All historical fund metrics retrieved successfully',
      data: allMetrics
    };
  }
};
