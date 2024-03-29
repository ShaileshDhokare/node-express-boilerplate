const { StatusCodes } = require('http-status-codes');
const Logger = require('../config/logger');
const { hashPassword, generateJwtToken, matchPassword, setResponseCookies } = require('../utils/auth');
const { ErrorResponse, setErrorResponse } = require('../utils/errorResponse');
const { mapLoggedInUser } = require('../utils/responseMapper');
const { validateUserLogin, validateUserRegister, createUser, findUser } = require('../services/auth');

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  let { httpCookie } = req.query;
  httpCookie = httpCookie && httpCookie.toLowerCase() === 'true';

  try {
    validateUserLogin({ username, password });

    const user = await findUser(username);

    if (!user) {
      throw new ErrorResponse('Record not found', StatusCodes.UNAUTHORIZED);
    }

    if (await matchPassword(password, user.password)) {
      const userResponse = mapLoggedInUser(user);

      const accessToken = generateJwtToken({
        userId: user.id,
        username: userResponse.name,
      });

      let metadata = undefined;
      if (httpCookie) {
        setResponseCookies(res, accessToken);
      } else {
        metadata = { accessToken };
      }

      Logger.info('User has been successfully logged in.');
      res.status(StatusCodes.OK).json({
        message: 'User has been successfully logged in.',
        data: userResponse,
        metadata,
      });
    } else {
      throw new ErrorResponse("Password didn't matched", StatusCodes.UNAUTHORIZED);
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
    validateUserRegister({ firstname, lastname, email, username, password });

    const userPayload = {
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
      status: 'active',
    };

    const user = await createUser(userPayload);

    const userResponse = mapLoggedInUser(user);

    const accessToken = generateJwtToken({
      userId: user.id,
      username: userResponse.name,
    });

    let metadata = undefined;
    if (httpCookie) {
      setResponseCookies(res, accessToken);
    } else {
      metadata = { accessToken };
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
  if (req.cookies.accessToken) {
    res.clearCookie('accessToken');
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
