import { useParams } from 'react-router-dom'

const MentorProfile = () => {
  const { id } = useParams()
  const name = id || 'Mentor'

  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-6">
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="h-14 w-14 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500" />
          <div>
            <div className="text-2xl font-semibold capitalize">{name}</div>
            <div className="text-sm text-slate-400">Product & Growth Mentor • Remote</div>
            <div className="text-xs text-indigo-100 mt-1">⭐ 4.9 rating</div>
          </div>
          <button className="ml-auto rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">
            Request Session
          </button>
        </div>

        <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Bio</h3>
              <p className="mt-2 text-sm text-slate-300">
                12+ years scaling SaaS products across APAC and US. Previously led product at unicorn companies and now advising early stage founders.
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Expertise</h3>
              <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                {['Product strategy', 'AI/LLM', 'Growth', 'Fundraising'].map((tag) => (
                  <span key={tag} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <h3 className="text-lg font-semibold">Available slots</h3>
              <div className="mt-3 grid gap-3 md:grid-cols-3">
                {['Fri 4 PM', 'Sat 11 AM', 'Mon 6 PM'].map((slot) => (
                  <button
                    key={slot}
                    className="rounded-xl border border-white/10 bg-slate-900/70 px-3 py-2 text-sm text-white transition hover:border-indigo-400/40"
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold">Quick booking</h3>
            <div className="space-y-3 text-sm text-slate-300">
              <div>
                <label className="text-xs text-slate-400">Topic</label>
                <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
              </div>
              <div>
                <label className="text-xs text-slate-400">Startup / Role</label>
                <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
              </div>
              <button className="w-full rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white">Request Session</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MentorProfile

