import { body, param } from 'express-validator'

const isValidSet = (value: any) => {
  if (typeof value !== 'number' || value <= 0) {
    throw new Error('Value must be a number greater than 0')
  }
  return true
}

export const createPostValidator = [
  body('title').notEmpty().withMessage('Title is required'),
  body('exercises').isArray({ min: 1 }).withMessage('Exercises must be a non-empty array'),
  body('exercises.*.id').notEmpty().withMessage('Exercise ID is required'),
  body('exercises.*.name').notEmpty().withMessage('Exercise name is required'),
  body('exercises.*.category').notEmpty().withMessage('Exercise category is required'),
  body('exercises.*.type').notEmpty().withMessage('Exercise type is required'),
  body('exercises.*.sets').isArray({ min: 1 }).withMessage('Sets must be a non-empty array'),
  body('exercises.*.sets.*').custom(set => {
    const keys = ['weight', 'reps', 'duration', 'distance', 'assistedWeight']
    const isValid = keys.some(key => set[key] && isValidSet(set[key]))
    if (!isValid) {
      throw new Error('Each set must have at least one valid field with a number greater than 0')
    }
    return true
  })
]

export const postIdValidator = [
  param('postId').isMongoId().withMessage('Invalid post ID')
]
