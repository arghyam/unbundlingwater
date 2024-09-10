const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const Location = require("../models/location");
const User = require("../models/user");

router.get("/", async (req, res) => {
  try {
    const result = await User.findAll({
      attributes: ['state', [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('id'))), 'user_count']],
      group: ['state'],
      order: [[Sequelize.literal('user_count'), 'DESC']],
    });
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
