import { Router } from 'express'
import { getExercises, getExerciseByName } from '../controllers/exerciseController'

const router = Router()

router.get('/', getExercises)
router.get('/:name', getExerciseByName)

export default router
