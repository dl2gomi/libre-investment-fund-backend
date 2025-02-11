const { handleMetricsUpdated } = require('../../blockchain/services/metricsService');
const { FundMetric, LastBlock } = require('../../models');
const redisClient = require('../../utils/redisClient');
const { ethers } = require('ethers');

jest.mock('../../models');
jest.mock('../../utils/redisClient');
jest.mock('ethers');

describe('handleMetricsUpdated', () => {
  let eventMock;

  beforeEach(() => {
    eventMock = {
      getBlock: jest.fn().mockResolvedValue({
        timestamp: 1633072800,
        number: 123456
      })
    };
    FundMetric.create = jest.fn().mockResolvedValue();
    LastBlock.upsert = jest.fn().mockResolvedValue();
    redisClient.del = jest.fn().mockResolvedValue();
    ethers.formatUnits = jest.fn((value, decimals) => (value / Math.pow(10, decimals)).toString());
  });

  it('should delete the Redis cache for latestFundMetrics', async () => {
    const totalAssetValue = '1000000';
    const sharesSupply = '500000';
    const sharePrice = '2000';

    await handleMetricsUpdated(totalAssetValue, sharesSupply, sharePrice, eventMock);

    expect(redisClient.del).toHaveBeenCalledWith('latestFundMetrics');
  });

  it('should handle errors when getBlock fails', async () => {
    eventMock.getBlock.mockRejectedValue(new Error('Failed to get block'));

    await expect(handleMetricsUpdated('1000000', '500000', '2000', eventMock)).rejects.toThrow('Failed to get block');
  });
});
