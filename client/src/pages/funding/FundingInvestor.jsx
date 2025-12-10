import { useSelector, useDispatch } from 'react-redux'
import NotAllowed from '../../components/NotAllowed'
import { updateInvestorRequestStatus } from '../../store/fundingSlice'

const FundingInvestor = () => {
  const user = useSelector((state) => state.auth.currentUser)
  const requests = useSelector((state) => state.funding.investorRequests)
  const dispatch = useDispatch()

  if (user && user.role !== 'investor') {
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
              <button onClick={() => dispatch(updateInvestorRequestStatus({ startup: row.startup, status: 'Viewed' }))} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View Pitch</button>
              <button onClick={() => dispatch(updateInvestorRequestStatus({ startup: row.startup, status: 'Chat opened' }))} className="rounded-lg border border-white/10 px-3 py-1 text-white">Open Chat</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FundingInvestor

