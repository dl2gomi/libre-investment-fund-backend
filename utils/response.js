/**
 * Success Response Formatter
 * @param {Object} res - Express response object
 * @param {String} message - Success message
 * @param {Object} data - Data to be returned
 * @param {Number} statusCode - HTTP status code (default is 200)
 */
exports.successResponse = (res, message, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

/**
 * Error Response Formatter
 * @param {Object} res - Express response object
 * @param {String} message - Error message
 * @param {Number} statusCode - HTTP status code (default is 500)
 * @param {Object} error - Additional error details (optional)
 */
exports.errorResponse = (res, message, statusCode = 500, error = {}) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(Object.keys(error).length && { error }) // Include error details if provided
  });
};
