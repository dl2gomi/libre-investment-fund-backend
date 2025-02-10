const { Op } = require('sequelize');
const { FundMetric } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// Function for parsing query parameters (pagination and time range)
const parseQueryParams = (query) => {
  const page = query.page ? parseInt(query.page) : null;
  const limit = query.limit ? parseInt(query.limit) : null;
  const offset = page && limit ? (page - 1) * limit : null;

  const timeRange = query.range ? query.range.toLowerCase() : 'all';
  return { page, limit, offset, timeRange };
};

// Function to get date range based on timeRange query
const getTimeRangeFilter = (timeRange) => {
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

// Get the latest fund metrics (most recent record)
exports.getLatestMetrics = async (req, res) => {
  try {
    const latestMetrics = await FundMetric.findOne({
      order: [['lastUpdateTime', 'DESC']]
    });

    if (!latestMetrics) {
      return errorResponse(res, 'No fund metrics available', 404);
    }

    return successResponse(res, 'Latest fund metrics retrieved successfully', latestMetrics);
  } catch (error) {
    logger.error('Error fetching latest fund metrics:', error);
    return errorResponse(res, 'Failed to fetch latest fund metrics', 500, { details: error.message });
  }
};

// Get historical fund metrics with optional pagination and time range filtering
exports.getHistoricalMetrics = async (req, res) => {
  const { page, limit, offset, timeRange } = parseQueryParams(req.query);
  const timeFilter = getTimeRangeFilter(timeRange);

  try {
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
        return errorResponse(res, 'No fund metrics available for the selected range', 404);
      }

      return successResponse(res, 'Historical fund metrics retrieved successfully', {
        totalItems: metricsHistory.count,
        totalPages: Math.ceil(metricsHistory.count / limit),
        currentPage: page,
        metrics: metricsHistory.rows
      });
    } else {
      // If no pagination, fetch all metrics in the selected time range
      const allMetrics = await FundMetric.findAll({
        where: timeFilter,
        order: [['lastUpdateTime', 'DESC']]
      });

      if (!allMetrics.length) {
        return errorResponse(res, 'No fund metrics available for the selected range', 404);
      }

      return successResponse(res, 'All historical fund metrics retrieved successfully', allMetrics);
    }
  } catch (error) {
    logger.error('Error fetching historical fund metrics:', error);
    return errorResponse(res, 'Failed to fetch historical fund metrics', 500, { details: error.message });
  }
};
