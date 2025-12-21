import { Link, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Rocket,
  HandCoins,
  
  Users,
  Bell,
  Settings,
  Gauge,
  Bot,
  GraduationCap,
  Sparkles,
} from 'lucide-react'
import { useAuthStore } from '../../store/useAuthStore'
import { useEffect } from 'react'
import useNotificationStore from '../../store/useNotificationStore'

const navItems = [
  { to: '/dashboard/founder', label: 'Founder Dashboard', icon: LayoutDashboard, roles: ['founder'] },
  { to: '/dashboard/investor', label: 'Investor Dashboard', icon: Gauge, roles: ['investor'] },
  // Mentor role removed
  { to: '/dashboard/collaborator', label: 'Collaborator Dashboard', icon: Sparkles, roles: ['collaborator'] },
  { to: '/dashboard/admin', label: 'Admin Dashboard', icon: Gauge, roles: ['admin'] },
  { to: '/dashboard/startup', label: 'Explore Startups', icon: Rocket, roles: ['founder', 'investor', 'collaborator', 'admin'] },
  { to: '/dashboard/my-startup', label: 'My Startups', icon: Users, roles: ['founder'] },
  { to: '/dashboard/funding', label: 'Funding', icon: HandCoins, roles: ['founder'] },
  { to: '/dashboard/funding/investor', label: 'Funding (Investor)', icon: HandCoins, roles: ['investor'] },
  { to: '/dashboard/collaboration', label: 'Collaboration Board', icon: Users, roles: ['founder', 'investor', 'collaborator', 'admin'] },
  { to: '/dashboard/ai-pitch', label: 'AI Pitch Analyzer', icon: Bot, roles: ['founder', 'investor', 'admin'] },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['founder', 'investor', 'collaborator', 'admin'] },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, roles: ['founder', 'investor', 'collaborator', 'admin'] },
]

const Sidebar = () => {
  const {user, logout} = useAuthStore();
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const fetchUnreadCount = useNotificationStore((s) => s.fetchUnreadCount)
  useEffect(() => { fetchUnreadCount() }, [fetchUnreadCount])
  const navigate = useNavigate()
  return (
    <aside className="hidden h-full w-64 flex-col border-r border-white/5 bg-slate-950/80 p-4 backdrop-blur md:flex">
      <div className="mb-6 flex items-center gap-2 text-lg font-semibold text-white">  
          <Link to="/" className="flex items-center justify-center gap-2 text-xl font-semibold text-white">
          <img src="/logo.png" alt="UpSpark logo" className="h-8 w-auto sm:h-9 md:h-10" />
        </Link>
      </div>
      <nav className="space-y-1">
        {navItems
          .filter((item) => !item.roles || item.roles.includes(user?.activeRole))
          .map((item) => {
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
              <span className="flex items-center gap-2">
                <span>{item.label}</span>
                {item.to === '/dashboard/notifications' && unreadCount > 0 && (
                  <span className="ml-2 inline-flex items-center justify-center rounded-full bg-rose-500 px-2 py-0.5 text-xs font-semibold text-white">{unreadCount}</span>
                )}
              </span>
            </NavLink>
          )
        })}
      </nav>
      <div className="mt-auto pt-6">
              <button
                onClick={async () => { await logout(); navigate('/') }}
          className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/30 hover:bg-white/10"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

