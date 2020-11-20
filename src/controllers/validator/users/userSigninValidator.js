const { check, validationResult } = require('express-validator');
const { createParamToError } = require('../../common/common');

module.exports = {
  validate: [
    check('email').notEmpty().withMessage('必須項目です')
      .bail().trim().isEmail().bail().normalizeEmail().withMessage('メールアドレスを入力してください'),
    check('password')
      .notEmpty().withMessage('必須項目です'),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.render('signin', {
          username: req.body.username,
          email: req.body.email,
          errorMessages: createParamToError(errors.errors),
        });
      }

      next();
    }
  ]
};
