const { check, validationResult } = require('express-validator');
const { createParamToError } = require('../../common/common');

module.exports = {
  validate: [
    check('id').isInt(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.redirect(req.baseUrl);
      }

      next();
    }
  ]
};
