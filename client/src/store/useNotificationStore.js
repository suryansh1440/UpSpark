import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const useNotificationStore = create((set, get) => ({
  notifications: [],
  total: 0,
  page: 1,
  limit: 20,
  unreadCount: 0,

  isLoading: false,
  isMarking: false,
  isDeleting: false,

  fetchNotifications: async (params = {}) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/notifications', { params: { page: params.page || 1, limit: params.limit || 50, ...(params.unread ? { unread: true } : {}) } })
      const data = res.data
      set({ notifications: data.results || [], total: data.total || (data.results || []).length, page: data.page || 1, limit: data.limit || 20 })
      // if unread param not provided, still refresh unreadCount
      if (!params.unread) get().fetchUnreadCount()
      return data
    } catch (err) {
      console.error('fetchNotifications error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch notifications')
      throw err
    } finally {
      set({ isLoading: false })
    }
  },

  fetchUnreadCount: async () => {
    try {
      const res = await axiosInstance.get('/notifications', { params: { unread: true, page: 1, limit: 1 } })
      set({ unreadCount: res.data.total || 0 })
      return res.data.total || 0
    } catch (err) {
      console.error('fetchUnreadCount error:', err)
      return 0
    }
  },

  markAsRead: async (id) => {
    set({ isMarking: true })
    try {
      const res = await axiosInstance.put(`/notifications/${id}/read`)
      const updated = res.data
      set((s) => ({ notifications: s.notifications.map((n) => (String(n._id) === String(id) ? updated : n)), unreadCount: Math.max(0, (s.unreadCount || 0) - (nIsUnread(s.notifications, id) ? 1 : 0)) }))
      toast.success('Marked as read')
      return updated
    } catch (err) {
      console.error('markAsRead error:', err)
      toast.error(err.response?.data?.message || 'Failed to mark as read')
      throw err
    } finally {
      set({ isMarking: false })
    }
  },

  markAllAsRead: async () => {
    set({ isMarking: true })
    try {
      await axiosInstance.put('/notifications/read-all')
      set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, isRead: true })), unreadCount: 0 }))
      toast.success('Marked all as read')
    } catch (err) {
      console.error('markAllAsRead error:', err)
      toast.error(err.response?.data?.message || 'Failed to mark all as read')
      throw err
    } finally {
      set({ isMarking: false })
    }
  },

  deleteNotification: async (id) => {
    set({ isDeleting: true })
    try {
      await axiosInstance.delete(`/notifications/${id}`)
      set((s) => ({ notifications: s.notifications.filter((n) => String(n._id) !== String(id)), total: Math.max(0, s.total - 1) }))
      toast.success('Notification deleted')
    } catch (err) {
      console.error('deleteNotification error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete notification')
      throw err
    } finally {
      set({ isDeleting: false })
    }
  },
}))

function nIsUnread(list, id) {
  const n = list.find((x) => String(x._id) === String(id))
  return n ? !n.isRead : false
}

export default useNotificationStore
