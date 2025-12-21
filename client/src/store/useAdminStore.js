import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const useAdminStore = create((set, get) => ({
  pendingStartups: [],
  users: [],
  startups: [],
  fundingRequests: [],
  collaborationPosts: [],
  stats: {},
  // standardized loader flags (matches other stores)
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,

  fetchPending: async (page = 1, limit = 20) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/startups/pending', { params: { page, limit } })
      set({ pendingStartups: res.data.results || res.data })
    } catch (error) {
      console.error('fetchPending error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch pending startups')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchStartups: async (page = 1, limit = 20) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/startups', { params: { page, limit } })
      set({ startups: res.data.results || res.data })
    } catch (error) {
      console.error('fetchStartups error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch startups')
    } finally {
      set({ isLoading: false })
    }
  },

  verifyStartup: async (startupId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/startups/${startupId}/verify`)
      toast.success('Startup verified')
      get().fetchPending()
      get().fetchStartups()
      return res.data
    } catch (error) {
      console.error('verifyStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to verify')
    } finally {
      set({ isUpdating: false })
    }
  },

  rejectStartup: async (startupId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/startups/${startupId}/reject`)
      toast.success('Startup rejected')
      get().fetchPending()
      get().fetchStartups()
      return res.data
    } catch (error) {
      console.error('rejectStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to reject')
    } finally {
      set({ isUpdating: false })
    }
  },

  /* USERS */
  fetchUsers: async (page = 1, limit = 30, search = '') => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/users', { params: { page, limit, search } })
      set({ users: res.data.results || res.data })
    } catch (error) {
      console.error('fetchUsers error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch users')
    } finally {
      set({ isLoading: false })
    }
  },

  blockUser: async (userId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/block`)
      toast.success('User blocked')
      get().fetchUsers()
      return res.data
    } catch (error) {
      console.error('blockUser error:', error)
      toast.error(error.response?.data?.message || 'Failed to block user')
    } finally {
      set({ isUpdating: false })
    }
  },

  unblockUser: async (userId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/unblock`)
      toast.success('User unblocked')
      get().fetchUsers()
      return res.data
    } catch (error) {
      console.error('unblockUser error:', error)
      toast.error(error.response?.data?.message || 'Failed to unblock user')
    } finally {
      set({ isUpdating: false })
    }
  },

  verifyUser: async (userId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/users/${userId}/verify`)
      toast.success('User verified')
      get().fetchUsers()
      return res.data
    } catch (error) {
      console.error('verifyUser error:', error)
      toast.error(error.response?.data?.message || 'Failed to verify user')
    } finally {
      set({ isUpdating: false })
    }
  },

  deleteUser: async (userId) => {
    set({ isDeleting: true })
    try {
      const res = await axiosInstance.delete(`/admin/users/${userId}`)
      toast.success('User deleted')
      get().fetchUsers()
      return res.data
    } catch (error) {
      console.error('deleteUser error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete user')
    } finally {
      set({ isDeleting: false })
    }
  },

  /* FUNDING */
  fetchFundingRequests: async (page = 1, limit = 30, status = '') => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/funding', { params: { page, limit, status } })
      set({ fundingRequests: res.data.results || res.data })
    } catch (error) {
      console.error('fetchFundingRequests error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch funding requests')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchFundingById: async (requestId) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get(`/admin/funding/${requestId}`)
      return res.data
    } catch (error) {
      console.error('fetchFundingById error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch funding request')
    } finally {
      set({ isLoading: false })
    }
  },

  cancelFundingRequest: async (requestId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/funding/${requestId}/cancel`)
      toast.success('Funding request cancelled')
      get().fetchFundingRequests()
      return res.data
    } catch (error) {
      console.error('cancelFundingRequest error:', error)
      toast.error(error.response?.data?.message || 'Failed to cancel funding request')
    } finally {
      set({ isUpdating: false })
    }
  },

  /* COLLABORATION */
  fetchCollaborationPostsAdmin: async (page = 1, limit = 30) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/collaboration', { params: { page, limit } })
      set({ collaborationPosts: res.data.results || res.data })
    } catch (error) {
      console.error('fetchCollaborationPostsAdmin error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch collaboration posts')
    } finally {
      set({ isLoading: false })
    }
  },

  disableCollaborationPost: async (postId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/collaboration/${postId}/disable`)
      toast.success('Collaboration post disabled')
      get().fetchCollaborationPostsAdmin()
      return res.data
    } catch (error) {
      console.error('disableCollaborationPost error:', error)
      toast.error(error.response?.data?.message || 'Failed to disable post')
    } finally {
      set({ isUpdating: false })
    }
  },

  deleteCollaborationPost: async (postId) => {
    set({ isDeleting: true })
    try {
      const res = await axiosInstance.delete(`/admin/collaboration/${postId}`)
      toast.success('Collaboration post deleted')
      get().fetchCollaborationPostsAdmin()
      return res.data
    } catch (error) {
      console.error('deleteCollaborationPost error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete post')
    } finally {
      set({ isDeleting: false })
    }
  },

  /* SYSTEM NOTIFICATIONS */
  sendSystemNotification: async (payload) => {
    set({ isCreating: true })
    try {
      const res = await axiosInstance.post('/admin/notifications', payload)
      toast.success('System notification sent')
      return res.data
    } catch (error) {
      console.error('sendSystemNotification error:', error)
      toast.error(error.response?.data?.message || 'Failed to send notification')
    } finally {
      set({ isCreating: false })
    }
  },

  /* STATS */
  fetchStats: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/admin/stats')
      set({ stats: res.data })
    } catch (error) {
      console.error('fetchStats error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch stats')
    } finally {
      set({ isLoading: false })
    }
  },
}))

export default useAdminStore
