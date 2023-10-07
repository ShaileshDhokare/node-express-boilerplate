const { object, string, mixed } = require('yup');
const { mapValidationErrors } = require('../utils/errorResponse');
const UserProfile = require('../models/UserProfile');
const User = require('../models/User');

const validateUserProfile = (inputData) => {
  const profileSchema = object({
    designation: string().required().min(6),
    profileSummary: string().required().min(20),
    country: string().required().min(2),
    gender: mixed().oneOf(['Male', 'Female', 'Other']),
    birthdate: string().required().min(10, 'Please provide birthdate in YYYY-MM-DD format'),
  });

  try {
    profileSchema.validateSync(inputData, { abortEarly: false });
  } catch (error) {
    mapValidationErrors(error);
  }
};

const createUserProfile = (profileBody) => {
  return UserProfile.create(profileBody);
};

const updateUserProfile = (userId, profileBody) => {
  return UserProfile.update(profileBody, {
    where: {
      userId,
    },
  });
};

const getUserProfileById = (userId) => {
  return User.findByPk(userId, {
    include: [
      {
        model: UserProfile,
        attributes: ['designation', 'profileSummary', 'avatar', 'country', 'gender', 'birthdate'],
        as: 'profile',
      },
    ],
    attributes: ['id', 'firstname', 'lastname', 'username', 'email'],
  });
};

const checkProfileExists = (userId) => {
  return UserProfile.findOne({
    where: {
      userId,
    },
  });
};

module.exports = {
  validateUserProfile,
  createUserProfile,
  updateUserProfile,
  getUserProfileById,
  checkProfileExists,
};
