import { Router } from 'express'
import { commentOnPost } from '../controllers/commentController'
import { commentValidator } from '../validators/commentValidator'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.post('/:postId/comment', authMiddleware, commentValidator, commentOnPost)

export default router
