const express = require('express');
const router = express.Router();
const { getLatestMetrics, getHistoricalMetrics } = require('../controllers/metricsController');

// Get the latest fund metrics
router.get('/', getLatestMetrics);

// Get historical fund metrics
router.get('/history', getHistoricalMetrics);

module.exports = router;
