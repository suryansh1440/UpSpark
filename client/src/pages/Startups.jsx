import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { toggleSave, selectStartup } from '../store/startupSlice'
import { startups } from '../data/mockData'

const Startups = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const saved = useSelector((state) => state.startup.savedIds)

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
          {startups.map((startup) => (
            <div key={startup.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 ring-1 ring-white/5">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-80" />
                  <div>
                    <div className="text-lg font-semibold">{startup.name}</div>
                    <div className="text-xs text-slate-400">{startup.location}</div>
                  </div>
                </div>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{startup.stage}</span>
              </div>
              <p className="mt-3 text-sm text-slate-300">{startup.tagline}</p>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-300">
                {startup.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-400">
                <span>Funding: {startup.fundingRequired}</span>
                <span>Team: {startup.teamSize}</span>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => {
                    dispatch(selectStartup(startup.id))
                    navigate(`/startups/${startup.id}`)
                  }}
                  className="flex-1 rounded-xl bg-indigo-500/90 px-4 py-2 text-center text-sm font-semibold text-white transition hover:brightness-110"
                >
                  View Profile
                </button>
                <button
                  onClick={() => dispatch(toggleSave(startup.id))}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                  {saved.includes(startup.id) ? 'Saved' : 'Save'}
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

