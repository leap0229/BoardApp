const express = require('express');
const router = express.Router();
const controller = require('../controllers/posts');
const authenticator = require('../controllers/auth/authenticator');

router.get('/', authenticator.jwtAuthenticate, controller.viewPostsPage);

router.get('/new', authenticator.jwtAuthenticate, controller.viewNewPostPage);

router.get('/:id/edit', authenticator.jwtAuthenticate, controller.viewEditPostPage);

router.get('/:id/delete', authenticator.jwtAuthenticate, controller.deletePost);

router.post('/new', authenticator.jwtAuthenticate, controller.validateCreatePost, controller.createPost);

router.post('/:id/edit', authenticator.jwtAuthenticate, controller.validateEditPost, controller.updatePost);

module.exports = router;
