const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const { fileUpload } = require('../utils/fileUpload');

router.post(
  '/update',
  fileUpload.single('avatar'),
  userController.updateUserProfile
);
router.get('/', userController.getUserProfile);

module.exports = router;
