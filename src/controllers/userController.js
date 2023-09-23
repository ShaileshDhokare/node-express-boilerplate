const StatusCodes = require('http-status-codes').StatusCodes;
// const { Op } = require('sequelize');
const { User } = require('../models/User');
const { hashPassword } = require('../utils/auth');

const getUsers = async (req, res) => {
  // let { page, size = 10, query } = req.query;
  try {
    const users = await User.findAndCountAll();
    return res.status(200).json({
      total_count: users.count,
      data: users.rows,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const addUser = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;
  const hashedPassword = await hashPassword(password);
  try {
    let user = await User.create({
      firstname,
      lastname,
      email,
      username,
      password: hashedPassword,
    });

    return res.status(200).json({
      message: 'User has been reqistered successfully.',
      data: user,
    });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addUser,
  getUsers,
};
