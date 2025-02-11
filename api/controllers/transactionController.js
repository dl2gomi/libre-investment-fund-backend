const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');
const { parseQueryParams, fetchAllTransactions, fetchTransactionsByWallet } = require('../services/transactionService');

// Get all transactions with pagination, ordering, and type filtering
exports.getAllTransactions = async (req, res) => {
  const { page, limit, offset, orderField, orderDirection, transactionType } = parseQueryParams(req.query);

  try {
    const { success, message, data, code } = await fetchAllTransactions(
      page,
      limit,
      offset,
      orderField,
      orderDirection,
      transactionType
    );
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error('Error fetching transactions:', error);
    return errorResponse(res, 'Failed to fetch transactions', 500, { details: error.message });
  }
};

// Get transactions for a specific wallet with pagination, ordering, and type filtering
exports.getTransactionsByWallet = async (req, res) => {
  const { walletAddress } = req.params;
  const { page, limit, offset, orderField, orderDirection, transactionType } = parseQueryParams(req.query);

  try {
    const { success, message, data, code } = await fetchTransactionsByWallet(
      walletAddress,
      page,
      limit,
      offset,
      orderField,
      orderDirection,
      transactionType
    );
    return !success ? errorResponse(res, message, code) : successResponse(res, message, data);
  } catch (error) {
    logger.error(`Error fetching transactions for ${walletAddress}:`, error);
    return errorResponse(res, 'Failed to fetch transactions', 500, { details: error.message });
  }
};
