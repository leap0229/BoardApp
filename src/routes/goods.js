const express = require('express');
const router = express.Router();
const controller = require('../controllers/goods');
const authenticator = require('../controllers/auth/authenticator');

router.post('/', authenticator.jwtAuthenticate, controller.createGood);

router.delete('/', authenticator.jwtAuthenticate, controller.deleteGood);

module.exports = router;
