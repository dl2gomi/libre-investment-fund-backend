const { Op, Sequelize } = require('sequelize');
const { Investor, Transaction } = require('../../models');
const { successResponse, errorResponse } = require('../../utils/response');
const logger = require('../../utils/logger');

// Helper function for parsing query parameters (pagination and ordering)
const parseQueryParams = (query) => {
  const page = query.page ? parseInt(query.page) : null;
  const limit = query.limit ? parseInt(query.limit) : null;
  const offset = page && limit ? (page - 1) * limit : null;

  const allowedOrderFields = ['balance', 'created_at', 'last_transaction_time'];
  const orderField = allowedOrderFields.includes(query.orderBy) ? query.orderBy : 'created_at';
  const orderDirection = query.order === 'asc' ? 'ASC' : 'DESC';

  return { page, limit, offset, orderField, orderDirection };
};

// Get all investors with pagination, ordering, and last transaction time
exports.getAllInvestors = async (req, res) => {
  const { page, limit, offset, orderField, orderDirection } = parseQueryParams(req.query);

  try {
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
      return errorResponse(res, 'No investors found', 404);
    }

    if (page && limit) {
      return successResponse(res, 'Investors retrieved successfully', {
        totalItems: investors.length,
        totalPages: Math.ceil(investors.length / limit),
        currentPage: page,
        investors: paginatedInvestors
      });
    } else {
      return successResponse(res, 'All investors retrieved successfully', paginatedInvestors);
    }
  } catch (error) {
    logger.error('Error fetching investors:', error);
    return errorResponse(res, 'Failed to fetch investors', 500, { details: error.message });
  }
};

// Get details of an individual investor by wallet address
exports.getInvestorByWallet = async (req, res) => {
  const { walletAddress } = req.params;

  try {
    const investor = await Investor.findOne({
      where: { walletAddress },
      attributes: ['walletAddress', 'balance', 'createdAt']
    });

    if (!investor) {
      return errorResponse(res, 'Investor not found', 404);
    }

    // Get the last transaction time
    const lastTransaction = await Transaction.findOne({
      where: { investorId: investor.id },
      order: [['timestamp', 'DESC']]
    });

    return successResponse(res, 'Investor retrieved successfully', {
      walletAddress: investor.walletAddress,
      balance: investor.balance,
      createdAt: investor.createdAt,
      lastTransactionTime: lastTransaction ? lastTransaction.timestamp : null
    });
  } catch (error) {
    logger.error(`Error fetching investor ${walletAddress}:`, error);
    return errorResponse(res, 'Failed to fetch investor', 500, { details: error.message });
  }
};
