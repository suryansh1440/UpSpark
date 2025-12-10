import { useSelector } from 'react-redux'
import { adminHighlights } from '../../data/mockData'
import NotAllowed from '../../components/NotAllowed'

const AdminDashboard = () => {
  const user = useSelector((state) => state.auth.currentUser)
  if (user && user.role !== 'admin') {
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
              ['Mentors', '110'],
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
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h3 className="text-lg font-semibold">Startups pending verification</h3>
          <div className="mt-3 space-y-3 text-sm text-slate-200">
            {['FinSight', 'FarmLink', 'HealConnect'].map((item) => (
              <div key={item} className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2">
                <span>{item}</span>
                <div className="flex gap-2 text-xs">
                  <button className="rounded-lg border border-white/10 px-3 py-1 text-white">View</button>
                  <button className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">Verify</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard

