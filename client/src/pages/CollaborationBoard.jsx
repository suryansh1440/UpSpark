const opportunities = [
  {
    title: 'Looking for React Developer for AI SaaS',
    startup: 'NovaAI',
    description: 'Build chat, analytics and admin surfaces for enterprise customers.',
    skills: ['React', 'Node', 'ML'],
    commitment: 'Part-time',
    location: 'Remote',
  },
  {
    title: 'Co-founder (BizOps) for Agri marketplace',
    startup: 'FarmLink',
    description: 'Own partnerships with FPOs and demand-side channels.',
    skills: ['BizOps', 'B2B', 'Partnerships'],
    commitment: 'Full-time',
    location: 'Hybrid - Pune',
  },
]

const CollaborationBoard = () => {
  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Collaboration Board</h1>
            <p className="text-sm text-slate-400">Find co-founders, builders, and advisors.</p>
          </div>
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-semibold text-white">
            + Post Opportunity
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {['Role needed', 'Skill tags', 'Commitment'].map((filter) => (
            <button
              key={filter}
              className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
            >
              {filter}
            </button>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1fr,300px]">
          <div className="space-y-3">
            {opportunities.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-lg font-semibold">{item.title}</div>
                    <div className="text-xs text-slate-400">{item.startup}</div>
                  </div>
                  <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">{item.commitment}</div>
                </div>
                <p className="mt-2 text-sm text-slate-300">{item.description}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-300">
                  {item.skills.map((skill) => (
                    <span key={skill} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
                      {skill}
                    </span>
                  ))}
                </div>
                <div className="mt-3 flex gap-3">
                  <button className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white">View Details</button>
                  <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-indigo-400/40">
                    Apply / Show Interest
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-4">
            <h3 className="text-lg font-semibold">My Applications</h3>
            <div className="space-y-2 text-sm text-slate-300">
              <div className="rounded-xl bg-slate-900/70 px-3 py-2">Applied: React Developer @ NovaAI</div>
              <div className="rounded-xl bg-slate-900/70 px-3 py-2">Posted: Growth Marketer @ HealConnect</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaborationBoard

