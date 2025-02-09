const { createLogger, format, transports } = require('winston');
const path = require('path');
require('dotenv').config();

// Define custom log format
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `${timestamp} [${level.toUpperCase()}]: ${message}`;
});

// Define logger options based on environment
const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), logFormat),
  transports: [
    // Conditionally log to console in development
    ...(process.env.NODE_ENV === 'development'
      ? [
          new transports.Console({
            format: format.combine(
              format.colorize(), // Colorize logs for easier reading in console
              format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
              logFormat
            )
          })
        ]
      : []),

    // Always log errors to a file in both environments
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),

    // Log everything to a file in production
    ...(process.env.NODE_ENV === 'production'
      ? [
          new transports.File({
            filename: path.join(__dirname, '../logs/combined.log')
          })
        ]
      : [])
  ],
  exceptionHandlers: [new transports.File({ filename: path.join(__dirname, '../logs/exceptions.log') })]
});

module.exports = logger;
