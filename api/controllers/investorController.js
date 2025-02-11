const { fetchInvestors, fetchWallet, parseQueryParams } = require('../services/investorService');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// Get all investors with pagination, ordering, and last transaction time
exports.getAllInvestors = async (req, res) => {
  const { page, limit, offset, orderField, orderDirection } = parseQueryParams(req.query);

  try {
    const { success, message, data, code } = await fetchInvestors(page, limit, offset, orderField, orderDirection);
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error('Error fetching investors:', error);
    return errorResponse(res, 'Failed to fetch investors', 500, { details: error.message });
  }
};

// Get details of an individual investor by wallet address
exports.getInvestorByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const { success, message, data, code } = await fetchWallet(walletAddress);
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error(`Error fetching investor ${walletAddress}:`, error);
    return errorResponse(res, 'Failed to fetch investor', 500, { details: error.message });
  }
};
