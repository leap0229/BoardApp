const jwt = require('jsonwebtoken');

module.exports = {
  genJWT: (payload) => {
    const opts = {
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
      expiresIn: process.env.EXPIRES,
    };
    const secret = process.env.TOKEN_SECRET;

    return jwt.sign(payload, secret, opts);
  }
};
