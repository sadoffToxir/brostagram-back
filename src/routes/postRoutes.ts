import { Router } from 'express'
import { createPost, getPosts, getPostById, deletePost } from '../controllers/postController'
import { createPostValidator, postIdValidator } from '../validators/postValidator'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.post('/', authMiddleware, createPostValidator, createPost)
router.get('/', authMiddleware, getPosts)
router.get('/:postId', authMiddleware, postIdValidator, getPostById)
router.delete('/:postId', authMiddleware, postIdValidator, deletePost)

export default router
