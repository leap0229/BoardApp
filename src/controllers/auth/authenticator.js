const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const Users = require('../../models/users');

passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});

// ログイン画面からの認証用設定
passport.use(new LocalStrategy(
    { usernameField: 'email', passwordField: 'password' },
    async (email, password, done) => {
        const validUser = await Users.getValidUser(email, password)
            .catch((err) => {
                return done(err, false);
            });

        if (!validUser) {
            return done(null, false);
        }
        
        return done(null, validUser);
    }
));


// cookieからJWT取得用の関数
const cookieExtractor = (req) => {
    return (req && req.cookies) ? req.cookies['jwt'] : null;
};

// JWTアクセス時の認証用設定
passport.use(new JwtStrategy(
    {
        jwtFromRequest: cookieExtractor,
        secretOrKey: process.env.TOKEN_SECRET,
        issuer: process.env.ISSUER,
        audience: process.env.AUDIENCE
    },
    async (jwtPayload, done) => {
        const id = jwtPayload.id;
        const validUser = await Users.getUser(id)
            .catch((err) => {
                return done(err, false);
            });
        
        return done(null, validUser);
    }
));

module.exports = {
    loginAuthenticate: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            req.user = user;
            next();
        })(req, res, next);
    },

    jwtAuthenticate: (req, res, next) => {
        passport.authenticate('jwt', (err, user, info) => {
            if (err) {
                // JWTが正常かつユーザが存在していない場合、想定していないエラーのため
                // JWT削除のうえ、トップページに戻す
                res.clearCookie('jwt', {
                    httpOnly: true,
                    //secure: true // httpsの場合のみ有効にする。本番時
                });

                return res.render('signin');
            }
            
            req.user = user;
            next();
        })(req, res, next);
    }
};