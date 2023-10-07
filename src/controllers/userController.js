const { StatusCodes } = require('http-status-codes');
const Logger = require('../config/logger');
const { ErrorResponse, setErrorResponse } = require('../utils/errorResponse');

const {
  validateUserProfile,
  updateUserProfile: updateProfileService,
  createUserProfile,
  getUserProfileById,
  checkProfileExists,
} = require('../services/user');

const updateUserProfile = async (req, res) => {
  const { designation, profileSummary, avatarFileName, country, gender, birthdate } = req.body;
  const userId = req.user.userId;

  try {
    validateUserProfile({ designation, profileSummary, country, gender, birthdate });

    let userProfile = await checkProfileExists(userId);

    const profileBody = {
      userId,
      designation,
      profileSummary,
      avatar: avatarFileName,
      country,
      gender,
      birthdate,
    };

    if (userProfile) {
      userProfile = await updateProfileService(userId, profileBody);
    } else {
      userProfile = await createUserProfile(profileBody);
    }

    if (userProfile) {
      userProfile = await getUserProfileById(userId);

      userProfile.profile.avatar = '/static/uploads/avatars/' + userProfile.profile.avatar;

      Logger.info('Profile has been updated successfully.');

      res.status(StatusCodes.OK).json({
        message: 'Profile has been updated successfully.',
        data: userProfile,
      });
    } else {
      throw new ErrorResponse('Failed to update user profile', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  } catch (error) {
    setErrorResponse(res, error);
  }
};

const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const userProfile = await getUserProfileById(userId);

    if (!userProfile) {
      throw new ErrorResponse('Record not found', StatusCodes.UNAUTHORIZED);
    }

    userProfile.avatar = '/static/uploads/avatars/' + userProfile.avatar;

    Logger.info('[getUserProfile] - success');

    res.status(StatusCodes.OK).json({
      data: userProfile,
    });
  } catch (error) {
    setErrorResponse(res, error);
  }
};

module.exports = {
  updateUserProfile,
  getUserProfile,
};
