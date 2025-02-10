const { Transaction, Investor } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// function for parsing query parameters (pagination, ordering, and filtering)
const parseQueryParams = (query) => {
  const page = parseInt(query.page) || 1;
  const limit = parseInt(query.limit) || 10;
  const offset = (page - 1) * limit;

  // Only allow ordering by 'timestamp' or 'usd_amount'
  const allowedOrderFields = ['timestamp', 'usd_amount'];
  const orderField = allowedOrderFields.includes(query.orderBy) ? query.orderBy : 'timestamp';
  const orderDirection = query.order === 'asc' ? 'ASC' : 'DESC';

  // filter by transaction type
  const transactionType = query.type ? query.type.toLowerCase() : null;

  return { page, limit, offset, orderField, orderDirection, transactionType };
};

// Get all transactions with pagination, ordering, and type filtering
exports.getAllTransactions = async (req, res) => {
  const { page, limit, offset, orderField, orderDirection, transactionType } = parseQueryParams(req.query);

  // Build query conditions
  const whereCondition = {};
  if (transactionType && ['investment', 'redemption'].includes(transactionType)) {
    whereCondition.transactionType = transactionType;
  }

  try {
    const transactions = await Transaction.findAndCountAll({
      where: whereCondition,
      include: [{ model: Investor, attributes: ['walletAddress'] }],
      order: [[orderField, orderDirection]],
      limit,
      offset
    });

    return successResponse(res, 'Transactions retrieved successfully', {
      totalItems: transactions.count,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: page,
      transactions: transactions.rows
    });
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
    const investor = await Investor.findOne({ where: { walletAddress } });
    if (!investor) {
      return errorResponse(res, 'Investor not found', 404);
    }

    // Build query conditions
    const whereCondition = { investorId: investor.id };
    if (transactionType && ['investment', 'redemption'].includes(transactionType)) {
      whereCondition.transactionType = transactionType;
    }

    const transactions = await Transaction.findAndCountAll({
      where: whereCondition,
      order: [[orderField, orderDirection]],
      limit,
      offset
    });

    return successResponse(res, 'Transactions retrieved successfully', {
      totalItems: transactions.count,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: page,
      transactions: transactions.rows
    });
  } catch (error) {
    logger.error(`Error fetching transactions for ${walletAddress}:`, error);
    return errorResponse(res, 'Failed to fetch transactions', 500, { details: error.message });
  }
};
