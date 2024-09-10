const express = require("express");
const router = express.Router();
const { Sequelize } = require("sequelize");
const User = require("../models/user");

router.get("/:state", async (req, res) => {
  const { state } = req.params;
  try {
    const result = await User.findAll({
      where: { state },
      attributes: ['district', [Sequelize.fn('COUNT', Sequelize.fn('DISTINCT', Sequelize.col('id'))), 'user_count']],
      group: ['district'],
      order: [[Sequelize.literal('user_count'), 'DESC']],
    });
    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
