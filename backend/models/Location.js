const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Location = sequelize.define('Location', {
  name: DataTypes.STRING,
  district: DataTypes.STRING,
  state: DataTypes.STRING
});

module.exports = Location;