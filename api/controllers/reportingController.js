const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');
const { fetchBasicReport } = require('../services/reportingService');

// Get basic report (can be used for dashboard or landing pages)
exports.getBasicReport = async (req, res) => {
  try {
    const { success, message, data, code } = await fetchBasicReport();
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error('Error fetching basic report:', error);
    return errorResponse(res, 'Failed to fetch basic report', 500, { details: error.message });
  }
};
