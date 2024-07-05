import { Router } from 'express'
import multer from 'multer'
import { register, login, getUserProfile, updateUserProfile, accessToken, changePassword } from '../controllers/userController'
import authMiddleware from '../middleware/authMiddleware'
import { registerValidator, loginValidator, updateUserProfileValidator, changePasswordValidator } from '../validators/userValidator'
import { validateRequest } from '../middleware/validateRequest'

const router = Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/register', registerValidator, validateRequest, register)
router.post('/login', loginValidator, validateRequest, login)
router.post('/access-token', accessToken)
router.get('/:userId', authMiddleware, getUserProfile)
router.get('/', authMiddleware, getUserProfile)
router.put('/:userId', authMiddleware, upload.single('profileImage'), updateUserProfileValidator, validateRequest, updateUserProfile)
router.put('/:userId/password', authMiddleware, changePasswordValidator, validateRequest, changePassword)

export default router
