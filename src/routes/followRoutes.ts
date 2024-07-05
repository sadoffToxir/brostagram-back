import { Router } from 'express'
import { followUser, unfollowUser, getFollowersList, getFollowingList, searchUsers } from '../controllers/followController'
import { followValidator } from '../validators/followValidator'
import authMiddleware from '../middleware/authMiddleware'

const router = Router()

router.post('/:userId/follow', authMiddleware, followValidator, followUser)
router.post('/:userId/unfollow', authMiddleware, followValidator, unfollowUser)
router.get('/:userId/followers', authMiddleware, getFollowersList)
router.get('/:userId/followings', authMiddleware, getFollowingList)
router.get('/search', authMiddleware, searchUsers)

export default router
