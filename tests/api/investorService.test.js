describe('API: Investor Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // parseQueryParams returns default values when no query parameters provided
  it('should return default values when query object is empty', () => {
    const { parseQueryParams } = require('../../api/services/investorService');

    const result = parseQueryParams({});

    expect(result).toEqual({
      page: null,
      limit: null,
      offset: null,
      orderField: 'created_at',
      orderDirection: 'DESC'
    });
  });

  // parseQueryParams handles invalid page/limit values by returning null
  it('should return null for invalid page and limit values', () => {
    const { parseQueryParams } = require('../../api/services/investorService');

    const result = parseQueryParams({
      page: 'invalid',
      limit: 'abc'
    });

    expect(result).toEqual({
      page: null,
      limit: null,
      offset: null,
      orderField: 'created_at',
      orderDirection: 'DESC'
    });
  });

  // fetchInvestors returns paginated list of investors with correct total count
  it('should return paginated investors with correct total count when valid page and limit are provided', async () => {
    const { fetchInvestors } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    // Mock data
    const mockInvestors = [
      { id: 1, walletAddress: '0x123', balance: 100, createdAt: new Date('2023-01-01') },
      { id: 2, walletAddress: '0x456', balance: 200, createdAt: new Date('2023-01-02') },
      { id: 3, walletAddress: '0x789', balance: 300, createdAt: new Date('2023-01-03') }
    ];

    const mockTransactions = [
      { investorId: 1, timestamp: new Date('2023-01-10') },
      { investorId: 2, timestamp: new Date('2023-01-11') },
      { investorId: 3, timestamp: new Date('2023-01-12') }
    ];

    // Mock Investor.findAll
    Investor.findAll = jest.fn().mockResolvedValue(mockInvestors);

    // Mock Transaction.findOne
    Transaction.findOne = jest.fn((query) => {
      const investorId = query.where.investorId;
      return Promise.resolve(mockTransactions.find((t) => t.investorId === investorId));
    });

    const page = 1;
    const limit = 2;
    const offset = (page - 1) * limit;
    const orderField = 'created_at';
    const orderDirection = 'ASC';

    const result = await fetchInvestors(page, limit, offset, orderField, orderDirection);

    expect(result.success).toBe(true);
    expect(result.message).toBe('Investors retrieved successfully');
    expect(result.data.totalItems).toBe(3);
    expect(result.data.totalPages).toBe(2);
    expect(result.data.currentPage).toBe(1);
    expect(result.data.investors.length).toBe(2);
  });

  // fetchWallet successfully retrieves investor data by wallet address
  it('should return investor data when a valid wallet address is provided', async () => {
    const { fetchWallet } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: 1000,
      createdAt: new Date('2023-01-01')
    };

    const mockTransaction = {
      timestamp: new Date('2023-02-01')
    };

    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.findOne = jest.fn().mockResolvedValue(mockTransaction);

    const result = await fetchWallet('0x123');

    expect(Investor.findOne).toHaveBeenCalledWith({
      where: { walletAddress: '0x123' },
      attributes: ['walletAddress', 'balance', 'createdAt']
    });

    expect(Transaction.findOne).toHaveBeenCalledWith({
      where: { investorId: mockInvestor.id },
      order: [['timestamp', 'DESC']]
    });

    expect(result).toEqual({
      success: true,
      message: 'Investor retrieved successfully',
      data: {
        walletAddress: mockInvestor.walletAddress,
        balance: mockInvestor.balance,
        createdAt: mockInvestor.createdAt,
        lastTransactionTime: mockTransaction.timestamp
      }
    });
  });

  // fetchInvestors returns all investors when no pagination parameters provided
  it('should return all investors when no pagination parameters are provided', async () => {
    const { fetchInvestors } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    // Mocking Investor.findAll to return a list of investors
    Investor.findAll = jest.fn().mockResolvedValue([
      { id: 1, walletAddress: '0x123', balance: 100, createdAt: new Date('2023-01-01') },
      { id: 2, walletAddress: '0x456', balance: 200, createdAt: new Date('2023-02-01') }
    ]);

    // Mocking Transaction.findOne to return the last transaction for each investor
    Transaction.findOne = jest.fn().mockImplementation(({ where }) => {
      if (where.investorId === 1) {
        return Promise.resolve({ timestamp: new Date('2023-03-01') });
      } else if (where.investorId === 2) {
        return Promise.resolve({ timestamp: new Date('2023-04-01') });
      }
      return Promise.resolve(null);
    });

    const result = await fetchInvestors(null, null, null, 'created_at', 'DESC');

    expect(result).toEqual({
      success: true,
      message: 'All investors retrieved successfully',
      data: [
        {
          walletAddress: '0x456',
          balance: 200,
          createdAt: new Date('2023-02-01'),
          lastTransactionTime: new Date('2023-04-01')
        },
        {
          walletAddress: '0x123',
          balance: 100,
          createdAt: new Date('2023-01-01'),
          lastTransactionTime: new Date('2023-03-01')
        }
      ]
    });
  });

  // fetchInvestors handles empty investor list with appropriate error message
  it('should return error message when no investors are found', async () => {
    const { fetchInvestors } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    Investor.findAll = jest.fn().mockResolvedValue([]);
    Transaction.findOne = jest.fn();

    const result = await fetchInvestors(1, 10, 0, 'balance', 'ASC');

    expect(result).toEqual({
      success: false,
      message: 'No investors found',
      code: 404
    });
  });

  // fetchWallet returns error when wallet address not found
  it('should return error when wallet address is not found', async () => {
    const { fetchWallet } = require('../../api/services/investorService');
    const { Investor } = require('../../models');

    // Mock the Investor model's findOne method to return null
    jest.spyOn(Investor, 'findOne').mockResolvedValue(null);

    const result = await fetchWallet('nonexistent_wallet_address');

    expect(result).toEqual({
      success: false,
      message: 'Investor not found',
      code: 404
    });
  });

  // fetchInvestors sorts investors by balance in descending order by default
  it('should sort investors by balance in descending order when no order field is specified', async () => {
    const { fetchInvestors } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    // Mock data
    const investorsMock = [
      { id: 1, walletAddress: 'address1', balance: 100, createdAt: new Date() },
      { id: 2, walletAddress: 'address2', balance: 200, createdAt: new Date() },
      { id: 3, walletAddress: 'address3', balance: 50, createdAt: new Date() }
    ];

    const transactionsMock = [
      { investorId: 1, timestamp: new Date() },
      { investorId: 2, timestamp: new Date() },
      { investorId: 3, timestamp: new Date() }
    ];

    // Mock Investor.findAll
    Investor.findAll = jest.fn().mockResolvedValue(investorsMock);

    // Mock Transaction.findOne
    Transaction.findOne = jest.fn().mockImplementation(({ where }) => {
      return Promise.resolve(transactionsMock.find((t) => t.investorId === where.investorId));
    });

    const result = await fetchInvestors(null, null, null, 'balance', 'DESC');

    expect(result.data).toEqual([
      { walletAddress: 'address2', balance: 200, createdAt: expect.any(Date), lastTransactionTime: expect.any(Date) },
      { walletAddress: 'address1', balance: 100, createdAt: expect.any(Date), lastTransactionTime: expect.any(Date) },
      { walletAddress: 'address3', balance: 50, createdAt: expect.any(Date), lastTransactionTime: expect.any(Date) }
    ]);
  });

  // parseQueryParams validates allowed order fields
  it('should return correct orderField when query.orderBy is valid', () => {
    const { parseQueryParams } = require('../../api/services/investorService');

    const query = { orderBy: 'balance' };
    const result = parseQueryParams(query);

    expect(result.orderField).toBe('balance');
  });

  // fetchInvestors correctly calculates total pages for pagination
  it('should calculate total pages correctly when investors are paginated', async () => {
    const { fetchInvestors } = require('../../api/services/investorService');
    const { Investor, Transaction } = require('../../models');

    // Mock data
    const mockInvestors = Array(15)
      .fill()
      .map((_, index) => ({
        id: index + 1,
        walletAddress: `wallet${index + 1}`,
        balance: 1000 + index,
        createdAt: new Date()
      }));

    // Mock Investor model
    Investor.findAll = jest.fn().mockResolvedValue(mockInvestors);

    // Mock Transaction model
    Transaction.findOne = jest.fn().mockResolvedValue({ timestamp: new Date() });

    const page = 1;
    const limit = 5;
    const offset = (page - 1) * limit;
    const orderField = 'balance';
    const orderDirection = 'ASC';

    const result = await fetchInvestors(page, limit, offset, orderField, orderDirection);

    expect(result).toEqual({
      success: true,
      message: 'Investors retrieved successfully',
      data: {
        totalItems: 15,
        totalPages: 3,
        currentPage: 1,
        investors: expect.any(Array)
      }
    });
  });
});
