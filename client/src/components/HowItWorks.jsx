import { howItWorks } from '../data/mockData'

const HowItWorks = () => (
  <section id="how-it-works" className="bg-slate-950 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">How it works</h2>
        <p className="text-sm text-slate-400">3 simple steps to get started</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {howItWorks.map((item, index) => (
          <div
            key={item.title}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-lg shadow-indigo-500/5 transition hover:-translate-y-1 hover:border-indigo-400/40"
          >
            <div className="mb-4 flex items-center justify-between">
              <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-100">
                Step {index + 1}
              </div>
              <span className="text-xs uppercase tracking-wide text-slate-400">{item.icon}</span>
            </div>
            <h3 className="text-lg font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default HowItWorks

