const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');
const authenticator = require('../controllers/auth/authenticator');

//　(仮）認証がされていない場合のテスト用
router.get('/', authenticator.jwtAuthenticate, controller.viewPostPage);

module.exports = router;
