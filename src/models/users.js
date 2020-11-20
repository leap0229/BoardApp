const connection = require('../db/connection');
const cryptHelper = require('../common/cryptHelper');
const { DuplicateUserError } = require('../common/customException');

const insertUser = 'INSERT INTO users(email, username, password) VALUES (?, ?, ?)';
const selectOneUserByEmail = 'SELECT id, username, password FROM users WHERE email = ? LIMIT 1';
const selectOneUserById = 'SELECT email, username FROM users WHERE id = ? LIMIT 1';

class User {
  constructor({ id, email, username, rawPassword }) {
    this.id = id;
    this.email = email;
    this.username = username;
    this.password = rawPassword;
  }
}

module.exports = {
  createUser: async (email, username, rawPassword) => {
    const password = await cryptHelper.genHash(rawPassword);

    const [result, _] = await connection.execute(insertUser, [
      email, username, password
    ]).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new DuplicateUserError();
      }

      throw err;
    });

    const id = result.insertId;
    return new User({ id, email, username, rawPassword });
  },

  getValidUser: async (email, rawPassword) => {
    const [result, _] = await connection.execute(selectOneUserByEmail, [
      email
    ]).catch((err) => {
      throw err;
    });

    if (result.length === 0) {
      return;
    }

    const hashedPassword = result[0].password;
    const isValid = await cryptHelper.compareHash(rawPassword, hashedPassword);

    if (!isValid) {
      return;
    }

    const id = result[0].id;
    const username = result[0].username;
    return new User({ id, email, username, rawPassword });
  },

  getUser: async (id) => {
    const [result, _] = await connection.execute(selectOneUserById, [
      id
    ]).catch((err) => {
      throw err;
    });

    if (result.length === 0) {
      return;
    }

    const email = result[0].email;
    const username = result[0].username;
    return new User({ id, email, username, rawPassword: null });
  }
};
