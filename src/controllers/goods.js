const Goods = require('../models/goods');

module.exports = {
    createGood: async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false });
        }

        const { postId } = req.body;
        const userId = req.user.id;
        const newGood = await Goods.createGood(userId, postId)
            .catch((err) => {
                res.status(500).json({ success: false });
                return;
            });

        if (!newGood) return;

        res.json({ success: true });
    },

    deleteGood: async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false });
        }

        const { postId } = req.body;
        const userId = req.user.id;
        const deletedGood = await Goods.deleteGood(userId, postId)
            .catch((err) => {
                res.status(500).json({ success: false });
                return;
            });

        if (!deletedGood) return;

        res.json({ success: true });
    },

    getGoodsCount: async (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ success: false });
        }

        const { postId } = req.params;
        const goods = await Goods.getGoods(postId)
            .catch((err) => {
                res.status(500).json({ success: false });
                return;
            });

        if (!goods) return;

        res.json({ success: true, goodCount: goods.length });
    }
}