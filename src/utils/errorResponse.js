const StatusCodes = require('http-status-codes').StatusCodes;
const Logger = require('../config/logger');
const { getSequelizeErrorMessage, getSequelizeErrorData } = require('./mapSqlErrorResponse');

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

const setErrorResponse = (res, error) => {
  const errorResponse = {
    message: getSequelizeErrorMessage(error),
    data: getSequelizeErrorData(error),
  };

  Logger.error({ ...errorResponse });
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
};

module.exports = { ErrorResponse, setErrorResponse };
