import express from 'express'
import { getRequestsForFounder, acceptRequest, rejectRequest } from '../controllers/funding.controller.js'
import { protectRoute } from '../middleware/auth.middleware.js'
import { requireRole } from '../middleware/role.middleware.js'

const router = express.Router()

// founder: see requests targeting their startups
router.get('/', protectRoute, requireRole('founder'), getRequestsForFounder)
router.put('/:requestId/accept', protectRoute, requireRole('founder'), acceptRequest)
router.put('/:requestId/reject', protectRoute, requireRole('founder'), rejectRequest)

export default router
