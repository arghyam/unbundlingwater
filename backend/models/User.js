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
  phoneNumber: {
    type: DataTypes.STRING,
    get() {
      const rawValue = this.getDataValue('phoneNumber');
      return maskPhoneNumber(rawValue);
    }
  },
  emailId: {
    type: DataTypes.STRING,
    // allowNull: false,
    // unique: true
    get() {
      const rawValue = this.getDataValue('emailId');
      return maskEmail(rawValue);
    }
  },
  userRole: DataTypes.STRING
});

// Utility function to mask phone number
function maskPhoneNumber(phoneNumber) {
  if (!phoneNumber) return null;
  return phoneNumber.replace(/\d(?=\d{4})/g, "*");
}

// Utility function to mask email
function maskEmail(email) {
  if (!email) return null;
  const [name, domain] = email.split('@');
  return `${name.charAt(0)}${'*'.repeat(name.length - 2)}${name.charAt(name.length - 1)}@${domain}`;
}

module.exports = User;