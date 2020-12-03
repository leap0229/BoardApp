const Posts = require('../models/posts');
const Users = require('../models/users');
const postCreateValidator = require('./validator/posts/postCreateValidator');
const postEditValidator = require('./validator/posts/postEditValidator');

const getAllPostsWithUserInfo = async (userId) => {
    const posts = await Posts.getPosts()
        .catch((err) => {
            throw err;
        });

    if (!posts) {
        return;
    }

    // dbから更新時間の昇順で取得している。
    // それを維持したままusernameを取得するための実装
    await Promise.all(posts.map(async (post) => {
        const userIdOfPost = post.userId;
        const user = await Users.getUser(userIdOfPost)
            .catch((err) => {
                return;
            });

        if (!user) {
            return;
        }

        post.username = user.username;
        post.isOwn = (userIdOfPost === userId);
        return;
    }));

    return posts;
};

module.exports = {
    validateCreatePost: postCreateValidator.validate,

    validateEditPost: postEditValidator.validate,

    viewNewPostPage: async (req, res) => {
        if (!req.user) {
            return res.redirect(303, '../users/signin');
        }

        res.render('newPost', { username: req.user.username });
    },

    viewEditPostPage: async (req, res) => {
        if (!req.user) {
            return res.redirect(303, '../../users/signin');
        }

        const id = req.params.id;
        const post = await Posts.getPost(id)
            .catch((err) => {
                return res.redirect(303, req.baseUrl);
            });

        if (!post) {
            return res.redirect(303, req.baseUrl);
        }

        res.render('editPost', {
            title: post.title, 
            content: post.content,
            username: req.user.username,
            id
        });
    },

    viewPostsPage: async (req, res) => {
        if (!req.user) {
            return res.redirect(303, '../users/signin');
        }

        const posts = await getAllPostsWithUserInfo(req.user.id)
            .catch((err) => {
                return res.redirect(303, req.baseUrl);
            });

        res.render('posts', { username: req.user.username, posts });
    },

    createPost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect(303, '../users/signin');
        }

        const { title, content } = req.body;
        const userId = req.user.id;
        const newPost = await Posts.createPost(userId, title, content)
            .catch((err) => {
                const error = {
                    err,
                    renderPage: 'newPost',
                    params: { username: req.user.username },
                    errorMessages: [
                        { msg: '登録に失敗しました', param: 'title' },
                    ]
                };

                return next(error);
            });

        if (!newPost) return;

        res.redirect(303, req.baseUrl);
    },

    updatePost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect(303, '../../users/signin');
        }

        const id = req.params.id;
        const { title, content } = req.body;

        const updatedPost = await Posts.updatePost(id, title, content)
            .catch((err) => {
                const error = {
                    err,
                    renderPage: 'editPost',
                    params: {
                        username: req.user.username,
                        id,
                        title,
                        content
                    },
                    errorMessages: [
                        { msg: '更新に失敗しました', param: 'title' },
                    ]
                };

                return next(error);
            });

        if (!updatedPost) return;
        
        res.redirect(303, req.baseUrl);
    },

    deletePost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect(303, '../../users/signin');
        }

        const deletedPost = await Posts.deletePost(req.params.id)
            .catch((err) => {
                res.redirect(303, req.baseUrl);
                return;
            });

        if (!deletedPost) return;

        res.redirect(303, req.baseUrl);
    }
};