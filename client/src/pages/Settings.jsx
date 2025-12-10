const Settings = () => {
  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-[240px,1fr]">
        <div className="space-y-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white">
          {['Profile', 'Account', 'Notification Preferences'].map((item, idx) => (
            <button
              key={item}
              className={`block w-full rounded-xl px-3 py-2 text-left ${
                idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-transparent text-slate-200 hover:bg-white/5'
              }`}
            >
              {item}
            </button>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
          <div>
            <h3 className="text-lg font-semibold">Profile</h3>
            <p className="text-sm text-slate-400">Update your name, title, and links.</p>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            <div>
              <label className="text-sm text-slate-300">Name</label>
              <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div>
              <label className="text-sm text-slate-300">Title</label>
              <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div className="md:col-span-2">
              <label className="text-sm text-slate-300">Bio</label>
              <textarea className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div>
              <label className="text-sm text-slate-300">LinkedIn</label>
              <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
            <div>
              <label className="text-sm text-slate-300">Website</label>
              <input className="mt-1 w-full rounded-xl bg-white/5 px-3 py-2 text-sm outline-none ring-1 ring-white/10 focus:ring-indigo-400/50" />
            </div>
          </div>
          <div className="flex justify-end">
            <button className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 px-5 py-2 text-sm font-semibold text-white">
              Save changes
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings

