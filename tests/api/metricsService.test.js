const {
  parseQueryParams,
  getTimeRangeFilter,
  fetchLatestMetrics,
  fetchHistoricalMetrics
} = require('../../api/services/metricsService');
const redisClient = require('../../utils/redisClient');
const { FundMetric } = require('../../models');
const { Op } = require('sequelize');

jest.mock('../../utils/redisClient');
jest.mock('../../models');

describe('API: Metrics Service', () => {
  describe('parseQueryParams', () => {
    it('should parse pagination parameters correctly', () => {
      const query = { page: '2', limit: '10' };
      const result = parseQueryParams(query);
      expect(result).toEqual({ page: 2, limit: 10, offset: 10, timeRange: 'all' });
    });

    it('should return null for page and limit if not provided', () => {
      const query = {};
      const result = parseQueryParams(query);
      expect(result).toEqual({ page: null, limit: null, offset: null, timeRange: 'all' });
    });
  });

  describe('getTimeRangeFilter', () => {
    it('should return correct filter for "1d" time range', () => {
      const result = getTimeRangeFilter('1d');
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - 1);
      expect(result.lastUpdateTime[Op.gte].getTime() / 1000).toBeCloseTo(expectedDate.getTime() / 1000);
    });

    it('should return empty filter for invalid time range', () => {
      const result = getTimeRangeFilter('invalid');
      expect(result).toEqual({});
    });
  });

  describe('fetchLatestMetrics', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return cached data if available', async () => {
      redisClient.get.mockResolvedValue(JSON.stringify([{ id: 1, value: 'cachedData' }]));
      const result = await fetchLatestMetrics();
      expect(result).toEqual({
        success: true,
        message: 'Fund metrics retrieved from cache',
        data: [{ id: 1, value: 'cachedData' }]
      });
    });

    it('should fetch from database if cache is empty', async () => {
      redisClient.get.mockResolvedValue(null);
      FundMetric.findOne.mockResolvedValue({ id: 1, value: 'dbData' });

      const result = await fetchLatestMetrics();
      expect(result).toEqual({
        success: true,
        message: 'Latest fund metrics retrieved successfully',
        data: { id: 1, value: 'dbData' }
      });
    });

    it('should return 404 if no metrics are found', async () => {
      redisClient.get.mockResolvedValue(null);
      FundMetric.findOne.mockResolvedValue(null);

      const result = await fetchLatestMetrics();
      expect(result).toEqual({
        success: false,
        message: 'No fund metrics available',
        code: 404
      });
    });
  });

  describe('fetchHistoricalMetrics', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return paginated historical metrics', async () => {
      const page = 1;
      const limit = 10;
      const offset = 0;
      const timeRange = '1d';
      const mockMetrics = {
        count: 20,
        rows: [
          { id: 1, value: 'metric1' },
          { id: 2, value: 'metric2' }
        ]
      };

      FundMetric.findAndCountAll.mockResolvedValue(mockMetrics);

      const result = await fetchHistoricalMetrics(page, limit, offset, timeRange);
      expect(result).toEqual({
        success: true,
        message: 'Historical fund metrics retrieved successfully',
        data: {
          totalItems: 20,
          totalPages: 2,
          currentPage: 1,
          metrics: mockMetrics.rows
        }
      });
    });

    it('should return all metrics if no pagination is provided', async () => {
      const timeRange = '1d';
      const mockMetrics = [
        { id: 1, value: 'metric1' },
        { id: 2, value: 'metric2' }
      ];

      FundMetric.findAll.mockResolvedValue(mockMetrics);

      const result = await fetchHistoricalMetrics(null, null, null, timeRange);
      expect(result).toEqual({
        success: true,
        message: 'All historical fund metrics retrieved successfully',
        data: mockMetrics
      });
    });

    it('should return 404 if no historical metrics are found', async () => {
      const timeRange = '1d';

      FundMetric.findAll.mockResolvedValue([]);

      const result = await fetchHistoricalMetrics(null, null, null, timeRange);
      expect(result).toEqual({
        success: false,
        message: 'No fund metrics available for the selected range',
        code: 404
      });
    });
  });
});
