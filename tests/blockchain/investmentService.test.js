const { handleInvestment } = require('../../blockchain/services/investmentService');
const { Investor, Transaction, LastBlock } = require('../../models');
const { ethers } = require('ethers');

jest.mock('../../models');
jest.mock('ethers');

describe('handleInvestment', () => {
  let eventMock;

  beforeEach(() => {
    eventMock = {
      getBlock: jest.fn().mockResolvedValue({ number: 123 }),
      log: { transactionHash: '0x123' },
      transactionHash: '0x123'
    };

    Transaction.findOne = jest.fn();
    Transaction.create = jest.fn();
    Investor.findOrCreate = jest.fn();
    LastBlock.upsert = jest.fn();
  });

  it("should correctly handle a new investment by creating a new transaction and updating the investor's balance", async () => {
    Transaction.findOne.mockResolvedValue(null);
    Investor.findOrCreate.mockResolvedValue([{ id: 1, balance: '0', save: jest.fn() }, true]);
    ethers.formatUnits.mockImplementation((value, decimals) => (value / Math.pow(10, decimals)).toString());

    const result = await handleInvestment('0xInvestor', '1000000', '1000', '1', eventMock);

    expect(Transaction.create).toHaveBeenCalledTimes(1);
    expect(LastBlock.upsert).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      investor: '0xInvestor',
      sharesIssued: '0.001',
      usdAmount: '1'
    });
  });

  it('should return null and not create a new transaction if the transaction has already been recorded in the database', async () => {
    Transaction.findOne.mockResolvedValue({ id: 1 });

    const result = await handleInvestment('0xInvestor', '1000000', '1000', '1', eventMock);

    expect(result).toBeNull();
    expect(Transaction.create).not.toHaveBeenCalled();
  });

  it('should correctly format the usdAmount and sharesIssued using ethers.formatUnits before processing', async () => {
    Transaction.findOne.mockResolvedValue(null);
    Investor.findOrCreate.mockResolvedValue([{ id: 1, balance: '0', save: jest.fn() }, true]);
    ethers.formatUnits.mockImplementation((value, decimals) => (value / Math.pow(10, decimals)).toString());

    await handleInvestment('0xInvestor', '1000000', '1000', '1', eventMock);

    expect(Transaction.create).toHaveBeenCalledWith(
      expect.objectContaining({
        usdAmount: '1',
        shares: '0.001'
      })
    );
  });

  it('should update the investor balance if the investor already exists', async () => {
    const saveMock = jest.fn();
    Transaction.findOne.mockResolvedValue(null);
    Investor.findOrCreate.mockResolvedValue([{ id: 1, balance: '0.001', save: saveMock }, false]);
    ethers.formatUnits.mockImplementation((value, decimals) => (value / Math.pow(10, decimals)).toString());

    await handleInvestment('0xInvestor', '1000000', '1000', '1', eventMock);

    expect(Investor.findOrCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { walletAddress: '0xInvestor' },
        defaults: { balance: '0.001' }
      })
    );
    expect(saveMock).toHaveBeenCalled();
  });

  it('should handle errors gracefully', async () => {
    Transaction.findOne.mockRejectedValue(new Error('Database error'));

    await expect(handleInvestment('0xInvestor', '1000000', '1000', '1', eventMock)).rejects.toThrow('Database error');
  });
});
