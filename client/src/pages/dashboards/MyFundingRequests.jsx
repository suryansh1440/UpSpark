import React from 'react'
import useInvestorStore from '../../store/useInvestorStore'

const MyFundingRequests = () => {
  const fundingRequests = useInvestorStore((s) => s.fundingRequests)
  const fetchMyFundingRequests = useInvestorStore((s) => s.fetchMyFundingRequests)
  const withdrawFundingRequest = useInvestorStore((s) => s.withdrawFundingRequest)
  const isLoading = useInvestorStore((s) => s.isLoading)
  const isUpdating = useInvestorStore((s) => s.isUpdating)

  React.useEffect(() => {
    fetchMyFundingRequests()
  }, [fetchMyFundingRequests])

  if (isLoading) return <div className="text-white">Loading requests...</div>

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">My Funding Requests</h1>
        <p className="text-sm text-slate-400">Requests you've sent to founders.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {fundingRequests.length === 0 && <div className="text-slate-400">No funding requests yet.</div>}
        {fundingRequests.map((r) => (
          <div key={r._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{r.startup?.name || 'Startup'}</div>
                <div className="text-xs text-slate-400">{r.amount} • {new Date(r.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex gap-2 items-center">
                <div className={`rounded-full px-2 py-0.5 text-xs ${r.status === 'pending' ? 'bg-yellow-500/80' : r.status === 'withdrawn' ? 'bg-slate-600' : 'bg-green-600/80'}`}>{r.status}</div>
                {r.status === 'pending' && (
                  <button disabled={isUpdating} onClick={() => withdrawFundingRequest(r._id)} className={`rounded-lg px-3 py-1 ${isUpdating ? 'bg-red-500/40 cursor-not-allowed' : 'bg-red-600/90'}`}>{isUpdating ? 'Withdrawing...' : 'Withdraw'}</button>
                )}
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{r.message}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyFundingRequests
