// ...redux removed for startup state
import React from 'react'
import useStartupStore from '../../store/useStartupStore'
import NotAllowed from '../../components/NotAllowed'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import useInvestorStore from '../../store/useInvestorStore'

const filters = ['Industry', 'Stage', 'Location', 'Min Revenue', 'Traction']

const InvestorDashboard = () => {
  const { user } = useAuthStore()
  const saved = useStartupStore((s) => s.savedIds)
  const toggleSave = useStartupStore((s) => s.toggleSave)
  const startups = useStartupStore((s) => s.startups)
  const fetchStartups = useStartupStore((s) => s.fetchStartups)
  const navigate = useNavigate()
  const fetchMyFundingRequests = useInvestorStore((s) => s.fetchMyFundingRequests)
  const fundingRequests = useInvestorStore((s) => s.fundingRequests)
  const isLoadingRequests = useInvestorStore((s) => s.isLoading)

  React.useEffect(() => {
    fetchStartups()
    // also fetch investor's own requests for quick overview
    fetchMyFundingRequests()
  }, [fetchStartups])
  if (!user || user.activeRole !== 'investor') {
    return <NotAllowed message="This dashboard is for investors. Switch role to continue." />
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex flex-wrap items-center gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
          >
            {filter}
          </button>
        ))}
        <div className="ml-auto flex gap-2">
          <button onClick={() => navigate('watchlist')} className="rounded-xl bg-indigo-500/80 px-3 py-2 text-sm font-semibold">Watchlist</button>
          <button onClick={() => navigate('funding')} className="rounded-xl border border-white/10 px-3 py-2 text-sm">My Requests</button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
        <div className="grid gap-4 md:grid-cols-2">
          {startups.map((startup) => (
            <div key={startup._id || startup.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-indigo-500/10">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-80" />
                  <div>
                    <div className="text-lg font-semibold">{startup.name}</div>
                    <div className="text-xs text-slate-400">{startup.industry} • {startup.stage}</div>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{startup.fundingRequired}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{startup.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {(startup.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/dashboard/startup/${startup._id || startup.id}`)}
                  className="flex-1 rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                  View Details
                </button>
                <button
                  onClick={() => toggleSave(startup._id || startup.id)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                  {saved.includes(startup._id || startup.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold">Saved Startups</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              {['NovaAI', 'FarmLink', 'HealConnect'].map((item) => (
                <div key={item} className="rounded-xl bg-slate-900/70 px-3 py-2">{item}</div>
              ))}
            </div>
          </div>

          <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold">Recent Requests</h3>
            <div className="mt-3 space-y-3 text-sm text-slate-300">
              {isLoadingRequests && <div className="text-sm">Loading...</div>}
              {!isLoadingRequests && fundingRequests.length === 0 && <div className="text-sm">No requests sent yet.</div>}
              {fundingRequests.slice(0,3).map((r) => (
                <div key={r._id} className="rounded-xl bg-slate-900/70 px-3 py-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{r.startup?.name || 'Startup'}</div>
                      <div className="text-xs text-slate-400">${r.amount} • {new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div className={`text-xs rounded-full px-2 py-0.5 ${r.status === 'pending' ? 'bg-yellow-500/80' : r.status === 'withdrawn' ? 'bg-slate-600' : 'bg-green-600/80'}`}>{r.status}</div>
                  </div>
                </div>
              ))}
              {fundingRequests.length > 3 && <div className="text-xs text-slate-400">View all in <button onClick={() => navigate('funding')} className="text-indigo-300 underline">My Requests</button></div>}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorDashboard

