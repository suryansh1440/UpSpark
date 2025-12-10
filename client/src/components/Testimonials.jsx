import { testimonials } from '../data/mockData'

const Testimonials = () => (
  <section className="bg-slate-950 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Success stories</h2>
        <p className="text-sm text-slate-400">What our community is saying</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <div
            key={item.name}
            className="rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-lg shadow-indigo-500/5"
          >
            <p className="text-sm text-slate-200">“{item.quote}”</p>
            <div className="mt-4 text-sm font-semibold">{item.name}</div>
            <div className="text-xs text-slate-400">{item.role}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials

