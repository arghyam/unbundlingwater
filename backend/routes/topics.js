const express = require('express');
const router = express.Router();
const { Topic, TopicFile } = require('../models');
const { Op } = require('sequelize');

Topic.hasMany(TopicFile, { foreignKey: 'topicId', as: 'topicFiles' });
TopicFile.belongsTo(Topic, { foreignKey: 'topicId' });


router.get('/id/:id', async (req, res) => {
  try {
    const result = await Topic.findByPk(req.params.id);
    if (res) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }
    const result = await Topic.findAll({
      where: {
        name: name
      },
      include: [{
        model: TopicFile,
        as: 'topicFiles'
      }]
    });
    if (res) {
      res.json(result);
    } else {
      res.status(404).json({ message: 'Topic not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/search/', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Find users by exact name (case-sensitive by default)
    const topic = await Topic.findAll({
      attributes: ['name'],
      where: {
        name: {
          [Op.iLike]: name + '%'
        }
      }
    });

    if (topic.length === 0) {
      return res.status(404).json({ message: 'No topic found' });
    }

    res.status(200).json(topic);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;