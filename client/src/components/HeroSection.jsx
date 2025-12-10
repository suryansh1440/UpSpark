import { Link } from 'react-router-dom'

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-slate-900 to-violet-500/10" />
      <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 py-16 md:flex-row md:py-20">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-indigo-200 ring-1 ring-white/10">
            New • AI Pitch Analyzer
          </p>
          <div className="space-y-3">
            <h1 className="text-4xl font-bold leading-tight text-white md:text-5xl">
              Connect Startups, Investors & Mentors in One Place
            </h1>
            <p className="text-lg text-slate-300">
              Showcase your startup, meet the right investors, collaborate with mentors, and move faster with AI-driven insights.
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 md:justify-start">
            <Link
              to="/register"
              className="rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/30 transition hover:translate-y-0.5"
            >
              Get Started
            </Link>
            <Link
              to="/startups"
              className="rounded-lg border border-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/5"
            >
              Explore Startups
            </Link>
          </div>
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
                <span className="font-semibold">AI Pitch Readiness</span>
                <span className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">78 / 100</span>
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
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection

