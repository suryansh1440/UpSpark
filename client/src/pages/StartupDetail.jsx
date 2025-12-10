import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { selectStartup, toggleSave } from '../store/startupSlice'
import { startups } from '../data/mockData'

const tabs = ['Overview', 'Team', 'Traction', 'Funding', 'Documents']

const StartupDetail = () => {
  const { id } = useParams()
  const dispatch = useDispatch()
  const saved = useSelector((state) => state.startup.savedIds)
  const startup = startups.find((s) => s.id === id) || startups[0]

  useEffect(() => {
    if (id) dispatch(selectStartup(id))
  }, [dispatch, id])

  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500" />
            <div>
              <div className="text-2xl font-semibold">{startup.name}</div>
              <div className="text-sm text-slate-400">{startup.industry} • {startup.location}</div>
              <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-300">
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-indigo-100">{startup.stage}</span>
                {startup.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
              Contact Founder
            </button>
            <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
              Request Meeting
            </button>
            <button
              onClick={() => dispatch(toggleSave(startup.id))}
              className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40"
            >
              {saved.includes(startup.id) ? 'Saved' : 'Save Startup'}
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 text-sm">
          {tabs.map((tab, idx) => (
            <button
              key={tab}
              className={`rounded-full px-4 py-2 ${idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr,320px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Overview</h3>
              <p className="mt-2 text-sm text-slate-300">
                Problem: Enterprise support teams struggle with noisy data and slow resolution times.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                Solution: NovaAI auto-triages tickets, drafts responses, and learns from resolutions to improve CSAT.
              </p>
              <p className="mt-2 text-sm text-slate-300">
                USP: Vertical LLM tuned for support data with SOC2-ready pipelines.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Traction</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {[
                  ['Monthly Active Users', '12.4k'],
                  ['Revenue', '$98k ARR'],
                  ['Growth', '22% MoM'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-slate-900/70 px-4 py-3 ring-1 ring-white/10">
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="text-lg font-semibold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <h3 className="text-lg font-semibold">Funding</h3>
              <p className="text-sm text-slate-300">Funding required: {startup.fundingRequired}</p>
              <p className="text-sm text-slate-300">Equity offered: 12%</p>
              <ul className="mt-3 space-y-2 text-sm text-slate-300">
                <li>• Team expansion (engineering, product)</li>
                <li>• GTM across US & India</li>
                <li>• Security & compliance</li>
              </ul>
            </div>
          </div>
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Founder</h3>
              <div className="mt-3 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-indigo-500/60" />
                <div>
                  <div className="text-sm font-semibold">Aisha Khan</div>
                  <div className="text-xs text-slate-400">LinkedIn • Bengaluru</div>
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Related Startups</h3>
              <div className="mt-3 space-y-3 text-sm text-slate-300">
                {['FinSight', 'HealConnect', 'FarmLink'].map((name) => (
                  <div key={name} className="rounded-xl bg-slate-900/70 px-3 py-2">
                    {name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StartupDetail

