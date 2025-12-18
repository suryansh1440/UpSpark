import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'
import useFundingStore from '../../store/useFundingStore'

const FundingInvestor = () => {
  const { user } = useAuthStore()
  const requests = useFundingStore((s) => s.investorRequests)
  const setStatus = useFundingStore((s) => s.updateInvestorRequestStatus)

  if (!user || user.activeRole !== 'investor') {
    return <NotAllowed message="Funding (investor) is only for investors." />
  }

  return (
    <div className="space-y-4 text-white">
      <div className="text-lg font-semibold">Funding Requests • Investor</div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-4 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div>Startup</div>
          <div>Date</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        {requests.map((row) => (
          <div key={row.startup} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-white">
            <div>{row.startup}</div>
            <div className="text-slate-300">{row.date}</div>
            <div className="text-indigo-200">{row.status}</div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => setStatus({ startup: row.startup, status: 'Viewed' })} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View Pitch</button>
              <button onClick={() => setStatus({ startup: row.startup, status: 'Chat opened' })} className="rounded-lg border border-white/10 px-3 py-1 text-white">Open Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FundingInvestor

