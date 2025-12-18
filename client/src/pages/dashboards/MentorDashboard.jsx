import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'

const MentorDashboard = () => {
  const { user } = useAuthStore()
  if (!user || user.activeRole !== 'mentor') {
    return <NotAllowed message="This dashboard is for mentors." />
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Mentor Requests</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">NovaAI — Pitch review (Pending)</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">FarmLink — GTM session (Accepted)</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Scheduled Sessions</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Friday 4 PM — NovaAI</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Saturday 11 AM — HealConnect</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Availability</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <button className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-white">Set Availability</button>
            <button className="w-full rounded-xl border border-white/10 px-3 py-2 text-left text-white">Manage Slots</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Mentee Chat Preview</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Founder A: “Need pitch feedback”</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Founder B: “Can we move session?”</div>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Recommended Startups</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-300">
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">AI Copilot • Seed</div>
            <div className="rounded-xl bg-slate-900/70 px-3 py-2">Agri Marketplace • MVP</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-3 grid gap-2 text-sm text-slate-200">
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">Set Availability</button>
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">Review Requests</button>
            <button className="rounded-xl border border-white/10 px-4 py-2 text-left hover:border-indigo-400/50">Open Chats</button>
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="text-lg font-semibold">Notes</h3>
          <div className="mt-3 text-sm text-slate-300">Keep private notes for mentees and sessions.</div>
        </div>
      </div>
    </div>
  )
}

export default MentorDashboard

