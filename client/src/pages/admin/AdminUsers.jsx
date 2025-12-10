import { useSelector } from 'react-redux'
import NotAllowed from '../../components/NotAllowed'

const rows = [
  { name: 'Aisha Khan', role: 'Founder', status: 'Active' },
  { name: 'Rahul Verma', role: 'Investor', status: 'Verified' },
  { name: 'Lisa Mathew', role: 'Mentor', status: 'Active' },
]

const AdminUsers = () => {
  const user = useSelector((state) => state.auth.currentUser)
  if (user && user.role !== 'admin') {
    return <NotAllowed message="Admin access only." />
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-wrap items-center gap-3">
        {['All', 'Founders', 'Investors', 'Mentors', 'Blocked'].map((filter, idx) => (
          <button
            key={filter}
            className={`rounded-full px-4 py-2 text-sm ${idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}
          >
            {filter}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-4 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div>User</div>
          <div>Role</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        {rows.map((row) => (
          <div key={row.name} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-white">
            <div>{row.name}</div>
            <div className="text-slate-300">{row.role}</div>
            <div className="text-indigo-200">{row.status}</div>
            <div className="flex justify-end gap-2 text-xs">
              <button className="rounded-lg border border-white/10 px-3 py-1 text-white">View</button>
              <button className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">Verify</button>
              <button className="rounded-lg border border-white/10 px-3 py-1 text-white">Block</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminUsers

