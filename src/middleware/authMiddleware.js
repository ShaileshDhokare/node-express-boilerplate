const jwt = require('jsonwebtoken');
const { StatusCodes } = require('http-status-codes');
const Logger = require('../config/logger');
const { ErrorResponse } = require('../utils/errorResponse');
const { mapLoggedInUser } = require('../utils/responseMapper');
const User = require('../models/User');
const { matchPassword } = require('../utils/auth');
const { findUser } = require('../services/auth');

const protect = async (req, res, next) => {
  let accessToken;

  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer')) {
    // Set token from Bearer token in header
    accessToken = authHeader.split(' ')[1];
    // Set token from cookie
  } else if (req.cookies.accessToken) {
    accessToken = req.cookies.accessToken;
  }

  try {
    if (accessToken) {
      // Verify token
      const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
      const user = await User.findByPk(decoded.userId);

      if (!user) {
        return next(new ErrorResponse('Not authorized to access this route.', StatusCodes.UNAUTHORIZED));
      }

      Logger.info('User has been authorized successfully.');
      req.user = mapLoggedInUser(user);
      next();
    } else {
      if (authHeader && authHeader.startsWith('Basic')) {
        // Split the Authorization header to get the credentials part
        const credentials = authHeader.split(' ')[1];

        // Decode the base64-encoded credentials
        const decodedCredentials = Buffer.from(credentials, 'base64').toString('utf-8');

        // Split the decoded credentials into username and password
        const [username, password] = decodedCredentials.split(':');
        const user = await findUser(username);

        if (user && (await matchPassword(password, user.password))) {
          Logger.info('User has been authorized successfully.');
          req.user = mapLoggedInUser(user);
          next();
        } else {
          return next(new ErrorResponse('Not authorized to access this route.', StatusCodes.UNAUTHORIZED));
        }
      } else {
        return next(new ErrorResponse('Not authorized to access this route.', StatusCodes.UNAUTHORIZED));
      }
    }
  } catch (error) {
    return next(new ErrorResponse(error.message, error.statusCode || StatusCodes.INTERNAL_SERVER_ERROR));
  }
};

module.exports = { protect };
