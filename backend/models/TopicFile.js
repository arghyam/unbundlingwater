const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const TopicFile = sequelize.define('TopicFile', {
  fileName: {
    type: DataTypes.TEXT,
    // allowNull: false
  },
  contentUrl: {
    type: DataTypes.TEXT,
    // allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  size: DataTypes.FLOAT,
  topicId: {
    type: DataTypes.INTEGER,
    // primaryKey: true,
    // autoIncrement: true
  },
  type: DataTypes.STRING,
  contentId: DataTypes.INTEGER,
  langCode: DataTypes.STRING

});

module.exports = TopicFile;