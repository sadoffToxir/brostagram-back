import { param } from 'express-validator'

export const followValidator = [
  param('userId').isMongoId().withMessage('Invalid user ID')
]
