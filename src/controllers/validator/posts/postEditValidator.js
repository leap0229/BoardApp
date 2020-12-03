const { check, validationResult } = require('express-validator');
const { createParamToError } = require('../../common/common');

const maximumContentLength = 140;

module.exports = {
  validate: [
    check('id').isInt(),
    check('title').trim().notEmpty().withMessage('必須項目です')
      .escape(),
    check('content').trim().notEmpty().withMessage('必須項目です')
      .bail().isLength({ max: maximumContentLength }).withMessage(`${maximumContentLength}文字までです`)
      .escape(),

    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).render('editPost', {
          title: req.body.title,
          content: req.body.content,
          id: req.params.id,
          username: req.user.username,
          errorMessages: createParamToError(errors.errors),
        });
      }

      next();
    }
  ]
};
