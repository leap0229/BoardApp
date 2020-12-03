const { check, validationResult } = require('express-validator');
const { createParamToError } = require('../../common/common');

const validatePasswordConfirmation = (confirmPassword, { req }) => {
  const password = req.body.password;

  if (password !== confirmPassword) {
    throw new Error('パスワードが一致していません');
  }

  return true;
};

const minimumPasswordLength = 8;

module.exports = {
  validate: [
    check('inputUsername').notEmpty().withMessage('必須項目です'),
    check('email').notEmpty().withMessage('必須項目です')
      .bail().trim().isEmail().bail().normalizeEmail().withMessage('メールアドレスを入力してください'),
    check('password')
      .notEmpty().withMessage('必須項目です')
      .bail().isLength({ min: minimumPasswordLength }).withMessage(`${minimumPasswordLength}文字以上で入力してください`),
    check('confirmPassword')
      .notEmpty().withMessage('必須項目です')
      .bail().custom(validatePasswordConfirmation),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('signup', {
          inputUsername: req.body.inputUsername,
          email: req.body.email,
          errorMessages: createParamToError(errors.errors),
        });
      }

      next();
    }
  ]
};
