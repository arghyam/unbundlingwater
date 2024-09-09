const express = require('express');
const router = express.Router();
const { User, UserTrainer, UserTopic } = require('../models');
const { Op } = require('sequelize');


User.hasMany(UserTopic, { foreignKey: 'userId', as: 'userTopics', sourceKey: 'userId' });
UserTopic.belongsTo(User, { foreignKey: 'userId', as: 'user', targetKey: 'userId'  });

User.hasMany(UserTrainer, { foreignKey: 'userId', as: 'userTrainers', sourceKey: 'userId' });
UserTrainer.belongsTo(User, { foreignKey: 'userId', as: 'user', targetKey: 'userId' });


router.get('/id/:id', async (req, res) => {
  try {
    const result = await User.findByPk(req.params.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
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
    const users = await User.findAll({
      attributes: ['name'],
      where: {
        name: {
          [Op.iLike]: name + '%'
        }
      }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/location/', async (req, res) => {
  try {
    const { name } = req.query;
    if (!name) {
      return res.status(400).json({ message: 'Name is required' });
    }

    // Find users by exact name (case-sensitive by default)
    const users = await User.findAll({
      attributes: ['district', "state", "id"],
      where: {
        district: {
          [Op.iLike]: name + '%'
        }
      }
    });

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json(users);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/byname/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findAll({
      where: { name: { [Op.eq]: name } },
      include: [
        {
          model: UserTopic,
          as: 'userTopics',
        }
        ,
        {
          model: UserTrainer,
          as: 'userTrainers',
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bytopic/:name', async (req, res) => {
  try {
    const { name } = req.params;

    const user = await User.findAll({
      include: [
        {
          model: UserTopic,
          as: 'userTopics',
          where: { name: { [Op.eq]: name } },
          required: true
        }
        ,
        {
          model: UserTrainer,
          as: 'userTrainers',
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/bylocation/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const [district, state] = name.split(',');
    const user = await User.findAll({
      where: { district: district.trim(), state: state.trim() },
      include: [
        {
          model: UserTopic,
          as: 'userTopics',
        }
        ,
        {
          model: UserTrainer,
          as: 'userTrainers',
        }
      ]
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error finding user by name:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;