// ...redux removed for startup state
import { startups } from '../../data/mockData'
import NotAllowed from '../../components/NotAllowed'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/useAuthStore'
import useStartupStore from '../../store/useStartupStore'

const filters = ['Industry', 'Stage', 'Location', 'Min Revenue', 'Traction']

const InvestorDashboard = () => {
  const { user } = useAuthStore()
  const saved = useStartupStore((s) => s.savedIds)
  const toggleSave = useStartupStore((s) => s.toggleSave)
  const navigate = useNavigate()
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
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr,280px]">
        <div className="grid gap-4 md:grid-cols-2">
          {startups.map((startup) => (
            <div key={startup.id} className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-lg shadow-indigo-500/10">
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
                {startup.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => navigate(`/dashboard/startups/${startup.id}`)}
                  className="flex-1 rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white transition hover:brightness-110">
                  View Details
                </button>
                <button
                  onClick={() => toggleSave(startup.id)}
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                  {saved.includes(startup.id) ? 'Saved' : 'Save'}
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="h-fit rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-lg font-semibold">Saved Startups</h3>
          <div className="mt-3 space-y-3 text-sm text-slate-300">
            {['NovaAI', 'FarmLink', 'HealConnect'].map((item) => (
              <div key={item} className="rounded-xl bg-slate-900/70 px-3 py-2">{item}</div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InvestorDashboard

