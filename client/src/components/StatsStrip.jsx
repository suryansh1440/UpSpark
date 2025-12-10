import { heroStats } from '../data/mockData'

const StatsStrip = () => (
  <section className="border-y border-white/10 bg-slate-900/60">
    <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 px-4 py-6 text-center text-white md:grid-cols-3 lg:grid-cols-6">
      {heroStats.map((stat) => (
        <div key={stat.label} className="rounded-lg bg-white/5 px-4 py-3 ring-1 ring-white/10">
          <div className="text-2xl font-semibold">{stat.value}</div>
          <div className="text-xs uppercase tracking-wide text-slate-400">{stat.label}</div>
        </div>
      ))}
    </div>
  </section>
)

export default StatsStrip

