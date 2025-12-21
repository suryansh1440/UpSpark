import React, { useEffect, useMemo } from 'react'
import { useAuthStore } from '../../store/useAuthStore'
import NotAllowed from '../../components/NotAllowed'
import { useNavigate } from 'react-router-dom'
import useStartupStore from '../../store/useStartupStore'
import useFundingStore from '../../store/useFundingStore'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar,
} from 'recharts'
import { Loader } from 'lucide-react'

export default function FounderDashboard() {
  const { user } = useAuthStore()
  const navigate = useNavigate()

  const myStartupsRaw = useStartupStore((s) => s.myStartups)
  const fetchMyStartups = useStartupStore((s) => s.fetchMyStartups)
  const startupLoading = useStartupStore((s) => s.isLoading)

  const founderRequestsRaw = useFundingStore((s) => s.founderRequests)
  const fetchFounderRequests = useFundingStore((s) => s.fetchFounderRequests)
  const fundingLoading = useFundingStore((s) => s.isLoading)

  const myStartups = Array.isArray(myStartupsRaw)
    ? myStartupsRaw
    : myStartupsRaw?.results || []

  const founderRequests = Array.isArray(founderRequestsRaw)
    ? founderRequestsRaw
    : founderRequestsRaw?.results || []

  const isLoading = startupLoading || fundingLoading

  if (!user || user.activeRole !== 'founder') {
    return <NotAllowed message="This dashboard is for founders. Switch role to continue." />
  }

  useEffect(() => {
    fetchMyStartups()
    fetchFounderRequests()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const primaryStartup = myStartups[0] || null
  const myStartupsCount = myStartups.length
  const pendingRequestsCount = founderRequests.filter(
    (r) => r.status === 'pending'
  ).length

  const fundingSeries = useMemo(() => {
    const months = 6
    const now = new Date()
    const buckets = {}

    for (let i = 0; i < months; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const label = d.toLocaleString('default', { month: 'short' })
      buckets[label] = 0
    }

    founderRequests.forEach((r) => {
      if (!r.createdAt) return
      const label = new Date(r.createdAt).toLocaleString('default', {
        month: 'short',
      })
      if (label in buckets) buckets[label] += Number(r.amount || 0)
    })

    return Object.entries(buckets).map(([month, amount]) => ({
      month,
      amount,
    }))
  }, [founderRequests])

  const tractionSeries = useMemo(() => {
    const months = 6
    const now = new Date()
    const base = primaryStartup?.traction?.users ?? 10
    const growth = (primaryStartup?.traction?.growthRate ?? 10) / 100

    let users = base
    const data = []

    for (let i = months - 1; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      data.push({
        month: d.toLocaleString('default', { month: 'short' }),
        users: Math.round(users),
      })
      users = users / (1 + growth)
    }

    return data
  }, [primaryStartup])

  const quickActions = Object.entries({
    'Update Startup Profile': '/dashboard/my-startup',
    'Upload Pitch Deck': '/dashboard/funding',
    'Analyze Pitch with AI': '/dashboard/ai-pitch',
    'Post Collaboration Opportunity': '/dashboard/collaboration',
  })

  const upcomingEvents = [
    { title: 'Advisor session with Priya', time: 'Friday, 4 PM' },
    { title: 'Demo Day prep', time: 'Monday, 11 AM' },
    { title: 'Investor follow-up', time: 'Tuesday, 6 PM' },
  ]

  return (
    <div className="space-y-6 text-white">
      {/* TOP CARDS */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <p className="text-sm text-slate-400">Welcome back</p>
          <h2 className="text-2xl font-semibold">{user.name || user.email}</h2>
          <p className="text-sm text-slate-400">
            {primaryStartup ? `${primaryStartup.name} • ${primaryStartup.stage}` : 'No startup yet'}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-3">
            <Stat label="Startups" value={myStartupsCount} />
            <Stat label="Pending Requests" value={pendingRequestsCount} />
            <Stat label="Profile %" value={user.profileCompleteness ?? 60} />
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
          <h3 className="font-semibold">Quick Actions</h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {quickActions.map(([label, path]) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="rounded-xl border border-white/10 bg-slate-900/60 px-4 py-3 text-left text-sm hover:border-indigo-400/40"
              >
                {label} →
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHARTS */}
      <div className="grid gap-4 md:grid-cols-2">
        <ChartCard title="Funding (last 6 months)">
          {isLoading ? (
            <Loader className="mx-auto animate-spin" />
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={fundingSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Area dataKey="amount" stroke="#06b6d4" fill="#06b6d420" />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </ChartCard>

        <ChartCard title="Traction (users)">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={tractionSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="users" fill="#7c3aed" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* FUNDING LIST */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold">Recent Funding Requests</h3>
        {founderRequests.length === 0 ? (
          <p className="text-sm text-slate-400">No funding requests yet</p>
        ) : (
          founderRequests.map((item) => (
            <div key={item._id} className="mt-3 flex justify-between rounded-xl bg-slate-900/70 px-4 py-3">
              <div>
                <div className="font-semibold">{item.investor?.name || 'Investor'}</div>
                <div className="text-xs text-slate-400">{item.startup?.name}</div>
              </div>
              <div className="text-right">
                <div>${item.amount}</div>
                <div className="text-xs text-indigo-200">{item.status}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* UPCOMING EVENTS */}
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="font-semibold">Upcoming Events</h3>
        <div className="mt-3 grid gap-3 md:grid-cols-3">
          {upcomingEvents.map((e) => (
            <div key={e.title} className="rounded-xl bg-slate-900/70 px-4 py-3">
              <div className="font-semibold">{e.title}</div>
              <div className="text-xs text-slate-400">{e.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ---------- helpers ---------- */

const Stat = ({ label, value }) => (
  <div className="rounded-xl bg-slate-900/70 px-3 py-3 text-center">
    <div className="text-xs text-slate-400">{label}</div>
    <div className="text-xl font-semibold">{value}</div>
  </div>
)

const ChartCard = ({ title, children }) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
    <h3 className="mb-3 font-semibold">{title}</h3>
    {children}
  </div>
)
