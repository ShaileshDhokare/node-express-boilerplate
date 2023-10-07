const multer = require('multer');
const path = require('path');
const { ErrorResponse } = require('./errorResponse');
const { StatusCodes } = require('http-status-codes');

// Define storage configuration for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/public/uploads/avatars/'); // Set the destination folder where files will be saved
  },
  filename: (req, file, cb) => {
    const userId = req.user.userId; // Replace this with your actual user ID retrieval logic
    const newFileName = `user_${userId}_avatar.jpg`;
    req.body.avatarFileName = newFileName;
    cb(null, newFileName);
  },
});

// Define file filter to allow only jpg, jpeg, and png files
const fileFilter = (req, file, cb) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png'];
  const fileExt = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(fileExt)) {
    cb(null, true);
  } else {
    cb(new ErrorResponse('Only jpg, jpeg, and png files are allowed.', StatusCodes.BAD_REQUEST));
  }
};

// Define multer middleware with storage and file filter
const fileUpload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 500000 }, // Maximum file size in bytes (500KB)
});

module.exports = {
  fileUpload,
};
