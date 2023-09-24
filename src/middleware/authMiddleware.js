const jwt = require('jsonwebtoken');
const StatusCodes = require('http-status-codes').StatusCodes;
const Logger = require('../config/logger');
const { ErrorResponse } = require('../utils/errorResponse');
const { mapLoggedInUser } = require('../utils/responseMapper');
const User = require('../models/User');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Set token from Bearer token in header
    token = req.headers.authorization.split(' ')[1];
    // Set token from cookie
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  // Make sure token exists
  if (!token) {
    return next(
      new ErrorResponse(
        'Not authorized to access this route.',
        StatusCodes.UNAUTHORIZED
      )
    );
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.userId);
    if (!user) {
      return next(
        new ErrorResponse(
          'Not authorized to access this route.',
          StatusCodes.UNAUTHORIZED
        )
      );
    }
    Logger.info('User has been authorized successfully.');
    req.user = mapLoggedInUser(user);
    next();
  } catch (err) {
    return next(
      new ErrorResponse(err.message, StatusCodes.INTERNAL_SERVER_ERROR)
    );
  }
};

module.exports = { protect };
