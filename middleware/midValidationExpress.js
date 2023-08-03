const { body, validationResult } = require('express-validator');

const validationNewPost = [
  body('title').isString().withMessage('Title must be a string'),
  body('category').isString().withMessage('Category must be a string'),
  body('cover').isEmpty().withMessage('Cover must be a valid'),
  body('content').isString().withMessage('Content must be a string'),
  body('readTime.value').isString().withMessage('ReadTime must be a string'),
];



const validationNewUser = [
    body('email').isEmail().withMessage('Email must be a valid email'),
    body('password').isString().withMessage('Password must be at least 6 characters long'),
    body('name').isString().withMessage('Name must be a string'),
    body('surname').isString().withMessage('Surname must be a string'),
    body('born_date').isString().withMessage('Born_date must be a string'),
]



const validateMiddleware = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};



module.exports = {
  validationNewPost,
  validationNewUser,
  validateMiddleware,
};
