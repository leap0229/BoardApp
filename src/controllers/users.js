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
    signupUser: async (req, res, next) => {
        const { email, inputUsername, password } = req.body;

        const newUser = await Users.createUser(email, inputUsername, password)
            .catch((err) => {
                const error = {
                    err,
                    renderPage: 'signup',
                    params: { inputUsername, email }
                };

                if (err instanceof DuplicateUserError) {
                    error['status'] = 400;
                    error['errorMessages'] = [
                            { msg: '既に登録されています', param: 'email' },
                        ];
    
                    return next(error);
                }

                error['errorMessages'] = [
                    { msg: '登録に失敗しました', param: 'username' },
                ];

                return next(error);
            });

        // await-catchでcatchされるとnewuserにfalsyな値が返るので、ここでリターン
        if (!newUser) return;

        res.cookie('jwt', genJWT({ id: newUser.id }), {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect(303, '../posts');
    },

    // ユーザログイン時メソッド
    signinUser: async (req, res, next) => {
        const user = req.user;

        res.cookie('jwt', genJWT({ id: user.id }), {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect(303, '../posts');
    },

    signoutUser: async (req, res) => {
        res.clearCookie('jwt', {
            httpOnly: true,
            //secure: true // httpsの場合のみ有効にする。本番時
        });

        res.redirect(303, 'signin');
    },

    viewSignupUserPage: async (req, res) => {
        if (req.user) {
            return res.redirect(303, '../posts');
        }

        res.render('signup');
    },

    viewSigninUserPage: async (req, res) => {
        if (req.user) {
            return res.redirect(303, '../posts');
        }

        res.render('signin');
    },
};