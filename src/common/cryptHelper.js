const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = {
  genHash: async (plainText) => {
    return await bcrypt.hash(plainText, saltRounds);
  },

  compareHash: async (plainText, hashedValue) => {
    return await bcrypt.compare(plainText, hashedValue);
  }
};
