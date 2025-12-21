import React from 'react'
import { useNavigate } from 'react-router-dom'
import useInvestorStore from '../../store/useInvestorStore'

const InvestorWatchlist = () => {
  const navigate = useNavigate()
  const watchlist = useInvestorStore((s) => s.watchlist)
  const fetchWatchlist = useInvestorStore((s) => s.fetchWatchlist)
  const removeFromWatchlist = useInvestorStore((s) => s.removeFromWatchlist)
  const isLoading = useInvestorStore((s) => s.isLoading)
  const isDeleting = useInvestorStore((s) => s.isDeleting)

  React.useEffect(() => {
    fetchWatchlist()
  }, [fetchWatchlist])

  if (isLoading) return <div className="text-white">Loading watchlist...</div>

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">My Watchlist</h1>
        <p className="text-sm text-slate-400">Startups you've saved.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {watchlist.length === 0 && <div className="text-slate-400">Your watchlist is empty.</div>}
        {watchlist.map((s) => (
          <div key={s._id || s.id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">{s.name}</div>
                <div className="text-xs text-slate-400">{s.industry} • {s.stage}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`/dashboard/startup/${s._id || s.id}`)} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View</button>
                <button disabled={isDeleting} onClick={() => removeFromWatchlist(s._id || s.id)} className={`rounded-lg px-3 py-1 ${isDeleting ? 'bg-red-500/40 cursor-not-allowed' : 'bg-red-600/90'}`}>Remove</button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{s.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default InvestorWatchlist
