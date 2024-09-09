const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const User = sequelize.define('User', {
  name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
    // unique: true
  },
  country: DataTypes.STRING,
  state: DataTypes.STRING,
  district: DataTypes.STRING,
  city: DataTypes.STRING,
  phoneNumber: DataTypes.STRING,
  emailId: {
    type: DataTypes.STRING,
    // allowNull: false,
    // unique: true
  },
  userRole: DataTypes.STRING
});

module.exports = User;