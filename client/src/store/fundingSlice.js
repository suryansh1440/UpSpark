import { createSlice } from '@reduxjs/toolkit'
import { fundingRequests } from '../data/mockData'

const initialState = {
  founderRequests: fundingRequests,
  investorRequests: [
    { startup: 'NovaAI', date: 'Jan 12', status: 'Pending' },
    { startup: 'HealConnect', date: 'Jan 09', status: 'Pitch shared' },
  ],
}

const fundingSlice = createSlice({
  name: 'funding',
  initialState,
  reducers: {
    updateFounderRequestStatus(state, action) {
      const { investor, status } = action.payload
      const req = state.founderRequests.find((r) => r.investor === investor)
      if (req) req.status = status
    },
    updateInvestorRequestStatus(state, action) {
      const { startup, status } = action.payload
      const req = state.investorRequests.find((r) => r.startup === startup)
      if (req) req.status = status
    },
  },
})

export const { updateFounderRequestStatus, updateInvestorRequestStatus } = fundingSlice.actions
export default fundingSlice.reducer

