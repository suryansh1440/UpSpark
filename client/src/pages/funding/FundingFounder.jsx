import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'
import useFundingStore from '../../store/useFundingStore'

const FundingFounder = () => {
  const { user } = useAuthStore()
  const requests = useFundingStore((s) => s.founderRequests)
  const setStatus = useFundingStore((s) => s.updateFounderRequestStatus)
  if (!user || user.activeRole !== 'founder') {
    return <NotAllowed message="Funding (founder) is only for founders." />
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-3">
        {['Incoming Requests', 'Sent Requests'].map((tab, idx) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 text-sm ${idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-5 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div>Investor</div>
          <div>Startup</div>
          <div>Amount</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        {requests.map((row) => (
          <div key={row.investor} className="grid grid-cols-5 items-center px-4 py-3 text-sm text-white">
            <div>{row.investor}</div>
            <div className="text-slate-300">{row.startup}</div>
            <div>{row.amount}</div>
            <div className="text-indigo-200">{row.status}</div>
            <div className="flex justify-end gap-2 text-xs">
              <button className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View</button>
              <button onClick={() => setStatus(row.investor, 'Accepted')} className="rounded-lg border border-white/10 px-3 py-1 text-white">Accept</button>
              <button onClick={() => setStatus(row.investor, 'Rejected')} className="rounded-lg border border-white/10 px-3 py-1 text-white">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FundingFounder

