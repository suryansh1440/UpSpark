import express from 'express'
import multer from 'multer'
import {
  getMe,
  updateProfile,
  updateAvatar,
  changePassword,
  deactivateAccount,
} from '../controllers/user.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.get('/me', protectRoute, getMe)
router.put('/me', protectRoute, updateProfile)
router.put('/me/avatar', protectRoute, upload.single('file'), updateAvatar)
router.put('/me/change-password', protectRoute, changePassword)
router.put('/me/deactivate', protectRoute, deactivateAccount)

export default router
