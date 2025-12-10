const mentors = [
  {
    name: 'Priya Nair',
    title: 'Product Lead, ex-Google',
    tags: ['Product', 'AI', 'Enterprise'],
    rating: 4.9,
    region: 'Bengaluru',
  },
  {
    name: 'David Lin',
    title: 'VC Scout',
    tags: ['Fundraising', 'Pitching'],
    rating: 4.7,
    region: 'Remote',
  },
  {
    name: 'Sarah Thomas',
    title: 'Head of Growth, SaaS',
    tags: ['Growth', 'B2B', 'GTM'],
    rating: 4.8,
    region: 'Austin',
  },
]

const Mentors = () => {
  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Mentors Directory</h1>
            <p className="text-sm text-slate-400">Book sessions with seasoned operators.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {['Domain', 'Experience', 'Region', 'Language'].map((filter) => (
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
          {mentors.map((mentor) => (
            <div key={mentor.name} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
                <div>
                  <div className="text-lg font-semibold">{mentor.name}</div>
                  <div className="text-xs text-slate-400">{mentor.title}</div>
                  <div className="text-xs text-indigo-100">⭐ {mentor.rating}</div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                {mentor.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-2 text-xs text-slate-400">{mentor.region}</div>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white">View Profile</button>
                <button className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                  Book Session
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Mentors

