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
            return res.redirect('../users/signin');
        }

        res.render('newPost', { username: req.user.username });
    },

    viewEditPostPage: async (req, res) => {
        if (!req.user) {
            return res.redirect('../../users/signin');
        }

        const id = req.params.id;
        const post = await Posts.getPost(id)
            .catch((err) => {
                return res.redirect(req.baseUrl);
            });

        if (!post) {
            return res.redirect(req.baseUrl);
        }

        res.render('editPost', {
            'title': post.title, 
            'content': post.content,
            'username': req.user.username,
            id
        });
    },

    viewPostsPage: async (req, res) => {
        if (!req.user) {
            return res.redirect('../users/signin');
        }

        const posts = await getAllPostsWithUserInfo(req.user.id)
            .catch((err) => {
                return res.redirect(req.baseUrl);
            });

        res.render('posts', { username: req.user.username, posts });
    },

    createPost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect('../users/signin');
        }

        const { title, content } = req.body;
        const userId = req.user.id;
        const newPost = Posts.createPost(userId, title, content)
            .catch((err) => {
                res.render('newPost', {
                    username: req.user.username,
                    errorMessages: createParamToError([
                        { msg: '登録に失敗しました', param: 'title' },
                    ]),
                });

                return;
            });

        if (!newPost) return;

        res.redirect(req.baseUrl);
    },

    updatePost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect('../../users/signin');
        }

        const postId = req.params.id;
        const { title, content } = req.body;

        const updatedPost = Posts.updatePost(postId, title, content)
            .catch((err) => {
                res.render('editPost', {
                    
                    username: req.user.username,
                    errorMessages: createParamToError([
                        { msg: '更新に失敗しました', param: 'title' },
                    ]),
                });

                return;
            });

        if (!updatedPost) return;
        
        res.redirect(req.baseUrl);
    },

    deletePost: async (req, res, next) => {
        if (!req.user) {
            return res.redirect('../../users/signin');
        }

        const deletedPost = Posts.deletePost(req.params.id)
            .catch((err) => {
                res.redirect(req.baseUrl);
                return;
            });

        if (!deletedPost) return;

        res.redirect(req.baseUrl);
    }
};