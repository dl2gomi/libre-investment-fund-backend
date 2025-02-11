const { Transaction, Investor } = require('../../models');

// function for parsing query parameters (pagination, ordering, and filtering)
exports.parseQueryParams = (query) => {
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

// Service function to fetch all the transactions filtered, ordered and paginated
exports.fetchAllTransactions = async (page, limit, offset, orderField, orderDirection, transactionType) => {
  // Build query conditions
  const whereCondition = {};
  if (transactionType && ['investment', 'redemption'].includes(transactionType)) {
    whereCondition.transactionType = transactionType;
  }

  const transactions = await Transaction.findAndCountAll({
    where: whereCondition,
    include: [{ model: Investor, attributes: ['walletAddress'] }],
    order: [[orderField, orderDirection]],
    limit,
    offset
  });

  return {
    success: true,
    message: 'Transactions retrieved successfully',
    data: {
      totalItems: transactions.count,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: page,
      transactions: transactions.rows
    }
  };
};

// Service function to fetch transactions of a wallet address
exports.fetchTransactionsByWallet = async (
  walletAddress,
  page,
  limit,
  offset,
  orderField,
  orderDirection,
  transactionType
) => {
  const investor = await Investor.findOne({ where: { walletAddress } });
  if (!investor) {
    return { success: false, message: 'Investor not found', code: 404 };
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

  return {
    success: true,
    message: 'Transactions retrieved successfully',
    data: {
      totalItems: transactions.count,
      totalPages: Math.ceil(transactions.count / limit),
      currentPage: page,
      transactions: transactions.rows
    }
  };
};
