import { Link } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const roleDashMap = {
  founder: '/dashboard',
  investor: '/dashboard/investor',
  mentor: '/dashboard/mentor',
  collaborator: '/dashboard/collaborator',
  admin: '/dashboard/admin',
}

const HeroSection = () => {
  const {user } = useAuthStore()
  const dashboardPath = user ? roleDashMap[user.activeRole] || '/dashboard' : null
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-violet-500/10" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-20 md:flex-row md:py-28">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200 ring-1 ring-white/10">
            New • AI Pitch Analyzer
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-6xl">
              Connect startups, investors & mentors — faster.
            </h1>
            <p className="text-lg text-slate-300 max-w-2xl">
              Showcase your startup, meet the right investors, and accelerate growth with AI-driven pitch scoring and curated introductions.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            {!user ? (<Link
              to="/login"
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1"
            >
              Get Started
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>):(<Link
              to={dashboardPath}
              className="inline-flex items-center gap-3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition transform hover:-translate-y-1"
            >
              Dashboard
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"/></svg>
            </Link>)}
            <Link
              to="/dashboard/startups"
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Startups
            </Link>
          </div>
          <div className="mt-4 text-sm text-slate-300">Trusted by founders and investors across India.</div>
          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              ✅ Verified founders
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              🔔 Smart notifications
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              ⚡ AI pitch scoring
            </span>
          </div>
        </div>
        <div className="flex-1">
          <div className="relative rounded-2xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-indigo-500/20">
            <div className="absolute -left-10 top-6 h-24 w-24 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="absolute -right-10 bottom-6 h-24 w-24 rounded-full bg-violet-500/20 blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3 text-sm text-white ring-1 ring-white/10">
                <div>
                  <div className="font-semibold">AI Pitch Readiness</div>
                  <div className="text-xs text-slate-400">Score from our automated analysis</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-semibold text-white">78</div>
                  <div className="text-xs text-indigo-200">/ 100</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  ['Problem clarity', '8/10'],
                  ['Market understanding', '7/10'],
                  ['Financials', '6/10'],
                  ['Competitive edge', '9/10'],
                ].map(([label, score]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-sm text-slate-200"
                  >
                    <div className="text-xs text-slate-400">{label}</div>
                    <div className="mt-1 text-lg font-semibold text-white">{score}</div>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-50">
                “Add clear revenue projections for the next 3 years and highlight defensibility.”
              </div>
              <div className="mt-2 flex justify-end">
                <Link to={user?"/dashboard/ai-pitch":"/login"} className="rounded-full bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white shadow-md hover:brightness-105">Analyze with AI</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

