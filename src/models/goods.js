const connection = require('../db/connection');

const insertGood = 'INSERT INTO goods(user_id, post_id) VALUES (?, ?)';
const deleteGood = 'DELETE FROM goods WHERE user_id = ? AND post_id = ?'
const selectGoodsByPostId = 'SELECT id, user_id FROM goods WHERE post_id = ?'

/*
// 投稿一覧表示用
// post_id毎のgood件数と、指定のユーザIDが、その投稿にGoodをつけているかを取得する
const selectAllGoods = 
`SELECT g1.post_id, post_count, (g2.post_id IS NOT NULL) AS haveOwnGood 
FROM (SELECT post_id, COUNT(id) AS post_count FROM goods GROUP BY post_id) g1 
LEFT OUTER JOIN (SELECT post_id FROM goods WHERE user_id = ?) g2 ON g1.post_id = g2.post_id`;
*/

class Good {
    constructor({ id, userId, postId }) {
        this.id = id;
        this.userId = userId;
        this.postId = postId;
    }
}

module.exports = {
    createGood: async (userId, postId) => {
        const [result, _] = await connection.execute(insertGood, [
            userId, postId
        ]).catch((err) => {
            throw err;
        });

        const id = result.insertId;
        return new Good({ id, userId, postId });
    },

    getGoods: async (postId) => {
        const [result, _] = await connection.execute(selectGoodsByPostId, [postId])
            .catch((err) => {
                throw err;
            });

        if (result.length === 0) {
            return [];
        }

        const goods = result.map((good) => {
            const id = good.id;
            const userId = good.user_id;

            return new Good({ id, userId, postId });
        });

        return goods;
    },

    deleteGood: async (userId, postId) => {
        const [result, _] = await connection.execute(deleteGood, [
            userId,
            postId
        ]).catch((err) => {
            throw err;
        });

        return new Good({ id : '', userId, postId });
    }
};
