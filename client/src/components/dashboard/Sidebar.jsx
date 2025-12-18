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

const navItems = [
  { to: '/dashboard/founder', label: 'Founder Dashboard', icon: LayoutDashboard, roles: ['founder'] },
  { to: '/dashboard/investor', label: 'Investor Dashboard', icon: Gauge, roles: ['investor'] },
  { to: '/dashboard/mentor', label: 'Mentor Dashboard', icon: GraduationCap, roles: ['mentor'] },
  { to: '/dashboard/collaborator', label: 'Collaborator Dashboard', icon: Sparkles, roles: ['collaborator'] },
  { to: '/dashboard/admin', label: 'Admin Dashboard', icon: Gauge, roles: ['admin'] },
  { to: '/dashboard/startups', label: 'Explore Startups', icon: Rocket, roles: ['founder', 'investor', 'mentor', 'collaborator', 'admin'] },
  { to: '/dashboard/funding', label: 'Funding', icon: HandCoins, roles: ['founder'] },
  { to: '/dashboard/funding/investor', label: 'Funding (Investor)', icon: HandCoins, roles: ['investor'] },
  { to: '/dashboard/collaboration', label: 'Collaboration Board', icon: Users, roles: ['founder', 'investor', 'collaborator', 'admin'] },
  { to: '/dashboard/ai-pitch', label: 'AI Pitch Analyzer', icon: Bot, roles: ['founder', 'investor', 'admin'] },
  { to: '/dashboard/settings', label: 'Settings', icon: Settings, roles: ['founder', 'investor', 'mentor', 'collaborator', 'admin'] },
  { to: '/dashboard/notifications', label: 'Notifications', icon: Bell, roles: ['founder', 'investor', 'mentor', 'collaborator', 'admin'] },
]

const Sidebar = () => {
  const {user, logout} = useAuthStore();
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
              <span>{item.label}</span>
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

