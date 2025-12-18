const notifications = [
  { title: 'New funding request from Alpha Ventures', subtitle: 'Click to review.', time: '2h', type: 'Funding' },
  { title: 'System update', subtitle: 'Workspace synced', time: '1d', type: 'System' },
]

const Notifications = () => {
  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center gap-3">
          {['All', 'Funding', 'System'].map((filter, idx) => (
            <button
              key={filter}
              className={`rounded-full px-4 py-2 text-sm ${idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="space-y-3">
          {notifications.map((item) => (
            <div key={item.title} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 p-4">
              <div>
                <div className="text-sm font-semibold">{item.title}</div>
                <div className="text-xs text-slate-400">{item.subtitle}</div>
              </div>
              <div className="text-xs text-slate-400">{item.time} ago</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notifications

