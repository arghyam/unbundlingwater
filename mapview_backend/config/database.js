const { Sequelize } = require("sequelize");

// Load environment variables
require("dotenv").config();
// Initialize Sequelize
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432, // Default PostgreSQL port
  logging: false, // Disable logging for a clean console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false, // For local testing, set to false
    }
  }
});

module.exports = sequelize; // Export the sequelize instance
