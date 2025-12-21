import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import useStartupStore from '../store/useStartupStore'
import { useAuthStore } from '../store/useAuthStore'
import useInvestorStore from '../store/useInvestorStore'
import { Loader } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useNavigate, useLocation } from 'react-router-dom'

// const tabs = ['Overview', 'Team', 'Traction', 'Funding', 'Documents']

const StartupDetail = () => {
  const { id } = useParams()
  // const saved = useStartupStore((s) => s.savedIds)
  const selectStartup = useStartupStore((s) => s.selectStartup)
  // const toggleSave = useStartupStore((s) => s.toggleSave)
  const startup = useStartupStore((s) => s.currentStartup)
  const fetchStartup = useStartupStore((s) => s.fetchStartup)
  // const uploadPitchDeck = useStartupStore((s) => s.uploadPitchDeck)
  // const uploadDemoVideo = useStartupStore((s) => s.uploadDemoVideo)
  const { user } = useAuthStore()
  // const watchlist = useInvestorStore((s) => s.watchlist)
  // const addToWatchlist = useInvestorStore((s) => s.addToWatchlist)
  // const removeFromWatchlist = useInvestorStore((s) => s.removeFromWatchlist)
  const fetchWatchlist = useInvestorStore((s) => s.fetchWatchlist)
  const sendFundingRequest = useInvestorStore((s) => s.sendFundingRequest)
  const fetchMyFundingRequests = useInvestorStore((s) => s.fetchMyFundingRequests)
  const fundingRequests = useInvestorStore((s) => s.fundingRequests)
  const withdrawFundingRequest = useInvestorStore((s) => s.withdrawFundingRequest)
  const isCreating = useInvestorStore((s) => s.isCreating)
  const isUpdating = useInvestorStore((s) => s.isUpdating)
  const [showFundingModal, setShowFundingModal] = useState(false)
  const [funding, setFunding] = useState({ amount: '', message: '' })
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    if (id) {
      selectStartup(id)
      fetchStartup(id)
      if (user && user.activeRole === 'investor') fetchWatchlist()
      if (user && user.activeRole === 'investor') fetchMyFundingRequests()
    }
  }, [id, selectStartup, fetchStartup, fetchWatchlist, user, fetchMyFundingRequests])

  if (!startup) return <div className="p-6 text-white">Loading...</div>

  // find current investor's request for this startup (if any)
  const myRequest = (fundingRequests || []).find((r) => String(r.startup?._id || r.startup?.id) === String(startup._id || startup.id))

  // header funding button
  const headerFundingButton = (() => {
    if (!user) {
      return (
        <button
          onClick={() => navigate('/login', { state: { from: location.pathname } })}
          className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white"
        >
          Request Funding
        </button>
      )
    }

    if (user.activeRole !== 'investor') {
      return (
        <button
          onClick={() => toast.error('Switch to investor role to request funding')}
          className="rounded-xl bg-indigo-700/80 px-4 py-2 text-sm font-semibold text-white"
        >
          Request Funding
        </button>
      )
    }

    // investor
    return myRequest ? (
      <button disabled className="rounded-xl bg-slate-700/90 px-4 py-2 text-sm font-semibold text-white">Already Sent</button>
    ) : (
      <button
        onClick={() => setShowFundingModal(true)}
        className="rounded-xl bg-indigo-500/90 px-4 py-2 text-sm font-semibold text-white"
      >
        Request Funding
      </button>
    )
  })()

  // funding panel for right column
  const fundingPanel = user && user.activeRole === 'investor' ? (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      {myRequest ? (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">Your Request</h3>
          <div className="mt-2 text-sm text-slate-300">Amount: <strong>${myRequest.amount}</strong></div>
          <div className="text-sm text-slate-300">Message: {myRequest.message || '—'}</div>
          <div className="flex items-center gap-2">
            <div className="rounded-full px-2 py-0.5 text-xs bg-yellow-500/80">{myRequest.status}</div>
            {myRequest.status === 'pending' && (
              <button
                disabled={isUpdating}
                onClick={async () => { try { await withdrawFundingRequest(myRequest._id) } catch (err) { console.error(err) } }}
                className={isUpdating ? 'rounded-lg px-3 py-1 bg-red-500/40 cursor-not-allowed' : 'rounded-lg px-3 py-1 bg-red-600/90'}
              >
                {isUpdating ? 'Withdrawing...' : 'Withdraw'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="text-sm text-slate-400">No requests yet. Click "Request Funding" to send one.</div>
      )}
    </div>
  ) : null

  return (
    <div className="bg-linear-to-br from-slate-950 to-slate-900 px-4 py-12 text-white">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* HERO */}
        <div className="rounded-2xl border border-white/6 bg-linear-to-b from-white/3 to-white/2 p-6 backdrop-blur-sm shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-start gap-4">
              <div className="h-20 w-20 shrink-0 rounded-3xl bg-linear-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-2xl font-bold text-white">
                {startup.name ? startup.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div>
                <div className="text-3xl font-extrabold leading-tight">{startup.name}</div>
                <div className="mt-1 text-sm text-slate-300">{startup.tagline || `${startup.industry || '—'} • ${startup.location || '—'}`}</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-indigo-600/20 px-3 py-1 text-indigo-100 text-xs font-medium">{startup.stage || 'Stage'}</span>
                  {(startup.tags || []).slice(0,6).map((t) => (<span key={t} className="rounded-full bg-white/5 px-3 py-1 text-xs">{t}</span>))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-4 lg:mt-0">
              <div className="rounded-2xl bg-white/5 px-4 py-3 text-center">
                <div className="text-xs text-slate-300">Funding required</div>
                <div className="text-lg font-bold">{startup.fundingRequired ? `$${startup.fundingRequired.toLocaleString()}` : 'N/A'}</div>
              </div>
              <div className="flex items-center gap-2">
                {headerFundingButton}
                <button className="rounded-xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white">Save</button>
              </div>
            </div>
          </div>
        </div>

        {/* MAIN GRID */}
        <div className="grid gap-6 lg:grid-cols-[1fr,320px]">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <h3 className="text-xl font-bold">Overview</h3>
              <div className="mt-4 grid gap-4 md:grid-cols-2">
                <div className="space-y-3 text-sm text-slate-300">
                  <div><strong>Industry:</strong> {startup.industry || '—'}</div>
                  <div><strong>Location:</strong> {startup.location || '—'}</div>
                  <div><strong>Stage:</strong> {startup.stage || '—'}</div>
                  <div><strong>Equity offered:</strong> {startup.equityOffered || '—'}</div>
                </div>
                <div className="space-y-3 text-sm text-slate-300">
                  <div><strong>Website:</strong> {startup.website ? <a className="text-indigo-300 underline" target="_blank" rel="noreferrer" href={startup.website}>{startup.website}</a> : '—'}</div>
                  <div><strong>Pitch Deck:</strong> {startup.pitchDeckUrl ? <a className="text-indigo-300 underline" target="_blank" rel="noreferrer" href={startup.pitchDeckUrl}>View</a> : '—'}</div>
                  <div><strong>Demo:</strong> {startup.demoVideoUrl ? <a className="text-indigo-300 underline" target="_blank" rel="noreferrer" href={startup.demoVideoUrl}>Watch</a> : '—'}</div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div>
                  <div className="text-sm font-semibold text-slate-200">Problem</div>
                  <p className="mt-2 text-sm text-slate-300">{startup.problem || '—'}</p>
                </div>
                <div>
                  <div className="text-sm font-semibold text-slate-200">Solution</div>
                  <p className="mt-2 text-sm text-slate-300">{startup.solution || '—'}</p>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-white/4 p-6">
              <h3 className="text-lg font-semibold">Traction</h3>
              <div className="mt-4 grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-slate-900/60 p-3 text-center">
                  <div className="text-xs text-slate-400">Users</div>
                  <div className="text-lg font-bold">{startup.traction?.users ?? '—'}</div>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3 text-center">
                  <div className="text-xs text-slate-400">Revenue</div>
                  <div className="text-lg font-bold">{startup.traction?.revenue ? `$${startup.traction.revenue}` : '—'}</div>
                </div>
                <div className="rounded-lg bg-slate-900/60 p-3 text-center">
                  <div className="text-xs text-slate-400">Growth</div>
                  <div className="text-lg font-bold">{startup.traction?.growth ? `${startup.traction.growth}%` : '—'}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {fundingPanel}

            <div className="rounded-2xl border border-white/8 bg-white/4 p-5">
              <h4 className="text-lg font-semibold">Founder</h4>
              <div className="mt-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-indigo-500/60 flex items-center justify-center text-white font-semibold">{startup.founder?.name ? startup.founder.name.charAt(0) : 'F'}</div>
                <div>
                  <div className="font-semibold">{startup.founder?.name || 'Founder'}</div>
                  <div className="text-sm text-slate-400">{startup.founder?.email || ''}</div>
                </div>
              </div>
              <div className="mt-4 text-sm text-slate-300">{startup.founder?.bio || 'No bio available.'}</div>
            </div>
          </div>
        </div>

        {/* funding modal (unchanged) */}
        {showFundingModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={() => { setShowFundingModal(false); setFunding({ amount: '', message: '' }) }} />
            <div className="relative z-10 w-full max-w-lg rounded-2xl bg-slate-900 p-6 text-white">
              <h3 className="text-lg font-semibold">Send Funding Request</h3>
              <div className="mt-4 space-y-3 text-sm">
                <div>
                  <label className="text-xs">Amount (USD)</label>
                  <input autoFocus type="number" value={funding.amount} onChange={(e) => setFunding((f) => ({ ...f, amount: e.target.value }))} className="mt-2 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2" />
                </div>
                <div>
                  <label className="text-xs">Message</label>
                  <textarea value={funding.message} onChange={(e) => setFunding((f) => ({ ...f, message: e.target.value }))} className="mt-2 w-full rounded-md border border-white/10 bg-white/3 px-3 py-2" rows={4} />
                </div>
                <div className="flex justify-end gap-2">
                  <button onClick={() => { setShowFundingModal(false); setFunding({ amount: '', message: '' }) }} className="rounded-xl border border-white/10 px-4 py-2">Cancel</button>
                  <button disabled={isCreating} onClick={async () => {
                    try {
                      const amountNum = Number(funding.amount)
                      if (!amountNum || amountNum <= 0) return toast.error('Enter a valid amount')
                      await sendFundingRequest({ startupId: startup._id || startup.id, amount: amountNum, message: funding.message })
                      setShowFundingModal(false)
                      setFunding({ amount: '', message: '' })
                    } catch (err) {
                      console.error('sendFundingRequest modal error:', err)
                    }
                  }} className="rounded-xl bg-indigo-500/90 px-4 py-2 text-white">{isCreating ? 'Sending...' : 'Send Request'}</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default StartupDetail

