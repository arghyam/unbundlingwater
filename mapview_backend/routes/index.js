const express = require('express');
const router = express.Router();

router.use('/api', require('./states'));   // for /api/states
router.use('/api', require('./districts')); // for /api/districts

module.exports = router;
