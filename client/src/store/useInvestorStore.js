import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const useInvestorStore = create((set, get) => ({
  // data
  watchlist: [],
  fundingRequests: [],

  // standardized loaders
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,

  // watchlist
  fetchWatchlist: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/investor/watchlist')
      set({ watchlist: res.data })
    } catch (err) {
      console.error('fetchWatchlist error:', err)
      toast.error(err.response?.data?.message || 'Failed to load watchlist')
    } finally {
      set({ isLoading: false })
    }
  },

  addToWatchlist: async (startupId) => {
    set({ isCreating: true })
    try {
      const res = await axiosInstance.post(`/investor/watchlist/${startupId}`)
      toast.success('Added to watchlist')
      // keep in sync
      get().fetchWatchlist()
      return res.data
    } catch (err) {
      console.error('addToWatchlist error:', err)
      toast.error(err.response?.data?.message || 'Failed to add to watchlist')
      throw err
    } finally {
      set({ isCreating: false })
    }
  },

  removeFromWatchlist: async (startupId) => {
    set({ isDeleting: true })
    try {
      const res = await axiosInstance.delete(`/investor/watchlist/${startupId}`)
      toast.success('Removed from watchlist')
      get().fetchWatchlist()
      return res.data
    } catch (err) {
      console.error('removeFromWatchlist error:', err)
      toast.error(err.response?.data?.message || 'Failed to remove from watchlist')
      throw err
    } finally {
      set({ isDeleting: false })
    }
  },

  // funding
  sendFundingRequest: async ({ startupId, amount, message }) => {
    set({ isCreating: true })
    try {
      const res = await axiosInstance.post('/investor/funding/request', { startupId, amount, message })
      toast.success('Funding request sent')
      get().fetchMyFundingRequests()
      return res.data
    } catch (err) {
      console.error('sendFundingRequest error:', err)
      toast.error(err.response?.data?.message || 'Failed to send funding request')
      throw err
    } finally {
      set({ isCreating: false })
    }
  },

  fetchMyFundingRequests: async () => {
    const set = get()
    set.isLoading = true
    try {
      const { data } = await axiosInstance.get('/investor/funding')
      set.fundingRequests = data
    } catch (err) {
      console.error('fetchMyFundingRequests', err)
    } finally {
      set.isLoading = false
    }
  },

  withdrawFundingRequest: async (requestId) => {
    const set = get()
    set.isUpdating = true
    try {
      await axiosInstance.put(`/investor/funding/${requestId}/withdraw`)
      // Refetch
      await set.fetchMyFundingRequests()
      toast.success('Request withdrawn')
    } catch (err) {
      console.error('withdrawFundingRequest', err)
      toast.error('Could not withdraw request')
    } finally {
      set.isUpdating = false
    }
  },

  // helpers
  watchlistIds: () => get().watchlist.map((s) => s._id || s.id),
}))

export default useInvestorStore
