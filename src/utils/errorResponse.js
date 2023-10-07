const { StatusCodes } = require('http-status-codes');
const Logger = require('../config/logger');

class ErrorResponse extends Error {
  constructor(message, statusCode, errors = []) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;

    Error.captureStackTrace(this, this.constructor);
  }
}

const getErrorMessage = (error) => {
  if (error.parent && error.parent.sqlMessage) {
    return error.parent.sqlMessage;
  } else {
    return error.message || error;
  }
};

const getErrorData = (error) => {
  if (error.errors && Array.isArray(error.errors)) {
    return error.errors.map(({ message, type, path, value }) => ({
      ...(message && { message }),
      ...(type && { type }),
      ...(path && { path }),
      ...(value && { value }),
    }));
  }

  return;
};

const setErrorResponse = (res, error) => {
  const sequelizeErrorNames = ['SequelizeUniqueConstraintError', 'SequelizeValidationError'];

  if (sequelizeErrorNames.includes(error.name)) {
    error.statusCode = 400;
  }

  const errorResponse = {
    message: getErrorMessage(error),
    data: getErrorData(error),
  };

  Logger.error({ ...errorResponse });
  res.status(error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR).json(errorResponse);
};

const mapValidationErrors = (error) => {
  if (error.inner && Array.isArray(error.inner) && error.inner.length) {
    const invalidFields = [];
    const errors = error.inner.map(({ errors, path }) => {
      invalidFields.push(path);

      return {
        ...(errors.length && { message: errors.join(', ') }),
        ...(path && { path }),
      };
    });

    const message = `Values provided to input fields(${invalidFields.join(', ')}) are not valid.`;

    throw new ErrorResponse(message, StatusCodes.BAD_REQUEST, errors);
  }

  throw new ErrorResponse(error.message, StatusCodes.BAD_REQUEST);
};

module.exports = { ErrorResponse, setErrorResponse, mapValidationErrors, getErrorMessage, getErrorData };
