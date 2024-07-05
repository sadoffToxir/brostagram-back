
import { Router } from 'express'
import { likePost } from '../controllers/likeController'
import { likeValidator } from '../validators/likeValidator'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.post('/:postId/like', authMiddleware, likeValidator, likePost)

export default router
