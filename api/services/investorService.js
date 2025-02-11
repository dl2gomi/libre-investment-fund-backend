const { Investor, Transaction } = require('../../models');

// Helper function for parsing query parameters (pagination and ordering)
exports.parseQueryParams = (query) => {
  const page = query.page ? parseInt(query.page) : null;
  const limit = query.limit ? parseInt(query.limit) : null;
  const offset = page && limit ? (page - 1) * limit : null;

  const allowedOrderFields = ['balance', 'created_at', 'last_transaction_time'];
  const orderField = allowedOrderFields.includes(query.orderBy) ? query.orderBy : 'created_at';
  const orderDirection = query.order === 'asc' ? 'ASC' : 'DESC';

  return { page, limit, offset, orderField, orderDirection };
};

// Service function for getting investors
exports.fetchInvestors = async (page, limit, offset, orderField, orderDirection) => {
  // Fetch investors with basic attributes
  let investors = await Investor.findAll({
    attributes: ['id', 'walletAddress', 'balance', 'createdAt']
  });

  // Add last transaction time for each investor
  investors = await Promise.all(
    investors.map(async (investor) => {
      const lastTransaction = await Transaction.findOne({
        where: { investorId: investor.id },
        order: [['timestamp', 'DESC']]
      });

      return {
        walletAddress: investor.walletAddress,
        balance: investor.balance,
        createdAt: investor.createdAt,
        lastTransactionTime: lastTransaction ? lastTransaction.timestamp : null
      };
    })
  );

  // Apply ordering logic
  investors.sort((a, b) => {
    if (orderField === 'last_transaction_time') {
      const timeA = a.lastTransactionTime ? new Date(a.lastTransactionTime) : new Date(0);
      const timeB = b.lastTransactionTime ? new Date(b.lastTransactionTime) : new Date(0);
      return orderDirection === 'ASC' ? timeA - timeB : timeB - timeA;
    } else if (orderField === 'created_at') {
      const createdA = new Date(a.createdAt);
      const createdB = new Date(b.createdAt);
      return orderDirection === 'ASC' ? createdA - createdB : createdB - createdA;
    } else {
      // Default ordering by balance
      return orderDirection === 'ASC' ? a.balance - b.balance : b.balance - a.balance;
    }
  });

  // Apply pagination if provided
  const paginatedInvestors = page && limit ? investors.slice(offset, offset + limit) : investors;

  if (!investors.length) {
    return { success: false, message: 'No investors found', code: 404 };
  }

  if (page && limit) {
    return {
      success: true,
      message: 'Investors retrieved successfully',
      data: {
        totalItems: investors.length,
        totalPages: Math.ceil(investors.length / limit),
        currentPage: page,
        investors: paginatedInvestors
      }
    };
  } else {
    return { success: true, message: 'All investors retrieved successfully', data: paginatedInvestors };
  }
};

// Service function to get investor by wallet address
exports.fetchWallet = async (walletAddress) => {
  const investor = await Investor.findOne({
    where: { walletAddress },
    attributes: ['walletAddress', 'balance', 'createdAt']
  });

  if (!investor) {
    return { success: false, message: 'Investor not found', code: 404 };
  }

  // Get the last transaction time
  const lastTransaction = await Transaction.findOne({
    where: { investorId: investor.id },
    order: [['timestamp', 'DESC']]
  });

  return {
    success: true,
    message: 'Investor retrieved successfully',
    data: {
      walletAddress: investor.walletAddress,
      balance: investor.balance,
      createdAt: investor.createdAt,
      lastTransactionTime: lastTransaction ? lastTransaction.timestamp : null
    }
  };
};
