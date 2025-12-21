import express from 'express'
import { protectRoute } from '../middleware/auth.middleware.js'
import { getMyNotifications, markAsRead, markAllAsRead, deleteNotification } from '../controllers/notification.controller.js'

const router = express.Router()

// get current user's notifications (supports ?page=&limit=&unread=true)
router.get('/', protectRoute, getMyNotifications)

// mark single notification as read
router.put('/:notificationId/read', protectRoute, markAsRead)

// mark all as read
router.put('/read-all', protectRoute, markAllAsRead)

// delete
router.delete('/:notificationId', protectRoute, deleteNotification)

export default router
