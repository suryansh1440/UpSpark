import React from 'react'
import { useNavigate } from 'react-router-dom'
import useStartupStore from '../../store/useStartupStore'

const MyStartups = () => {
  const navigate = useNavigate()
  const myStartups = useStartupStore((s) => s.myStartups)
  const fetchMyStartups = useStartupStore((s) => s.fetchMyStartups)
  const deleteStartup = useStartupStore((s) => s.deleteStartup)

  const [deletingId, setDeletingId] = React.useState(null)

  React.useEffect(() => {
    fetchMyStartups()
  }, [fetchMyStartups])

  const onDelete = async (id) => {
    const ok = window.confirm('Delete this startup? This action cannot be undone.')
    if (!ok) return
    try {
      setDeletingId(id)
      await deleteStartup(id)
    } catch (e) {
      console.error('delete error:', e)
      // errors handled in store
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="space-y-6 text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Startups</h1>
          <p className="text-sm text-slate-400">Create and manage your startups.</p>
        </div>
        <div>
          <button onClick={() => navigate('new')} className="rounded-xl bg-indigo-500/90 px-4 py-2 text-white">Create Startup</button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {myStartups.length === 0 && <div className="text-slate-400">You don't have any startups yet.</div>}
        {myStartups.map((s) => (
          <div key={s._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-lg font-semibold">{s.name}</div>
                  {s.isVerified ? (
                    <span className="rounded-full bg-green-600/80 px-2 py-0.5 text-xs font-medium">Verified</span>
                  ) : (
                    <span className="rounded-full bg-yellow-500/80 px-2 py-0.5 text-xs font-medium">Pending</span>
                  )}
                </div>
                <div className="text-xs text-slate-400">{s.industry} • {s.stage}</div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => navigate(`${s._id}/edit`)} className="rounded-lg border border-white/10 px-3 py-1 text-white">Edit</button>
                <button onClick={() => navigate(`/dashboard/startup/${s._id}`)} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View</button>
                <button disabled={deletingId === s._id} onClick={() => onDelete(s._id)} className={`rounded-lg px-3 py-1 ${deletingId === s._id ? 'bg-red-500/40 cursor-not-allowed' : 'bg-red-600/90'}`}>
                  {deletingId === s._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-300">{s.tagline}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyStartups
