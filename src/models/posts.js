const connection = require('../db/connection');

const insertPost = 'INSERT INTO posts(user_id, title, content) VALUES (?, ?, ?)';
const selectAllPosts = 'SELECT id, user_id, title, content FROM posts ORDER BY update_at desc';
const selectPostById = 'SELECT user_id, title, content FROM posts WHERE id = ? LIMIT 1';
const updatePost = 'UPDATE posts SET title = ?, content = ? WHERE id = ?';
const deletePost = 'DELETE FROM posts WHERE id = ?'

class Post {
    constructor({ id, userId, title, content }) {
        this.id = id;
        this.userId = userId;
        this.title = title;
        this.content = content;
    }
}

module.exports = {
    createPost: async (userId, title, content) => {
        const [result, _] = await connection.execute(insertPost, [
            userId, title, content
        ]).catch((err) => {
            throw err;
        });

        const id = result.insertId;
        return new Post({ id, userId, title, content });
    },

    getPosts: async () => {
        const [result, _] = await connection.execute(selectAllPosts)
            .catch((err) => {
                throw err;
            });

        if (result.length === 0) {
            return;
        }

        const posts = result.map((post) => {
            const id = post.id;
            const userId = post.user_id;
            const title = post.title;
            const content = post.content;

            return new Post({id, userId, title, content});
        });

        return posts;
    },

    getPost: async (id) => {
        const [result, _] = await connection.execute(selectPostById, [
            id
        ]).catch((err) => {
            throw err;
        });

        if (result.length === 0) {
            return;
        }

        const userId = result[0].user_id;
        const title = result[0].title;
        const content = result[0].content;
        return new Post({ id, userId, title, content });
    },

    updatePost: async (id, title, content) => {
        const [result, _] = await connection.execute(updatePost, [
            title, content, id
        ]).catch((err) => {
            throw err;
        });

        return new Post({ id, title, content, userId: '' });
    },

    deletePost: async (id) => {
        const [result, _] = await connection.execute(deletePost, [
            id
        ]).catch((err) => {
            throw err;
        });

        return new Post({ id, userId: '', title: '', content: '' });
    }
};
