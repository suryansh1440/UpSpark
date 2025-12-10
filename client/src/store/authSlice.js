import { createSlice } from '@reduxjs/toolkit'
import { mockUsers } from '../data/mockData'

const initialState = {
  currentUser: null,
  isAuthenticated: false,
  users: mockUsers,
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginWithRole(state, action) {
      const role = action.payload
      const user = state.users.find((u) => u.role === role) || state.users[0]
      state.currentUser = user
      state.isAuthenticated = true
    },
    logout(state) {
      state.currentUser = null
      state.isAuthenticated = false
    },
    setRole(state, action) {
      if (state.currentUser) state.currentUser.role = action.payload
    },
  },
})

export const { loginWithRole, logout, setRole } = authSlice.actions
export default authSlice.reducer

