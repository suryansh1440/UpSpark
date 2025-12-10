import { Bell, Search, User } from 'lucide-react'
import { useSelector } from 'react-redux'

const Topbar = () => {
  const user = useSelector((state) => state.auth.currentUser)
  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/5 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search startups, people, or messages"
          className="w-full rounded-xl bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
        />
      </div>
      <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-indigo-400/50">
        <Bell size={16} />
        <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
      </button>
      <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
          <User size={16} />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">{user?.name ?? 'Guest'}</div>
          <div className="text-xs text-slate-400 capitalize">{user?.role ?? 'role'}</div>
        </div>
      </div>
    </div>
  )
}

export default Topbar

