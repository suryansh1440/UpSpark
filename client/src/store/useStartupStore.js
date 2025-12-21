import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const STORAGE_KEY = 'upspark:savedStartups'

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    console.error('readSaved error:', e)
    return []
  }
}

const useStartupStore = create((set, get) => ({
  // remote data
  startups: [],
  myStartups: [],
  total: 0,
  page: 1,
  limit: 20,
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isUploading: false,

  // local state
  currentStartup: null, // full object
  selectedStartupId: null, // id only
  savedIds: readSaved(),

  // actions
  fetchStartups: async (params = {}) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/startups', { params })
      const results = res.data.results || res.data
      set({ startups: results, total: res.data.total || results.length, page: res.data.page || 1 })
    } catch (error) {
      console.error('fetchStartups error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch startups')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMyStartups: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/startups/mine')
      const results = res.data.results || res.data
      set({ myStartups: results })
    } catch (error) {
      console.error('fetchMyStartups error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch your startups')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchStartup: async (id) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get(`/startups/${id}`)
      set({ currentStartup: res.data, selectedStartupId: id })
    } catch (error) {
      console.error('fetchStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch startup')
    } finally {
      set({ isLoading: false })
    }
  },

  createStartup: async (data) => {
    set({ isCreating: true })
    try {
      const res = await axiosInstance.post('/startups', data)
      toast.success('Startup created')
      // refresh list
      get().fetchStartups()
      get().fetchMyStartups()
      return res.data
    } catch (error) {
      console.error('createStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to create startup')
      throw error
    } finally {
      set({ isCreating: false })
    }
  },

  updateStartup: async (id, data) => {
    set({ isUpdating: true })
    try {
      const res = await axiosInstance.put(`/startups/${id}`, data)
      toast.success('Startup updated')
      get().fetchStartups()
      get().fetchMyStartups()
      return res.data
    } catch (error) {
      console.error('updateStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to update startup')
      throw error
    } finally {
      set({ isUpdating: false })
    }
  },

  deleteStartup: async (id) => {
    set({ isDeleting: true })
    try {
      await axiosInstance.delete(`/startups/${id}`)
      toast.success('Startup deleted')
      get().fetchStartups()
      get().fetchMyStartups()
    } catch (error) {
      console.error('deleteStartup error:', error)
      toast.error(error.response?.data?.message || 'Failed to delete startup')
      throw error
    } finally {
      set({ isDeleting: false })
    }
  },

  uploadPitchDeck: async (startupId, file) => {
    set({ isUploading: true })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axiosInstance.post(`/startups/${startupId}/pitch-deck`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Pitch deck uploaded')
      // update current startup if it's the same
      if (get().selectedStartupId === startupId) get().fetchStartup(startupId)
      return res.data
    } catch (error) {
      console.error('uploadPitchDeck error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload pitch deck')
      throw error
    } finally {
      set({ isUploading: false })
    }
  },

  uploadDemoVideo: async (startupId, file) => {
    set({ isUploading: true })
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await axiosInstance.post(`/startups/${startupId}/demo-video`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      toast.success('Demo video uploaded')
      if (get().selectedStartupId === startupId) get().fetchStartup(startupId)
      return res.data
    } catch (error) {
      console.error('uploadDemoVideo error:', error)
      toast.error(error.response?.data?.message || 'Failed to upload video')
      throw error
    } finally {
      set({ isUploading: false })
    }
  },

  getTeam: async (startupId) => {
    try {
      const res = await axiosInstance.get(`/startups/${startupId}/team`)
      return res.data.team
    } catch (error) {
      console.error('getTeam error:', error)
      toast.error(error.response?.data?.message || 'Failed to get team')
      throw error
    }
  },

  addTeamMember: async (startupId, userId) => {
    try {
      const res = await axiosInstance.post(`/startups/${startupId}/team`, { userId })
      toast.success('Team member added')
      if (get().selectedStartupId === startupId) get().fetchStartup(startupId)
      return res.data
    } catch (error) {
      console.error('addTeamMember error:', error)
      toast.error(error.response?.data?.message || 'Failed to add team member')
      throw error
    }
  },

  removeTeamMember: async (startupId, userId) => {
    try {
      const res = await axiosInstance.delete(`/startups/${startupId}/team/${userId}`)
      toast.success('Team member removed')
      if (get().selectedStartupId === startupId) get().fetchStartup(startupId)
      return res.data
    } catch (error) {
      console.error('removeTeamMember error:', error)
      toast.error(error.response?.data?.message || 'Failed to remove team member')
      throw error
    }
  },

  searchStartups: async (q) => {
    try {
      const res = await axiosInstance.get('/startups/search', { params: { q } })
      return res.data
    } catch (error) {
      console.error('searchStartups error:', error)
      toast.error(error.response?.data?.message || 'Search failed')
      throw error
    }
  },

  fetchTrending: async () => {
    try {
      const res = await axiosInstance.get('/startups/trending')
      return res.data
    } catch (error) {
      console.error('fetchTrending error:', error)
      toast.error(error.response?.data?.message || 'Failed to fetch trending')
      throw error
    }
  },

  // local utilities
  selectStartup: (id) => {
    try {
      localStorage.setItem('upspark:selectedStartupId', id)
    } catch (e) {
      console.error('selectStartup error:', e)
    }
    set({ selectedStartupId: id })
  },

  toggleSave: (id) =>
    set((state) => {
      const next = state.savedIds.includes(id) ? state.savedIds.filter((s) => s !== id) : [...state.savedIds, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {
        console.error('toggleSave error:', e)
      }
      return { savedIds: next }
    }),
}))

export default useStartupStore
