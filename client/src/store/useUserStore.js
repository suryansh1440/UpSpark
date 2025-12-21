import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'
import { useAuthStore } from './useAuthStore'

export const useUserStore = create((set) => ({
  isLoading: false,
  isUpdating: false,
  isUploadingAvatar: false,

  getMe: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/users/me')
      // Keep auth store canonical
      await useAuthStore.getState().checkAuth()
      return res.data
    } catch (err) {
      console.error('getMe error:', err)
      return null
    } finally {
      set({ isLoading: false })
    }
  },

  updateProfile: async (payload) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put('/users/me', payload)
      // Refresh canonical user
      await useAuthStore.getState().checkAuth()
      toast.success('Profile updated')
      return res.data
    } catch (err) {
      console.error('updateProfile error:', err)
      toast.error(err.response?.data?.message || 'Failed to update profile')
      throw err
    } finally {
      set({ isUpdating: false })
    }
  },

  updateAvatar: async (file) => {
    set({ isUploadingAvatar: true })
    try {
      const form = new FormData()
      form.append('file', file)
      // Let axios set the multipart boundary header automatically
      const res = await axiosInstance.put('/users/me/avatar', form)
      await useAuthStore.getState().checkAuth()
      toast.success('Avatar updated')
      return res.data
    } catch (err) {
      console.error('updateAvatar error:', err)
      toast.error(err.response?.data?.message || 'Failed to upload avatar')
      throw err
    } finally {
      set({ isUploadingAvatar: false })
    }
  },
}))

export default useUserStore
