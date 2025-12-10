const steps = [
  {
    title: 'Startup Info',
    fields: ['Startup Name', 'Logo upload', 'Tagline', 'Industry', 'Stage'],
  },
  {
    title: 'Problem & Solution',
    fields: ['Problem statement', 'Solution overview'],
  },
  {
    title: 'Funding Needs',
    fields: ['Funding required', 'Equity offered', 'Location', 'Website / demo link'],
  },
]

const Onboarding = () => {
  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold">Onboarding • Startup Founder</h1>
          <p className="text-sm text-slate-400">Complete the steps below. You can skip and finish later.</p>
        </div>
        <div className="h-2 w-full rounded-full bg-white/5">
          <div className="h-2 w-1/3 rounded-full bg-gradient-to-r from-indigo-500 to-violet-500" />
        </div>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-2xl border border-white/10 bg-white/5 p-5 ring-1 ring-white/5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-400">Step {index + 1}</div>
                  <h2 className="text-lg font-semibold">{step.title}</h2>
                </div>
                <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">In progress</div>
              </div>
              <div className="mt-3 grid gap-3 md:grid-cols-2">
                {step.fields.map((field) => (
                  <div key={field}>
                    <label className="text-sm text-slate-300">{field}</label>
                    <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/30">
            ← Back
          </button>
          <div className="flex gap-3">
            <button className="rounded-xl border border-white/10 px-4 py-2 text-sm font-semibold text-white hover:border-white/30">
              Skip for later
            </button>
            <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white">
              Save & Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Onboarding

