import { testimonials } from '../data/mockData'

const Testimonials = () => (
  <section className="bg-slate-950 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Success stories</h2>
        <p className="text-sm text-slate-400">What our community is saying</p>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {testimonials.map((item) => (
          <article
            key={item.name}
            className="rounded-2xl border border-white/6 bg-gradient-to-b from-slate-900/70 to-slate-900/50 p-6 text-white shadow-lg transition-transform transform hover:-translate-y-2 hover:shadow-indigo-600/20"
            aria-label={`Testimonial from ${item.name}`}
          >
            <svg
              className="mb-3 h-6 w-6 text-indigo-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M9.5 6.5C7 6.5 5 8.9 5 12s2 5.5 4.5 5.5h.5v-3.5H8.5V12c0-1.1.9-2 2-2h1V6.5H9.5zM18.5 6.5C16 6.5 14 8.9 14 12s2 5.5 4.5 5.5h.5v-3.5h-1.5V12c0-1.1.9-2 2-2h1V6.5h-2.5z" />
            </svg>

            <p className="text-lg md:text-xl italic leading-relaxed text-slate-100">“{item.quote}”</p>

            <div className="mt-5 flex items-center gap-3">
              <div className="ml-1">
                <div className="text-sm font-semibold text-white">{item.name}</div>
                <div className="text-xs text-slate-400">{item.role}</div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  </section>
)

export default Testimonials

