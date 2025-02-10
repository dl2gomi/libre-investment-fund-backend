require('dotenv').config();
const { createLogger, format, transports } = require('winston');
const path = require('path');

// Custom log format that includes timestamp
const customLogFormat = format.printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
  if (Object.keys(metadata).length) {
    msg += ` | ${JSON.stringify(metadata)}`;
  }
  return msg;
});

const logger = createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: format.combine(format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), customLogFormat),
  transports: [
    ...(process.env.NODE_ENV === 'development' ? [new transports.Console()] : []),
    new transports.File({
      filename: path.join(__dirname, '../logs/error.log'),
      level: 'error'
    }),
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
