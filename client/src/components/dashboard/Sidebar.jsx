import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Rocket,
  HandCoins,
  MessageSquare,
  Users,
  Bell,
  Settings,
  Gauge,
  Bot,
} from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/dashboard/investor', label: 'Investor View', icon: Gauge },
  { to: '/dashboard/startups', label: 'My Startup', icon: Rocket },
  { to: '/dashboard/funding', label: 'Funding', icon: HandCoins },
  { to: '/dashboard/collaboration', label: 'Collaboration Board', icon: Users },
  { to: '/dashboard/messages', label: 'Messages', icon: MessageSquare },
  { to: '/dashboard/ai-pitch', label: 'AI Pitch Analyzer', icon: Bot },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell },
  { to: '/dashboard/admin', label: 'Admin', icon: Gauge },
]

const Sidebar = () => {
  return (
    <aside className="hidden h-full w-64 flex-col border-r border-white/5 bg-slate-950/80 p-4 backdrop-blur md:flex">
      <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-bold">
          INT
        </span>
        <div>
          <div>INT222</div>
          <div className="text-xs text-slate-400">Founder OS</div>
        </div>
      </div>
      <nav className="space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition ${
                  isActive ? 'bg-white/10 text-white ring-1 ring-indigo-400/50' : 'text-slate-300 hover:bg-white/5'
                }`
              }
            >
              <Icon size={18} className="text-indigo-200" />
              <span>{item.label}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}

export default Sidebar

