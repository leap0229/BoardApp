const Goods = require('../models/goods');

module.exports = {
    createGood: async (req, res, next) => {
        if (!req.user) {
            return res.redirect(303, '../users/signin');
        }

        const { postId } = req.body;
        const userId = req.user.id;
        const newGood = await Goods.createGood(userId, postId)
            .catch((err) => {
                res.redirect(303, req.baseUrl);
                return;
            });

        if (!newGood) return;

        const goods = await Goods.getGoods(postId)
            .catch((err) => {
                return;
            });

        if (!goods) return;

        res.json({ goodCount: goods.length });
    },

    deleteGood: async (req, res, next) => {
        if (!req.user) {
            return res.redirect(303, '../users/signin');
        }

        const { postId } = req.body;
        const userId = req.user.id;
        const deletedGood = await Goods.deleteGood(userId, postId)
            .catch((err) => {
                res.redirect(303, req.baseUrl);
                return;
            });

        if (!deletedGood) return;

        const goods = await Goods.getGoods(postId)
            .catch((err) => {
                return;
            });

        if (!goods) return;

        res.json({ goodCount: goods.length });
    }
}