import { createSlice } from '@reduxjs/toolkit'
import { startups as mockStartups } from '../data/mockData'

const initialState = {
  list: mockStartups,
  savedIds: [],
  selectedId: null,
}

const startupSlice = createSlice({
  name: 'startup',
  initialState,
  reducers: {
    toggleSave(state, action) {
      const id = action.payload
      if (state.savedIds.includes(id)) {
        state.savedIds = state.savedIds.filter((s) => s !== id)
      } else {
        state.savedIds.push(id)
      }
    },
    selectStartup(state, action) {
      state.selectedId = action.payload
    },
  },
})

export const { toggleSave, selectStartup } = startupSlice.actions
export default startupSlice.reducer

