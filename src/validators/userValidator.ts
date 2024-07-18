import { body } from 'express-validator'

export const registerValidator = [
  body('username')
    .exists().withMessage('Username is required')
    .isString().withMessage('Username must be a string')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
    .matches(/^[a-zA-Z0-9]+$/).withMessage('Username can only contain letters and numbers'),
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('confirmPassword').custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error('Passwords do not match')
    }
    return true
  })
]

export const loginValidator = [
  body('email').isEmail().withMessage('Invalid email format'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
]

export const updateUserProfileValidator = [
  body('username').optional().isString().withMessage('Username must be a string'),
  body('email').optional().isEmail().withMessage('Invalid email format'),
  body('bio').optional().isString().withMessage('Bio must be a string'),
  body('profileImage').optional().isString().withMessage('Profile image must be a valid base64 string')
]

export const changePasswordValidator = [
  body('oldPassword').isLength({ min: 6 }).withMessage('Old password must be at least 6 characters long'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
  body('newPasswordConfirm').custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error('Passwords do not match')
    }
    return true
  })
]