const express = require('express');
const router = express.Router();
const { Location } = require('../models');
const { Op } = require('sequelize');

router.get('/search/', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    // Find users by exact name (case-sensitive by default)
    const location = await Location.findAll({
      attributes: ['name'],
      where: {
        name: {
          [Op.iLike]: name + '%'
        }
      }
    });

    if (location.length === 0) {
      return res.status(404).json({ message: 'No topic found' });
    }
    res.status(200).json(location);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;