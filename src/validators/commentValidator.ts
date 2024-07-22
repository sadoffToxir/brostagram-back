import { body, param } from 'express-validator'

export const commentValidator = [
  param('postId').isMongoId().withMessage('Invalid post ID'),
  body('comment').isString().withMessage('Content must be a string')
]
