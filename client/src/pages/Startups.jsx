import React from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import useStartupStore from '../store/useStartupStore'
import { useAuthStore } from '../store/useAuthStore'
import useInvestorStore from '../store/useInvestorStore'
import { Loader } from 'lucide-react'

const Startups = () => {
  const navigate = useNavigate()
  const savedLocal = useStartupStore((s) => s.savedIds)
  const toggleSave = useStartupStore((s) => s.toggleSave)
  const selectStartup = useStartupStore((s) => s.selectStartup)
  const startups = useStartupStore((s) => s.startups)
  const fetchStartups = useStartupStore((s) => s.fetchStartups)
  const isLoading = useStartupStore((s) => s.isLoading)
  const location = useLocation()
  const { user } = useAuthStore()
  const watchlist = useInvestorStore((s) => s.watchlist)
  const addToWatchlist = useInvestorStore((s) => s.addToWatchlist)
  const removeFromWatchlist = useInvestorStore((s) => s.removeFromWatchlist)
  const fetchWatchlist = useInvestorStore((s) => s.fetchWatchlist)

  const openDetail = (id) => {
    if (location.pathname.startsWith('/dashboard')) {
      navigate(`/dashboard/startup/${id}`)
    } else {
      navigate(`/startups/${id}`)
    }
  }

  // fetch list on mount / when query changes
  React.useEffect(() => {
    fetchStartups()
  }, [location.key, fetchStartups])

  React.useEffect(() => {
    if (user && user.activeRole === 'investor') fetchWatchlist()
  }, [user, fetchWatchlist])

  if (isLoading) return (
    <div className="flex items-center justify-center h-48 text-white">
      <Loader className="animate-spin" />
    </div>
  )

  // hide founder's own startups from the public explore list
  const visibleStartups = (startups || []).filter((s) => {
    if (!user) return true
    if (user.activeRole !== 'founder') return true
    // if startup has founder id, compare to current user
    const founderId = s.founder?._id || s.founder?.id || s.founder
    return String(founderId) !== String(user._id)
  })

  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Browse Startups</h1>
            <p className="text-sm text-slate-400">Discover and filter promising teams.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Industry', 'Stage', 'Location', 'Sort: Trending'].map((filter) => (
              <button
                key={filter}
                className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {visibleStartups.length === 0 ? (
            <div className="p-6 text-slate-300">No startups to show.</div>
          ) : visibleStartups.map((startup) => (
            <div key={startup._id || startup.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-linear-to-br from-indigo-500 to-violet-500 opacity-80" />
                  <div>
                    <div className="text-lg font-semibold">{startup.name}</div>
                    <div className="text-xs text-slate-400">{startup.location || startup.location}</div>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{startup.stage}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{startup.tagline || startup.problem}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {(startup.tags || []).map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Funding: {startup.fundingRequired || '—'}</span>
                <span>Team: {startup.teamMembers ? startup.teamMembers.length : '—'}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                      selectStartup(startup._id || startup.id)
                      openDetail(startup._id || startup.id)
                    }}
                  className="flex-1 rounded-xl bg-indigo-500/90 px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
                >
                  View Profile
                </button>
                <button
                  onClick={() => {
                    // if investor, use server-backed watchlist
                    if (user && user.activeRole === 'investor') {
                      const exists = (watchlist || []).some((w) => String(w._id || w.id) === String(startup._id || startup.id))
                      if (exists) removeFromWatchlist(startup._id || startup.id)
                      else addToWatchlist(startup._id || startup.id)
                    } else {
                      toggleSave(startup._id || startup.id)
                    }
                  }}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                  {user && user.activeRole === 'investor' ? ((watchlist || []).some((w) => String(w._id || w.id) === String(startup._id || startup.id)) ? 'Saved' : 'Save') : (savedLocal.includes(startup._id || startup.id) ? 'Saved' : 'Save')}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Startups

