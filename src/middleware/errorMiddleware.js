const StatusCodes = require('http-status-codes').StatusCodes;
const { ErrorResponse } = require('../utils/errorResponse');
const Logger = require('../config/logger');

const notFound = (req, res, next) => {
  const error = new ErrorResponse(
    `URL Not Found - ${req.originalUrl}`,
    StatusCodes.NOT_FOUND
  );
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode && StatusCodes.INTERNAL_SERVER_ERROR;
  let message = err.message;

  Logger.error(message);
  res.status(statusCode).json({
    message: message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

module.exports = {
  notFound,
  errorHandler,
};
