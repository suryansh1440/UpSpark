import { useAuthStore } from '../../store/useAuthStore'
import { fundingRequests } from '../../data/mockData'
import NotAllowed from '../../components/NotAllowed'
import { useNavigate } from 'react-router-dom'

const FounderDashboard = () => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  if (!user || user.activeRole !== 'founder') {
    return <NotAllowed message="This dashboard is for founders. Switch role to continue." />
  }

  return (
    <div className="space-y-6 text-white">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-indigo-500/10">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-400">Welcome back</p>
              <h2 className="text-2xl font-semibold">Suryansh</h2>
              <p className="text-sm text-slate-400">NovaAI • Seed Stage</p>
            </div>
            <div className="rounded-full bg-indigo-500/20 px-3 py-1 text-xs text-indigo-100">Profile 72%</div>
          </div>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {[
              ['Profile completeness', '72%'],
              ['Investors contacted', '18'],
              ['Meetings scheduled', '5'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl bg-slate-900/70 px-3 py-3 ring-1 ring-white/10">
                <div className="text-xs text-slate-400">{label}</div>
                <div className="text-xl font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 shadow-lg shadow-indigo-500/10">
          <h3 className="text-lg font-semibold">Quick Actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              ['Update Startup Profile', '/dashboard/my-startup'],
              ['Upload Pitch Deck', '/dashboard/funding'],
              ['Analyze Pitch with AI', '/dashboard/ai-pitch'],
              ['Post Collaboration Opportunity', '/dashboard/collaboration'],
            ].map(([label, path]) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-indigo-400/40 hover:text-white"
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Recent Funding Requests</h3>
            <button className="text-sm text-indigo-200 hover:text-white">View all</button>
          </div>
          <div className="mt-3 space-y-3">
            {fundingRequests.map((item) => (
              <div key={item.investor} className="flex items-center justify-between rounded-xl bg-slate-900/70 px-4 py-3">
                <div>
                  <div className="text-sm font-semibold">{item.investor}</div>
                  <div className="text-xs text-slate-400">{item.startup}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-slate-200">{item.amount}</div>
                  <div className="text-xs text-indigo-200">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        {/* Messages preview removed */}
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold">Upcoming events</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {[
            ['Advisor session with Priya', 'Friday, 4 PM'],
            ['Demo Day prep', 'Monday, 11 AM'],
            ['Investor follow-up', 'Tuesday, 6 PM'],
          ].map(([title, time]) => (
            <div key={title} className="rounded-xl bg-slate-900/70 px-4 py-3 ring-1 ring-white/10">
              <div className="text-sm font-semibold">{title}</div>
              <div className="text-xs text-slate-400">{time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FounderDashboard

