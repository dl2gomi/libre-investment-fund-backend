const { handleRedemption } = require('../../blockchain/services/redemptionService');
const { Investor, Transaction, LastBlock } = require('../../models');
const { ethers } = require('ethers');

describe('code snippet', () => {
  // Successfully process redemption for existing investor with valid transaction
  it('should process redemption and update investor balance when valid transaction', async () => {
    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: '100.0',
      save: jest.fn()
    };

    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest.fn().mockResolvedValue(null);
    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    const result = await handleRedemption(mockInvestor.walletAddress, mockShares, mockUsdAmount, '10.0', mockEvent);

    expect(mockInvestor.save).toHaveBeenCalled();
    expect(Transaction.create).toHaveBeenCalledWith({
      investorId: 1,
      txId: '0xabc',
      transactionType: 'redemption',
      usdAmount: '105.5',
      shares: '10.5'
    });
    expect(result).toEqual({
      investor: '0x123',
      redeemedShares: '10.5',
      usdAmount: '105.5'
    });
  });

  // Handle duplicate transaction attempts by returning null
  it('should return null when transaction already exists', async () => {
    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    Transaction.findOne = jest.fn().mockResolvedValue({
      id: 1,
      txId: '0xabc'
    });

    const result = await handleRedemption(
      '0x123',
      ethers.parseUnits('10', 6),
      ethers.parseUnits('100', 6),
      '10.0',
      mockEvent
    );

    expect(result).toBeNull();
    expect(Transaction.findOne).toHaveBeenCalledWith({
      where: { txId: '0xabc' }
    });
  });

  // Update LastBlock with new block number
  it('should update LastBlock with new block number when redemption is processed', async () => {
    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: '100.0',
      save: jest.fn()
    };

    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest.fn().mockResolvedValue(null);
    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    await handleRedemption(mockInvestor.walletAddress, mockShares, mockUsdAmount, '10.0', mockEvent);

    expect(LastBlock.upsert).toHaveBeenCalledWith({
      eventName: 'Redemption',
      blockNumber: 123
    });
  });

  // Update investor balance correctly after redemption
  it('should update investor balance and record transaction when redemption is processed', async () => {
    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: '100.0',
      save: jest.fn()
    };

    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      log: { transactionHash: '0xabc' }
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest.fn().mockResolvedValue(null);
    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    const result = await handleRedemption(mockInvestor.walletAddress, mockShares, mockUsdAmount, '10.0', mockEvent);

    expect(mockInvestor.save).toHaveBeenCalled();
    expect(Transaction.create).toHaveBeenCalledWith({
      investorId: 1,
      txId: '0xabc',
      transactionType: 'redemption',
      usdAmount: '105.5',
      shares: '10.5'
    });
    expect(LastBlock.upsert).toHaveBeenCalledWith({
      eventName: 'Redemption',
      blockNumber: 123
    });
    expect(result).toEqual({
      investor: '0x123',
      redeemedShares: '10.5',
      usdAmount: '105.5'
    });
  });

  // Handle non-existent investor by returning null
  it('should return null when investor does not exist', async () => {
    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest.fn().mockResolvedValue(null);
    Investor.findOne = jest.fn().mockResolvedValue(null);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    const result = await handleRedemption('0xnonexistent', mockShares, mockUsdAmount, '10.0', mockEvent);

    expect(result).toBeNull();
    expect(Transaction.create).not.toHaveBeenCalled();
    expect(LastBlock.upsert).not.toHaveBeenCalled();
  });

  // Create new transaction record with correct details
  it('should create a new transaction record with correct details when redemption is processed', async () => {
    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: '100.0',
      save: jest.fn()
    };

    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest.fn().mockResolvedValue(null);
    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    const result = await handleRedemption(mockInvestor.walletAddress, mockShares, mockUsdAmount, '10.0', mockEvent);

    expect(Transaction.create).toHaveBeenCalledWith({
      investorId: 1,
      txId: '0xabc',
      transactionType: 'redemption',
      usdAmount: '105.5',
      shares: '10.5'
    });
    expect(result).toEqual({
      investor: '0x123',
      redeemedShares: '10.5',
      usdAmount: '105.5'
    });
  });

  // Process multiple redemptions in same block
  it('should handle multiple redemptions in the same block without duplicating transactions', async () => {
    const mockInvestor = {
      id: 1,
      walletAddress: '0x123',
      balance: '100.0',
      save: jest.fn()
    };

    const mockEvent = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      transactionHash: '0xabc'
    };

    const mockShares = ethers.parseUnits('10.5', 6);
    const mockUsdAmount = ethers.parseUnits('105.5', 6);

    Transaction.findOne = jest
      .fn()
      .mockResolvedValueOnce(null) // First call returns null, simulating no existing transaction
      .mockResolvedValueOnce({ txId: '0xabc' }); // Second call simulates an existing transaction

    Investor.findOne = jest.fn().mockResolvedValue(mockInvestor);
    Transaction.create = jest.fn();
    LastBlock.upsert = jest.fn();

    // First redemption should process normally
    const firstResult = await handleRedemption(
      mockInvestor.walletAddress,
      mockShares,
      mockUsdAmount,
      '10.0',
      mockEvent
    );

    // Second redemption should return null due to duplicate transaction
    const secondResult = await handleRedemption(
      mockInvestor.walletAddress,
      mockShares,
      mockUsdAmount,
      '10.0',
      mockEvent
    );

    expect(mockInvestor.save).toHaveBeenCalledTimes(1);
    expect(Transaction.create).toHaveBeenCalledTimes(1);
    expect(firstResult).toEqual({
      investor: '0x123',
      redeemedShares: '10.5',
      usdAmount: '105.5'
    });
    expect(secondResult).toBeNull();
  });
});
