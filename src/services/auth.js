const { object, string } = require('yup');
const { mapValidationErrors } = require('../utils/errorResponse');

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

module.exports = {
  validateUserLogin,
  validateUserRegister,
};
