const express = require('express');
const router = express.Router();
const controller = require('../controllers/goods');
const authenticator = require('../controllers/auth/authenticator');

router.get('/:postId', authenticator.jwtAuthenticate, controller.getGoodsCount);

router.post('/', authenticator.jwtAuthenticate, controller.createGood);

router.delete('/', authenticator.jwtAuthenticate, controller.deleteGood);

module.exports = router;
