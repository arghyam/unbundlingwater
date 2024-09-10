const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./user');

const Location = sequelize.define('Location', {
  state: {
    type: DataTypes.STRING,
  },
  district: {
    type: DataTypes.STRING,
  }
}, {
  tableName: 'Locations',
  timestamps: false,
});

// Define associations based on district and state
Location.hasMany(User, { foreignKey: 'district', sourceKey: 'district' });
User.belongsTo(Location, { foreignKey: 'district', targetKey: 'district' });

module.exports = Location;
