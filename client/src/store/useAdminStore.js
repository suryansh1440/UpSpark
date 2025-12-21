import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const useAdminStore = create((set, get) => ({
  pendingStartups: [],
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

  verifyStartup: async (startupId) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/admin/startups/${startupId}/verify`)
      toast.success('Startup verified')
      get().fetchPending()
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
      return res.data
    } catch (error) {
      console.error('rejectStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to reject')
    } finally {
      set({ isUpdating: false })
    }
  },
}))

export default useAdminStore
