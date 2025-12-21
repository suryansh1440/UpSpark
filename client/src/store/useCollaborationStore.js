import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'
import { toast } from 'react-hot-toast'

const useCollaborationStore = create((set, get) => ({
  posts: [],
  myPosts: [],
  selectedPost: null,
  applications: {}, // map postId -> applications array

  // loaders
  isLoading: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  isApplying: false,

  fetchPosts: async (params = {}) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/collaboration', { params })
      // support both paginated and direct list
      const results = res.data.results || res.data
      set({ posts: results })
    } catch (err) {
      console.error('fetchPosts error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch posts')
    } finally {
      set({ isLoading: false })
    }
  },

  fetchMyPosts: async () => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get('/collaboration/mine')
      set({ myPosts: res.data.results || res.data })
    } catch (err) {
      console.error('fetchMyPosts error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch your posts')
    } finally {
      set({ isLoading: false })
    }
  },

  createPost: async (payload) => {
    set({ isCreating: true })
    try {
      // avoid sending empty startup strings which can cause server cast errors
      const body = { ...payload }
      if (body.startup === '' || body.startup === null || body.startup === undefined) delete body.startup
      const res = await axiosInstance.post('/collaboration', body)
      toast.success('Post created')
      set((s) => ({ posts: [res.data, ...s.posts], myPosts: [res.data, ...s.myPosts] }))
      return res.data
    } catch (err) {
      console.error('createPost error:', err)
      toast.error(err.response?.data?.message || 'Failed to create post')
      throw err
    } finally {
      set({ isCreating: false })
    }
  },

  updatePost: async (id, payload) => {
    set({ isUpdating: true })
    try {
      const body = { ...payload }
      if (body.startup === '' || body.startup === null || body.startup === undefined) delete body.startup
      const res = await axiosInstance.put(`/collaboration/${id}`, body)
      toast.success('Post updated')
      set((s) => ({ posts: s.posts.map((p) => (String(p._id) === String(id) ? res.data : p)), myPosts: s.myPosts.map((p) => (String(p._id) === String(id) ? res.data : p)) }))
      return res.data
    } catch (err) {
      console.error('updatePost error:', err)
      toast.error(err.response?.data?.message || 'Failed to update post')
      throw err
    } finally {
      set({ isUpdating: false })
    }
  },

  deletePost: async (id) => {
    set({ isDeleting: true })
    try {
      await axiosInstance.delete(`/collaboration/${id}`)
      toast.success('Post deleted')
      set((s) => ({ posts: s.posts.filter((p) => String(p._id) !== String(id)), myPosts: s.myPosts.filter((p) => String(p._id) !== String(id)) }))
    } catch (err) {
      console.error('deletePost error:', err)
      toast.error(err.response?.data?.message || 'Failed to delete post')
      throw err
    } finally {
      set({ isDeleting: false })
    }
  },

  applyToPost: async (postId, { message }) => {
    set({ isApplying: true })
    try {
      const res = await axiosInstance.post(`/collaboration/${postId}/apply`, { message })
      toast.success('Applied')
      // optionally update posts cache to reflect application
      return res.data
    } catch (err) {
      console.error('applyToPost error:', err)
      toast.error(err.response?.data?.message || 'Failed to apply')
      throw err
    } finally {
      set({ isApplying: false })
    }
  },

  fetchApplications: async (postId) => {
    try {
      const res = await axiosInstance.get(`/collaboration/${postId}/applications`)
      set((s) => ({ applications: { ...s.applications, [postId]: res.data.applications } }))
      return res.data.applications
    } catch (err) {
      console.error('fetchApplications error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch applications')
      throw err
    }
  },

  fetchMyApplications: async () => {
    try {
      const res = await axiosInstance.get('/collaboration/applications/mine')
      const results = res.data.results || res.data
      set({ myApplications: results })
      return results
    } catch (err) {
      console.error('fetchMyApplications error:', err)
      toast.error(err.response?.data?.message || 'Failed to fetch your applications')
      throw err
    }
  },

  acceptApplication: async (postId, appId) => {
    try {
      const res = await axiosInstance.put(`/collaboration/${postId}/applications/${appId}/accept`)
      // update cache
      set((s) => {
        const apps = (s.applications[postId] || []).map((a) => (String(a._id) === String(appId) ? res.data : a))
        return { applications: { ...s.applications, [postId]: apps } }
      })
      toast.success('Application accepted')
      return res.data
    } catch (err) {
      console.error('acceptApplication error:', err)
      toast.error(err.response?.data?.message || 'Failed to accept application')
      throw err
    }
  },

  rejectApplication: async (postId, appId) => {
    try {
      const res = await axiosInstance.put(`/collaboration/${postId}/applications/${appId}/reject`)
      set((s) => {
        const apps = (s.applications[postId] || []).map((a) => (String(a._id) === String(appId) ? res.data : a))
        return { applications: { ...s.applications, [postId]: apps } }
      })
      toast.success('Application rejected')
      return res.data
    } catch (err) {
      console.error('rejectApplication error:', err)
      toast.error(err.response?.data?.message || 'Failed to reject application')
      throw err
    }
  },

  selectPost: (post) => set({ selectedPost: post }),
  clearSelection: () => set({ selectedPost: null }),
}))

export default useCollaborationStore
