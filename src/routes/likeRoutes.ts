
import { Router } from 'express'
import { likePost, unlikePost } from '../controllers/likeController'
import { likeValidator } from '../validators/likeValidator'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.post('/:postId/like', authMiddleware, likeValidator, likePost)
router.delete('/:postId/unlike', authMiddleware, unlikePost)

export default router
