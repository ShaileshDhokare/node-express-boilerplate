const Sequelize = require('sequelize');
const sequelizeDB = require('../config/dbConnection');

const User = sequelizeDB.define(
  'user',
  {
    firstname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastname: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'inactive', 'suspended'],
      default: 'active',
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

User.sync().then(() => {
  console.log('users table is created');
});

module.exports = {
  User,
};
