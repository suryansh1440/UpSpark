import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'
import useCollaborationStore from '../../store/useCollaborationStore'
import { useEffect } from 'react'

const CollaboratorDashboard = () => {
  const { user } = useAuthStore()
  if (!user || user.activeRole !== 'collaborator') {
    return <NotAllowed message="This dashboard is for collaborators." />
  }
  const posts = useCollaborationStore((s) => s.posts)
  // select the raw value so zustand's snapshot can be cached; default in render to avoid creating a new array each render
  const myApplications = useCollaborationStore((s) => s.myApplications)
  const openPost = useCollaborationStore((s) => s.selectPost)

  useEffect(() => {
    const s = useCollaborationStore.getState()
    // avoid re-fetching if we already have data (prevents repeated store updates)
    if (!s.posts || s.posts.length === 0) s.fetchPosts()
    if (!s.myApplications) s.fetchMyApplications()
  }, [])

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Opportunities</h3>
          <div className="text-sm text-slate-400">Showing latest opportunities</div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {posts.map((p) => (
            <div key={p._id} className="rounded-xl bg-slate-900/70 px-4 py-3 ring-1 ring-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">{p.title}</div>
                  <div className="text-xs text-slate-400">{p.startup?.name || p.postedBy?.name}</div>
                </div>
                <div className="text-xs text-indigo-200">{p.commitment}</div>
              </div>
              <div className="mt-2 text-sm text-slate-300 line-clamp-3">{p.description}</div>
              <div className="mt-3 flex items-center justify-between">
                <div className="flex gap-2 text-xs text-slate-300">
                  {(p.skillsRequired || []).slice(0, 3).map((s) => <span key={s} className="rounded-full bg-white/5 px-3 py-1">{s}</span>)}
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { openPost(p); window.location.hash = '#/collaboration' }} className="rounded-xl border border-white/10 px-3 py-1 text-xs">View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">My Applications</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            {(myApplications || []).length === 0 && <div className="text-slate-400">You haven't applied to any opportunities yet.</div>}
            {(myApplications || []).map((a) => (
              <div key={a.applicationId} className="rounded-xl bg-slate-900/70 px-3 py-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm">{a.postTitle}</div>
                    <div className="text-xs text-slate-400">{a.startup?.name || a.postedBy?.name}</div>
                  </div>
                  <div className="text-xs text-indigo-200">{a.status}</div>
                </div>
                <div className="mt-2 text-xs text-slate-300">{a.message || <span className="text-slate-400">—</span>}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Recommended Roles</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Frontend (React) • AI SaaS</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Product Design • HealthTech</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CollaboratorDashboard

