import { param } from 'express-validator'

export const likeValidator = [
  param('postId').isMongoId().withMessage('Invalid post ID')
]
