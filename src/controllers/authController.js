const StatusCodes = require('http-status-codes').StatusCodes;
const Logger = require('../config/logger');
const { Op } = require('sequelize');
const User = require('../models/User');
const {
  hashPassword,
  generateJwtToken,
  matchPassword,
  setResponseCookies,
} = require('../utils/auth');
const { ErrorResponse, setErrorResponse } = require('../utils/errorResponse');
const { mapLoggedInUser } = require('../utils/responseMapper');

const loginUser = async (req, res) => {
  const { email, username, password } = req.body;
  let { httpCookie } = req.query;
  httpCookie = httpCookie && httpCookie.toLowerCase() === 'true';

  try {
    const user = await User.findOne({
      where: {
        [Op.or]: [email && { email }, username && { username }],
        status: 'active',
      },
      attributes: [
        'id',
        'firstname',
        'lastname',
        'username',
        'email',
        'password',
      ],
    });

    if (!user) {
      throw new ErrorResponse('Record not found', StatusCodes.UNAUTHORIZED);
    }

    if (await matchPassword(password, user.password)) {
      const userResponse = mapLoggedInUser(user);

      const token = generateJwtToken({
        userId: user.id,
        username: userResponse.name,
      });

      let metadata = undefined;
      if (httpCookie) {
        setResponseCookies(res, token);
      } else {
        metadata = { token };
      }
      Logger.info('User has been successfully logged in.');
      res.status(StatusCodes.OK).json({
        message: 'You have successfully logged in.',
        data: userResponse,
        metadata,
      });
    } else {
      throw new ErrorResponse(
        "Password didn't matched",
        StatusCodes.UNAUTHORIZED
      );
    }
  } catch (error) {
    setErrorResponse(res, error);
  }
};

const registerUser = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;
  let { httpCookie } = req.query;
  httpCookie = httpCookie && httpCookie.toLowerCase() === 'true';

  const hashedPassword = await hashPassword(password);
  try {
    let user = await User.create({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      status: 'active',
    });

    const userResponse = mapLoggedInUser(user);

    const token = generateJwtToken({
      userId: user.id,
      username: userResponse.name,
    });

    let metadata = undefined;
    if (httpCookie) {
      setResponseCookies(res, token);
    } else {
      metadata = { token };
    }
    Logger.info('User has been reqistered successfully.');
    res.status(StatusCodes.CREATED).json({
      message: 'User has been reqistered successfully.',
      data: userResponse,
      metadata,
    });
  } catch (error) {
    setErrorResponse(res, error);
  }
};

const logoutUser = (req, res) => {
  if (req.cookies.jwt) {
    res.clearCookie('jwt');
  }
  res.status(StatusCodes.OK).json({
    message: 'You have been successfully logged out.',
  });
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
