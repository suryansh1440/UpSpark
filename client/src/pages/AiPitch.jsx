const AiPitch = () => {
  return (
    <div className="flex min-h-[70vh] items-center justify-center bg-slate-950 px-4 py-10 text-white">
      <div className="w-full max-w-3xl space-y-6 rounded-2xl border border-white/10 bg-white/5 p-8 shadow-2xl shadow-indigo-500/20">
        <div>
          <h1 className="text-2xl font-semibold">AI Pitch Analyzer</h1>
          <p className="text-sm text-slate-400">Upload your pitch deck and get instant feedback.</p>
        </div>
        <div className="rounded-2xl border border-dashed border-indigo-500/50 bg-indigo-500/5 px-6 py-10 text-center">
          <p className="text-sm text-slate-300">Drag & drop your pitch deck (PDF)</p>
          <button className="mt-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:border-white/30">
            Browse files
          </button>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <input
              placeholder="Startup one-liner"
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10"
            />
            <input
              placeholder="Target investor type"
              className="rounded-xl bg-white/5 px-3 py-2 text-sm text-white outline-none ring-1 ring-white/10"
            />
          </div>
        </div>
        <div className="flex justify-end">
          <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white">
            Analyze Pitch
          </button>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-300">Pitch Readiness</div>
              <div className="text-3xl font-semibold text-white">78 / 100</div>
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm text-white">
              {[
                ['Problem clarity', '8/10'],
                ['Market understanding', '7/10'],
                ['Financials', '6/10'],
                ['Competitive edge', '9/10'],
              ].map(([label, score]) => (
                <div key={label} className="rounded-xl bg-slate-900/70 px-3 py-2 ring-1 ring-white/10">
                  <div className="text-xs text-slate-400">{label}</div>
                  <div className="text-lg font-semibold">{score}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 space-y-2 text-sm text-slate-300">
            <div>• Add clear revenue projections for next 3 years.</div>
            <div>• Highlight defensibility vs competitors.</div>
            <div>• Clarify go-to-market strategy.</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AiPitch

