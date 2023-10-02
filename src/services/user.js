const { object, string, mixed } = require('yup');
const { mapValidationErrors } = require('../utils/errorResponse');

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

module.exports = {
  validateUserProfile,
};
