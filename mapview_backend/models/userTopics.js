const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserTopics = sequelize.define('UserTopic', {
    name: {
      type: DataTypes.STRING,
      // allowNull: false
    },
    issuedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true
    },
  });

module.exports = UserTopics;
