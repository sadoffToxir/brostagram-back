import { Router } from 'express'
import { createPost, getFollowingPosts, getUserPosts, getPostById, deletePost, } from '../controllers/postController'
import { postIdValidator, createPostValidator } from '../validators/postValidator'
import authMiddleware from '../middleware/authMiddleware'
import { validateRequest } from '../middleware/validateRequest'

const router = Router()

router.post('/', authMiddleware, createPostValidator, validateRequest, createPost)
router.get('/following', authMiddleware, getFollowingPosts)
router.get('/user/:userId', authMiddleware, getUserPosts)
router.get('/:postId', authMiddleware, getPostById)
router.delete('/:postId', authMiddleware, postIdValidator, validateRequest, deletePost)

export default router
