
module.exports = {
    viewPostPage: (req, res) => {
        if (!req.user) {
            return res.render('signin');
        }

        res.render('post', { username: req.user.username, authenticated: true });
    }
};