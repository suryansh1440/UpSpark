import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'
import useFundingStore from '../../store/useFundingStore'
import { useEffect, useState } from 'react'

const FundingFounder = () => {
  const { user } = useAuthStore()
  const requests = useFundingStore((s) => s.founderRequests)
  const fetchRequests = useFundingStore((s) => s.fetchFounderRequests)
  const acceptRequest = useFundingStore((s) => s.acceptRequest)
  const rejectRequest = useFundingStore((s) => s.rejectRequest)
  const isLoading = useFundingStore((s) => s.isLoading)
  const updatingRequestIds = useFundingStore((s) => s.updatingRequestIds)

  useEffect(() => {
    if (user && user.activeRole === 'founder') fetchRequests()
  }, [user, fetchRequests])

  const [selected, setSelected] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)

  if (!user || user.activeRole !== 'founder') {
    return <NotAllowed message="Funding (founder) is only for founders." />
  }

  return (
    <div className="space-y-4 text-white">
      <div className="flex items-center gap-3">
        {['Incoming Requests', 'Sent Requests'].map((tab, idx) => (
          <button
            key={tab}
            className={`rounded-full px-4 py-2 text-sm ${idx === 0 ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
        <div className="grid grid-cols-5 bg-white/5 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
          <div>Investor</div>
          <div>Startup</div>
          <div>Amount</div>
          <div>Status</div>
          <div className="text-right">Actions</div>
        </div>
        {isLoading && <div className="p-4 text-sm text-slate-300">Loading requests...</div>}
        {!isLoading && requests.length === 0 && (
          <div className="p-8 text-center text-slate-300">
            <div className="text-3xl">💸</div>
            <div className="mt-2 text-lg font-medium">No funding requests yet</div>
            <div className="mt-1 text-sm">You'll see incoming requests here when investors show interest in your startup.</div>
          </div>
        )}
        {requests.map((r) => (
          <div key={r._id} className="grid grid-cols-5 items-center px-4 py-3 text-sm text-white">
            <div>{r.investor?.name || r.investor?.email}</div>
            <div className="text-slate-300">{r.startup?.name}</div>
            <div>{r.amount}</div>
            <div>{r.status === 'pending' ? <span className="rounded-full bg-yellow-500/80 px-2 py-0.5 text-xs">Pending</span> : r.status === 'accepted' ? <span className="rounded-full bg-green-600/80 px-2 py-0.5 text-xs">Accepted</span> : <span className="rounded-full bg-red-600/80 px-2 py-0.5 text-xs">Rejected</span>}</div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => { setSelected(r); setShowRequestModal(true) }} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">View</button>
              {r.status === 'pending' && (
                <>
                  <button
                    disabled={updatingRequestIds.includes(r._id)}
                    onClick={async () => {
                      const ok = window.confirm('Accept this funding request?')
                      if (!ok) return
                      await acceptRequest(r._id)
                    }}
                    className="rounded-lg border border-white/10 px-3 py-1 text-white"
                  >
                    {updatingRequestIds.includes(r._id) ? 'Accepting...' : 'Accept'}
                  </button>
                  <button
                    disabled={updatingRequestIds.includes(r._id)}
                    onClick={async () => {
                      const ok = window.confirm('Reject this funding request?')
                      if (!ok) return
                      await rejectRequest(r._id)
                    }}
                    className="rounded-lg border border-white/10 px-3 py-1 text-white"
                  >
                    {updatingRequestIds.includes(r._id) ? 'Rejecting...' : 'Reject'}
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {showRequestModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/60" onClick={() => { setShowRequestModal(false); setSelected(null) }} />
          <div className="relative z-10 w-full max-w-md rounded-2xl bg-slate-900 p-6 text-white">
            <h3 className="text-lg font-semibold">Request Details</h3>
            <div className="mt-4 text-sm space-y-2">
              <div><strong>Investor:</strong> {selected.investor?.name || selected.investor?.email}</div>
              <div><strong>Amount:</strong> ${selected.amount}</div>
              <div><strong>Message:</strong></div>
              <div className="mt-1 text-slate-300">{selected.message || '—'}</div>
              <div className="mt-3 flex justify-end">
                <button onClick={() => { setShowRequestModal(false); setSelected(null) }} className="rounded-xl border border-white/10 px-4 py-2">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default FundingFounder

