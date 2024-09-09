const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const UserTrainer = sequelize.define('UserTrainer', {
  name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  issueDate: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  userId: DataTypes.STRING
});

module.exports = UserTrainer;