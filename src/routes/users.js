const express = require('express');
const router = express.Router();
const controller = require('../controllers/users');
const authenticator = require('../controllers/auth/authenticator');

router.get('/signin', authenticator.jwtAuthenticate, controller.viewSigninUserPage);

router.get('/signup', authenticator.jwtAuthenticate, controller.viewSignupUserPage);

router.get('/signout', controller.signoutUser);

// ログイン処理
router.post('/signin', controller.validateSigninUser, authenticator.loginAuthenticate, controller.signinUser);

//ユーザ登録処理
router.post('/signup', controller.validateSignupUser, controller.signupUser);

module.exports = router;
