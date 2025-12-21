import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useFundingStore = create((set) => ({
  founderRequests: [],
  investorRequests: [],
  updatingRequestIds: [], // track per-request update loading

  // standardized loader flags
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,

  fetchFounderRequests: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/funding')
      set({ founderRequests: res.data })
    } catch (err) {
      console.error('fetchFounderRequests error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch requests')
    } finally {
      set({ isLoading: false })
    }
  },

  acceptRequest: async (requestId) => {
    // mark this request as updating (per-request flag)
    set((s) => ({ updatingRequestIds: [...s.updatingRequestIds, requestId] }))
    try {
      const res = await axiosInstance.put(`/funding/${requestId}/accept`)
      toast.success('Request accepted')
      // update local cache so UI updates immediately
      set((s) => ({ founderRequests: s.founderRequests.map((r) => (String(r._id) === String(requestId) ? res.data : r)) }))
      return res.data
    } catch (err) {
      console.error('acceptRequest error:', err)
      toast.error(err.response?.data?.message || 'Failed to accept')
      throw err
    } finally {
      set((s) => ({ updatingRequestIds: s.updatingRequestIds.filter((id) => id !== requestId) }))
    }
  },

  rejectRequest: async (requestId) => {
    set((s) => ({ updatingRequestIds: [...s.updatingRequestIds, requestId] }))
    try {
      const res = await axiosInstance.put(`/funding/${requestId}/reject`)
      toast.success('Request rejected')
      set((s) => ({ founderRequests: s.founderRequests.map((r) => (String(r._id) === String(requestId) ? res.data : r)) }))
      return res.data
    } catch (err) {
      console.error('rejectRequest error:', err)
      toast.error(err.response?.data?.message || 'Failed to reject')
      throw err
    } finally {
      set((s) => ({ updatingRequestIds: s.updatingRequestIds.filter((id) => id !== requestId) }))
    }
  },
}))

export default useFundingStore
