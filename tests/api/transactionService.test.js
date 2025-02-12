const {
  parseQueryParams,
  fetchAllTransactions,
  fetchTransactionsByWallet
} = require('../../api/services/transactionService');
const { Transaction, Investor } = require('../../models');
jest.mock('../../models');

describe('API: Transaction Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // parseQueryParams returns default values when no query parameters provided
  it('should return default values when query object is empty', () => {
    const query = {};
    const result = parseQueryParams(query);

    expect(result).toEqual({
      page: 1,
      limit: 10,
      offset: 0,
      orderField: 'timestamp',
      orderDirection: 'DESC',
      transactionType: null
    });
  });

  // Invalid page/limit numbers are handled with defaults
  it('should use default values when invalid page and limit are provided', () => {
    const query = {
      page: 'invalid',
      limit: 'abc'
    };

    const result = parseQueryParams(query);

    expect(result.page).toBe(1);
    expect(result.limit).toBe(10);
    expect(result.offset).toBe(0);
  });

  // fetchTransactionsByWallet returns transactions for valid wallet address
  it('should return transactions for a valid wallet address', async () => {
    const mockWalletAddress = 'validWalletAddress';
    const mockInvestor = { id: 1, walletAddress: mockWalletAddress };
    const mockTransactions = {
      count: 2,
      rows: [
        { id: 1, transactionType: 'investment' },
        { id: 2, transactionType: 'redemption' }
      ]
    };

    jest.spyOn(Investor, 'findOne').mockResolvedValue(mockInvestor);
    jest.spyOn(Transaction, 'findAndCountAll').mockResolvedValue(mockTransactions);

    const result = await fetchTransactionsByWallet(mockWalletAddress, 1, 10, 0, 'timestamp', 'DESC', null);

    expect(result).toEqual({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        totalItems: 2,
        totalPages: 1,
        currentPage: 1,
        transactions: mockTransactions.rows
      }
    });
  });

  // fetchAllTransactions returns paginated transactions with default ordering
  it('should return paginated transactions with default ordering when no specific order is provided', async () => {
    const mockTransactions = {
      count: 20,
      rows: [
        { id: 1, transactionType: 'investment' },
        { id: 2, transactionType: 'redemption' }
      ]
    };

    const Transaction = require('../../models').Transaction;
    jest.spyOn(Transaction, 'findAndCountAll').mockResolvedValue(mockTransactions);

    const result = await fetchAllTransactions(1, 10, 0, 'timestamp', 'DESC', null);

    expect(Transaction.findAndCountAll).toHaveBeenCalledWith({
      where: {},
      include: [{ model: require('../../models').Investor, as: 'investor', attributes: ['walletAddress'] }],
      order: [['timestamp', 'DESC']],
      limit: 10,
      offset: 0
    });

    expect(result).toEqual({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        totalItems: 20,
        totalPages: 2,
        currentPage: 1,
        transactions: mockTransactions.rows
      }
    });
  });

  // Transaction type filter works for investment and redemption types
  it('should filter transactions by type when type is investment or redemption', async () => {
    Transaction.findAndCountAll = jest.fn().mockResolvedValue({
      count: 1,
      rows: [{ id: 1, transactionType: 'investment' }]
    });
    Investor.findOne = jest.fn().mockResolvedValue({ id: 1, walletAddress: '0x123' });

    const result = await fetchTransactionsByWallet('0x123', 1, 10, 0, 'timestamp', 'ASC', 'investment');

    expect(Transaction.findAndCountAll).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { investorId: 1, transactionType: 'investment' }
      })
    );
    expect(result).toEqual({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        totalItems: 1,
        totalPages: 1,
        currentPage: 1,
        transactions: [{ id: 1, transactionType: 'investment' }]
      }
    });
  });

  // Non-existent wallet address returns 404 error
  it('should return 404 error when wallet address does not exist', async () => {
    const mockWalletAddress = 'nonexistent_wallet';
    const mockInvestorFindOne = jest.spyOn(Investor, 'findOne').mockResolvedValue(null);

    const result = await fetchTransactionsByWallet(mockWalletAddress, 1, 10, 0, 'timestamp', 'DESC', null);

    expect(mockInvestorFindOne).toHaveBeenCalledWith({ where: { walletAddress: mockWalletAddress } });
    expect(result).toEqual({ success: false, message: 'Investor not found', code: 404 });

    mockInvestorFindOne.mockRestore();
  });

  // Pagination calculations handle zero total items
  it('should return zero total pages and items when there are no transactions', async () => {
    Investor.findOne = jest.fn().mockResolvedValue({ id: 1 });
    Transaction.findAndCountAll = jest.fn().mockResolvedValue({ count: 0, rows: [] });

    const result = await fetchAllTransactions(1, 10, 0, 'timestamp', 'DESC', null);

    expect(result).toEqual({
      success: true,
      message: 'Transactions retrieved successfully',
      data: {
        totalItems: 0,
        totalPages: 0,
        currentPage: 1,
        transactions: []
      }
    });
  });
});
