import { create } from 'zustand'

const STORAGE_KEY = 'upspark:savedStartups'

const readSaved = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch (e) {
    return []
  }
}

export const useStartupStore = create((set) => ({
  savedIds: readSaved(),
  selectedStartupId: null,

  toggleSave: (id) =>
    set((state) => {
      const next = state.savedIds.includes(id) ? state.savedIds.filter((s) => s !== id) : [...state.savedIds, id]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      } catch (e) {}
      return { savedIds: next }
    }),

  selectStartup: (id) => {
    try {
      // keep last selected id for quick access
      localStorage.setItem('upspark:selectedStartupId', id)
    } catch (e) {}
    return set({ selectedStartupId: id })
  },
}))

export default useStartupStore
