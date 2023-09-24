const Sequelize = require('sequelize');
const sequelizeDB = require('../config/dbConnection');
const Logger = require('../config/logger');
const { User } = require('./User');

const UserProfile = sequelizeDB.define(
  'userProfile',
  {
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    designation: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    profileSummary: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    avatar: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.ENUM,
      values: ['Male', 'Female', 'Other'],
      allowNull: false,
    },
    birthdate: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    tableName: 'userProfiles',
    timestamps: true,
  }
);

// UserProfile.belongsTo(User, {
//   as: 'profile',
//   foreignKey: 'userId',
// });

UserProfile.sync().then(() => {
  Logger.info('userProfiles table is created');
});

module.exports = UserProfile;
