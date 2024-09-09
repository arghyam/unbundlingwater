const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Topic = sequelize.define('Topic', {
  name: {
    type: DataTypes.STRING,
    // allowNull: false
  },
  description: DataTypes.TEXT
});

module.exports = Topic;