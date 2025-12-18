import { create } from 'zustand'
import { fundingRequests } from '../data/mockData'

export const useFundingStore = create((set) => ({
  founderRequests: fundingRequests,
  investorRequests: fundingRequests,

  updateFounderRequestStatus: ({ investor, status }) =>
    set((state) => ({
      founderRequests: state.founderRequests.map((r) => (r.investor === investor ? { ...r, status } : r)),
    })),

  updateInvestorRequestStatus: ({ startup, status }) =>
    set((state) => ({
      investorRequests: state.investorRequests.map((r) => (r.startup === startup ? { ...r, status } : r)),
    })),
}))

export default useFundingStore
