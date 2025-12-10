import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import startupReducer from './startupSlice'
import messageReducer from './messageSlice'
import fundingReducer from './fundingSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    startup: startupReducer,
    messages: messageReducer,
    funding: fundingReducer,
  },
})

export default store

