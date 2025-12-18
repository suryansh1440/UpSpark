import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'

const CollaboratorDashboard = () => {
  const { user } = useAuthStore()
  if (!user || user.activeRole !== 'collaborator') {
    return <NotAllowed message="This dashboard is for collaborators." />
  }

  return (
    <div className="space-y-6 text-white">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Opportunities</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-2">
          {['React Developer @ NovaAI', 'Growth Marketer @ FarmLink', 'UI/UX @ HealConnect'].map((op) => (
            <div key={op} className="rounded-xl bg-slate-900/70 px-4 py-3 ring-1 ring-white/10">
              <div className="text-sm font-semibold">{op}</div>
              <div className="text-xs text-slate-400">Remote / Hybrid</div>
              <div className="mt-2 text-xs text-indigo-200">Apply</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Applications Status</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">NovaAI — Pending</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">HealConnect — Accepted</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Recommended Roles</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Frontend (React) • AI SaaS</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Product Design • HealthTech</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Chat Preview</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Founder: “Can you start this sprint?”</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Founder: “Share portfolio links.”</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">Update Portfolio</button>
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">Browse Opportunities</button>
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">View Applications</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Skills & Matches</h3>
          <div className="mt-3 text-sm text-slate-300">Add skills to improve AI matching.</div>
        </div>
      </div>
    </div>
  )
}

export default CollaboratorDashboard

