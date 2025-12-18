import { Link } from 'react-router-dom'
import { startups } from '../data/mockData'
import { useAuthStore } from '../store/useAuthStore'


const TrendingStartups = () => {
  const {user} = useAuthStore();
  return (
  <section className="bg-slate-950 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Trending startups</h2>
        <Link to={user?("/dashboard/startups"):("/login")} className="text-sm font-semibold text-indigo-200 hover:text-white">
          View all →
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {startups.map((startup) => (
          <div
            key={startup.id}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-white ring-1 ring-white/5 transition hover:-translate-y-1 hover:border-indigo-400/40"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-500 opacity-80" />
                  <div>
                    <h3 className="text-lg font-semibold">{startup.name}</h3>
                    <p className="text-xs text-slate-400">{startup.industry} • {startup.stage}</p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-slate-300">{startup.tagline}</p>
              </div>
              <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{startup.highlight}</span>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-slate-300">
              {startup.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                  {tag}
                </span>
              ))}
              <span className="ml-auto text-xs text-slate-400">Funding: {startup.fundingRequired}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
)}

export default TrendingStartups

