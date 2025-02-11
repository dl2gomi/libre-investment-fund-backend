const express = require('express');
const router = express.Router();
const { getBasicReport } = require('../controllers/reportingController');

// Get all investors with pagination, ordering, and last transaction time
router.get('/', getBasicReport);

module.exports = router;
