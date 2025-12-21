import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import useAdminStore from '../../store/useAdminStore'
import { adminHighlights } from '../../data/mockData'
import NotAllowed from '../../components/NotAllowed'
import { Loader } from 'lucide-react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, Legend } from 'recharts'
import { Link } from 'react-router-dom'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  const stats = useAdminStore((s) => s.stats)
  const fetchStats = useAdminStore((s) => s.fetchStats)
  const fetchUsers = useAdminStore((s) => s.fetchUsers)
  const users = useAdminStore((s) => s.users)

  // require an authenticated user with activeRole 'admin'
  if (!user || user.activeRole !== 'admin') {
    return <NotAllowed message="Admin access only." />
  }

  React.useEffect(() => {
    if (user && user.activeRole === 'admin') {
      fetchStats()
      fetchUsers(1, 6)
    }
  }, [user, fetchStats, fetchUsers])

  const highlights = {
    users: stats.totalUsers ?? adminHighlights.users,
    startups: stats.totalStartups ?? adminHighlights.startups,
    funding: stats.totalFundingRequests ?? adminHighlights.funding,
    reports: stats.totalReports ?? adminHighlights.reports,
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-slate-400">Monitor users, startups, and system health.</p>
      </div>

      <div className="flex gap-2">
        <a href="/dashboard/admin/users" className="rounded-full bg-white/5 px-4 py-2 text-sm text-indigo-100">Users</a>
        <a href="/dashboard/startup" className="rounded-full bg-white/5 px-4 py-2 text-sm text-indigo-100">Startups</a>
        <a href="/dashboard/admin" className="rounded-full bg-white/5 px-4 py-2 text-sm text-indigo-100">Funding</a>
        <a href="/dashboard/collaboration" className="rounded-full bg-white/5 px-4 py-2 text-sm text-indigo-100">Collaboration</a>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ['Total users', highlights.users],
          ['Active startups', highlights.startups],
          ['Funding requests', highlights.funding],
          ['Reports', highlights.reports],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      {/* Charts section using Recharts for a modern look */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-indigo-900/40 to-slate-900/30 p-4">
          <h3 className="text-lg font-semibold">Users by role</h3>
          <div className="h-40 mt-3">
            <AdminCharts type="users" users={users} stats={stats} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-cyan-900/30 to-slate-900/20 p-4 lg:col-span-2">
          <h3 className="text-lg font-semibold">Startups growth</h3>
          <div className="h-40 mt-3">
            <AdminCharts type="startups" stats={stats} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-lg font-semibold">Recent users</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            {users.length === 0 && <div className="text-sm">No users to show</div>}
            {users.map((u) => (
              <div key={u._id} className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2">
                <div>
                  <div className="font-semibold">{u.name || u.email}</div>
                  <div className="text-xs text-slate-400">{u.email} • {u.role}</div>
                </div>
                <div className="text-xs text-slate-200">{u.status || (u.isBlocked ? 'Blocked' : 'Active')}</div>
              </div>
            ))}
          </div>
        </div>
        <PendingStartups />
      </div>
    </div>
  )
}

export default AdminDashboard

function PendingStartups() {
  const { user } = useAuthStore()
  const pending = useAdminStore((s) => s.pendingStartups)
  const fetchPending = useAdminStore((s) => s.fetchPending)
  const verifyStartup = useAdminStore((s) => s.verifyStartup)
  const rejectStartup = useAdminStore((s) => s.rejectStartup)
  const isLoading = useAdminStore((s) => s.isLoading)
  const isUpdating = useAdminStore((s) => s.isUpdating)

  React.useEffect(() => {
    if (user && user.activeRole === 'admin') fetchPending()
  }, [user, fetchPending])

  if (!user || user.activeRole !== 'admin') return null

  if (isLoading) return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold">Startups pending verification</h3>
      <div className="mt-3 flex items-center justify-center text-sm text-slate-200">
        <Loader className="animate-spin" />
      </div>
    </div>
  )

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <h3 className="text-lg font-semibold">Startups pending verification</h3>
      <div className="mt-3 space-y-3 text-sm text-slate-200">
        {pending.length === 0 && <div className="text-sm">No pending startups</div>}
        {pending.map((item) => (
          <div key={item._id} className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2">
            <div>
              <div className="font-semibold">{item.name}</div>
              <div className="text-xs text-slate-400">{item.industry} • {item.location}</div>
            </div>
            <div className="flex gap-2 text-xs">
              <Link to={`/dashboard/startup/${item._id}`} className="rounded-lg border border-white/10 px-3 py-1 text-white">View</Link>
              <button disabled={isUpdating} onClick={() => verifyStartup(item._id)} className={`rounded-lg px-3 py-1 text-white ${isUpdating ? 'bg-indigo-500/30 cursor-not-allowed' : 'bg-indigo-500/80'}`}>{isUpdating ? 'Processing...' : 'Verify'}</button>
              <button disabled={isUpdating} onClick={() => rejectStartup(item._id)} className={`rounded-lg px-3 py-1 text-white ${isUpdating ? 'border-white/10 cursor-not-allowed border' : 'border border-white/10'}`}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Charts helper component
function AdminCharts({ type, users = [], stats = {} }) {
  // users by role (prefer server stats if available)
  const roles = ['founder', 'investor', 'collaborator', 'advisor']
  const usersByRole = stats.usersByRole
    ? roles.map((r) => ({ name: r, value: stats.usersByRole[r] || 0 }))
    : roles.map((r) => ({ name: r, value: users.filter((u) => {
        const role = (u.activeRole || (Array.isArray(u.roles) ? u.roles[0] : undefined) || '').toLowerCase()
        return role === r
      }).length }))

  // startups by month fallback (prefer server data)
  const startupsByMonth = stats.startupsByMonth || [
    { month: 'Jul', startups: 4 },
    { month: 'Aug', startups: 8 },
    { month: 'Sep', startups: 12 },
    { month: 'Oct', startups: 20 },
    { month: 'Nov', startups: 28 },
    { month: 'Dec', startups: stats.totalStartups || 32 },
  ]

  if (type === 'users') {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={usersByRole} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }} />
          <Bar dataKey="value" fill="#7c3aed" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    )
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={startupsByMonth} margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
        <defs>
          <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.9} />
            <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.1} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
        <XAxis dataKey="month" stroke="#94a3b8" />
        <YAxis stroke="#94a3b8" />
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.06)' }} />
        <Area type="monotone" dataKey="startups" stroke="#06b6d4" fillOpacity={1} fill="url(#grad)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}

