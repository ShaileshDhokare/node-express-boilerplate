const Sequelize = require('sequelize');
const sequelizeDB = require('../config/dbConnection');
const Logger = require('../config/logger');
const UserProfile = require('./UserProfile');

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
    },
    status: {
      type: Sequelize.ENUM,
      values: ['active', 'inactive', 'suspended'],
      default: 'active',
      allowNull: false,
    },
  },
  {
    tableName: 'users',
    timestamps: true,
  }
);

User.hasOne(UserProfile, {
  as: 'profile',
  foreignKey: 'userId',
});

UserProfile.belongsTo(User, {
  as: 'profile',
  foreignKey: 'userId',
});

User.sync().then(() => {
  Logger.info('users table is created');
});

module.exports = User;
