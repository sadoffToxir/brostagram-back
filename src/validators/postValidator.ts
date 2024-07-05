import { body, param } from 'express-validator'

export const createPostValidator = [
  body('content').isString().withMessage('Content must be a string'),
  body('exercises').isArray().withMessage('Exercises must be an array'),
  body('exercises.*.name').isString().withMessage('Exercise name must be a string'),
  body('exercises.*.sets').isInt({ min: 1 }).withMessage('Sets must be a positive integer'),
  body('exercises.*.repetitions').isInt({ min: 1 }).withMessage('Repetitions must be a positive integer')
]

export const postIdValidator = [
  param('postId').isMongoId().withMessage('Invalid post ID')
]
