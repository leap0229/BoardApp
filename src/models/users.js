const connection = require('../db/connection');
const cryptHelper = require('../common/cryptHelper');
const { DuplicateUserError } = require('../common/customException');

const insertsUser = 'INSERT INTO users(email, username, password) VALUES (?, ?, ?)';
const selectOneUser = 'SELECT username, password FROM users WHERE email = ? LIMIT 1';
const selectUsernameOneUser = 'SELECT username FROM users WHERE email = ? LIMIT 1';

class User {
  constructor({ email, username, rawPassword }) {
    this.email = email;
    this.username = username;
    this.password = rawPassword;
  }
}

module.exports = {
  createUser: async (email, username, rawPassword) => {
    const password = await cryptHelper.genHash(rawPassword);

    const _ = await connection.execute(insertsUser, [
      email, username, password
    ]).catch((err) => {
      if (err.code === 'ER_DUP_ENTRY') {
        throw new DuplicateUserError();
      }

      throw err;
    });

    return new User({ email, username, rawPassword });
  },

  getValidUser: async (email, rawPassword) => {
    const [result, _] = await connection.execute(selectOneUser, [
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

    const username = result[0].username;
    return new User({ email, username, rawPassword });
  },

  getUser: async (email) => {
    const [result, _] = await connection.execute(selectUsernameOneUser, [
      email
    ]).catch((err) => {
      throw err;
    });

    if (result.length === 0) {
      return;
    }

    const username = result[0].username;
    return new User({ email, username, rawPassword: null });
  }
};
