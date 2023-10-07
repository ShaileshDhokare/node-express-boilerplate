const { object, string } = require('yup');
const { Op } = require('sequelize');
const { mapValidationErrors } = require('../utils/errorResponse');
const User = require('../models/User');

const validateUserLogin = (inputData) => {
  const loginSchema = object({
    username: string().required().min(6),
    password: string().required().min(6),
  });

  try {
    loginSchema.validateSync(inputData, { abortEarly: false });
  } catch (error) {
    mapValidationErrors(error);
  }
};

const validateUserRegister = (inputData) => {
  const registerSchema = object({
    firstname: string().required().min(2),
    lastname: string().required().min(2),
    email: string().required().email(),
    username: string().required().min(6),
    password: string().required().min(6),
  });

  try {
    registerSchema.validateSync(inputData, { abortEarly: false });
  } catch (error) {
    mapValidationErrors(error);
  }
};

const createUser = (userPayload) => {
  return User.create(userPayload);
};

const findUser = (username) => {
  return User.findOne({
    where: {
      [Op.or]: [{ email: username }, { username }],
      status: 'active',
    },
    attributes: ['id', 'firstname', 'lastname', 'username', 'email', 'password'],
  });
};

module.exports = {
  validateUserLogin,
  validateUserRegister,
  createUser,
  findUser,
};
