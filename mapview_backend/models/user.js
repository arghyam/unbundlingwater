const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const UserTopics = require('./userTopics');

const User = sequelize.define('user', {
  name: {
    type: DataTypes.STRING,
  },
  userId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: DataTypes.STRING,
  state: DataTypes.STRING,
  district: DataTypes.STRING,
  city: DataTypes.STRING,
  latitude: DataTypes.STRING,
  longitude: DataTypes.STRING,

  phonenumber: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('phonenumber');
      if (rawValue) {
        
        return rawValue.slice(0, 2) + '*'.repeat(rawValue.length - 2);
      }
      return null;
    },
  },
  emailid: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('emailid');
      if (rawValue) {
        
        const [localPart, domain] = rawValue.split('.');
        if (localPart && domain) {
          return `${localPart.slice(0, 2)}*****.${domain}`;
        }
      }
      return null;
    },
  },
  userrole: DataTypes.STRING,
});

User.hasMany(UserTopics, {
  foreignKey: 'userId',
  sourceKey: 'userId',
  as: 'topics' // Alias for associated topics
});

module.exports = User;
