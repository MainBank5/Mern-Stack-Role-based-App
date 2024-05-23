const express = require('express');
const router = express.Router();
const logoutController = require('../controllers/logoutController');

router.post('/', logoutController.handleLogOut);

module.exports = router;