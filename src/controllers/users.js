const Users = require('../models/users');
const userSignupValidator = require('./validator/users/userSignupValidator');
const userSigninValidator = require('./validator/users/userSigninValidator');
const { createParamToError } = require('./common/common');
const { DuplicateUserError } = require('../common/customException');
const { genJWT } = require('../common/authenticateHelper');

module.exports = {
    // ユーザ登録時の入力チェック用メソッド
    validateSignupUser: userSignupValidator.validate,

    // ログイン時の入力チェック用メソッド
    validateSigninUser: userSigninValidator.validate,

    // ユーザ登録メソッド
    signupUser: async (req, res) => {
        const { email, username, password } = req.body;

        const newUser = await Users.createUser(email, username, password)
            .catch((err) => {
                if (err instanceof DuplicateUserError) {
                    res.render('signup', {
                        username, email,
                        errorMessages: createParamToError([
                            { msg: '既に登録されています', param: 'email' },
                        ]),
                    });

                    return;
                }

                res.render('signup', {
                    username, email,
                    errorMessages: createParamToError([
                        { msg: '登録に失敗しました', param: 'username' },
                    ]),
                });

                return;
            });

        // await-catchでcatchされるとnewuserにfalsyな値が返るので、ここでリターン
        if (!newUser) return;

        res.cookie('jwt', genJWT({ id: newUser.id }), {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect('../posts');
    },

    // ユーザログイン時メソッド
    signinUser: async (req, res) => {
        const user = req.user;
        if (!user) {
            return res.render('signin', {
                email: req.body.email,
                errorMessages: createParamToError([
                    { msg: 'ログインに失敗しました', param: 'email' },
                ])
            });
        }

        res.cookie('jwt', genJWT({ id: user.id }), {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect('../posts');
    },

    signoutUser: async (req, res) => {
        res.clearCookie('jwt', {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect('signin');
    },

    viewSignupUserPage: async (req, res) => {
        if (req.user) {
            return res.redirect('../posts');
        }

        res.render('signup');
    },

    viewSigninUserPage: async (req, res) => {
        if (req.user) {
            return res.redirect('../posts');
        }

        res.render('signin');
    },
};