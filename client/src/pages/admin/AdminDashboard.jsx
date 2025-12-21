import React from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import useAdminStore from '../../store/useAdminStore'
import { adminHighlights } from '../../data/mockData'
import NotAllowed from '../../components/NotAllowed'
import { Loader } from 'lucide-react'

const AdminDashboard = () => {
  const { user } = useAuthStore()
  // require an authenticated user with activeRole 'admin'
  if (!user || user.activeRole !== 'admin') {
    return <NotAllowed message="Admin access only." />
  }

  return (
    <div className="space-y-6 text-white">
      <div>
        <h1 className="text-2xl font-semibold">Admin Overview</h1>
        <p className="text-sm text-slate-400">Monitor users, startups, and system health.</p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        {[
          ['Total users', adminHighlights.users],
          ['Active startups', adminHighlights.startups],
          ['Funding requests', adminHighlights.funding],
          ['Reports', adminHighlights.reports],
        ].map(([label, value]) => (
          <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="text-xs text-slate-400">{label}</div>
            <div className="text-2xl font-semibold">{value}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-lg font-semibold">Users per role (sample)</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            {[
              ['Founders', '620'],
              ['Investors', '180'],
              ['Advisors', '110'],
              ['Collaborators', '330'],
            ].map(([role, count]) => (
              <div key={role} className="flex items-center gap-2">
                <div className="h-2 w-40 rounded-full bg-indigo-500/20">
                  <div className="h-2 w-24 rounded-full bg-indigo-500" />
                </div>
                <div className="text-sm">{role}</div>
                <div className="text-xs text-slate-400">{count}</div>
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
              <button onClick={() => window.open(`/startups/${item._id}`, '_blank')} className="rounded-lg border border-white/10 px-3 py-1 text-white">View</button>
              <button disabled={isUpdating} onClick={() => verifyStartup(item._id)} className={`rounded-lg px-3 py-1 text-white ${isUpdating ? 'bg-indigo-500/30 cursor-not-allowed' : 'bg-indigo-500/80'}`}>{isUpdating ? 'Processing...' : 'Verify'}</button>
              <button disabled={isUpdating} onClick={() => rejectStartup(item._id)} className={`rounded-lg px-3 py-1 text-white ${isUpdating ? 'border-white/10 cursor-not-allowed border' : 'border border-white/10'}`}>Reject</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

