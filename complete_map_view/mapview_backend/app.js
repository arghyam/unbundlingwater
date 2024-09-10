const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize } = require("sequelize");
require("dotenv").config();
const userRouter = require('./routes/userRoutes');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());
// Sequelize setup
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'postgres',
  port: 5432, // PostgreSQL default port
  logging: false, // Disable logging queries to console
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Adjust for production
    }
  }
});

// Test the connection
sequelize.authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
    return sequelize.sync(); // Sync models with DB
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });
// Import routes
const statesRoutes = require('./routes/states');
const districtsRoutes = require('./routes/districts');
const usersRoutes = require('./routes/userRoutes');

// Use routes
app.use('/api/states', statesRoutes);
app.use('/api/districts', districtsRoutes);
app.use('/api/users', usersRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
