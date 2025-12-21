import Notification from '../modals/notification.modal.js'
import mongoose from 'mongoose'

export const getMyNotifications = async (req, res) => {
  try {
    const userId = req.user._id
    const { page = 1, limit = 50, unread } = req.query
    const q = { user: userId }
    if (unread === 'true') q.isRead = false

    const total = await Notification.countDocuments(q)
    const results = await Notification.find(q)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit))

    return res.json({ total, page: Number(page), limit: Number(limit), results })
  } catch (error) {
    console.error('getMyNotifications error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params
    if (!mongoose.isValidObjectId(notificationId)) return res.status(400).json({ message: 'Invalid id' })
    const notif = await Notification.findById(notificationId)
    if (!notif) return res.status(404).json({ message: 'Notification not found' })
    if (String(notif.user) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    notif.isRead = true
    await notif.save()
    return res.json(notif)
  } catch (error) {
    console.error('markAsRead error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const markAllAsRead = async (req, res) => {
  try {
    const userId = req.user._id
    const r = await Notification.updateMany({ user: userId, isRead: false }, { $set: { isRead: true } })
    return res.json({ modifiedCount: r.modifiedCount || r.nModified || 0 })
  } catch (error) {
    console.error('markAllAsRead error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}

export const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params
    if (!mongoose.isValidObjectId(notificationId)) return res.status(400).json({ message: 'Invalid id' })
    const notif = await Notification.findById(notificationId)
    if (!notif) return res.status(404).json({ message: 'Notification not found' })
    if (String(notif.user) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' })
    await notif.deleteOne()
    return res.json({ message: 'Deleted' })
  } catch (error) {
    console.error('deleteNotification error:', error)
    return res.status(500).json({ message: 'Server error' })
  }
}
