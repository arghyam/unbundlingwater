const express = require("express");
const router = express.Router();
const User = require("../models/user");
const UserTopics = require('../models/userTopics');

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: UserTopics,
        as: 'trainings', // Alias must match association
        attributes: ['id', 'name', 'issuedAt'], // Include necessary training details
      }]
    });
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
});

router.get("/:state/:district", async (req, res) => {
  const { state, district } = req.params;
  try {
    const users = await User.findAll({
      where: {
        state,
        district,
      },
      attributes: ['id', 'name', 'city', 'district', 'state', 'phonenumber', 'emailid', 'userrole','latitude', 'longitude']
    });
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
