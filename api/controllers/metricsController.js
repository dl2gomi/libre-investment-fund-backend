const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');
const { parseQueryParams, fetchLatestMetrics, fetchHistoricalMetrics } = require('../services/metricsService');

// Get the latest fund metrics (most recent record)
exports.getLatestMetrics = async (req, res) => {
  try {
    const { success, message, data, code } = await fetchLatestMetrics();
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error('Error fetching latest fund metrics:', error);
    return errorResponse(res, 'Failed to fetch latest fund metrics', 500, { details: error.message });
  }
};

// Get historical fund metrics with optional pagination and time range filtering
exports.getHistoricalMetrics = async (req, res) => {
  const { page, limit, offset, timeRange } = parseQueryParams(req.query);

  try {
    const { success, message, data, code } = await fetchHistoricalMetrics(page, limit, offset, timeRange);
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error('Error fetching historical fund metrics:', error);
    return errorResponse(res, 'Failed to fetch historical fund metrics', 500, { details: error.message });
  }
};
