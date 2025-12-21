import { useEffect, useState } from 'react'
import useNotificationStore from '../store/useNotificationStore'

const Notifications = () => {
  const notifications = useNotificationStore((s) => s.notifications)
  const total = useNotificationStore((s) => s.total)
  const isLoading = useNotificationStore((s) => s.isLoading)
  const unreadCount = useNotificationStore((s) => s.unreadCount)
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications)
  const markAsRead = useNotificationStore((s) => s.markAsRead)
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead)
  const deleteNotification = useNotificationStore((s) => s.deleteNotification)

  const [filter, setFilter] = useState('All')

  useEffect(() => {
    fetchNotifications({ page: 1, limit: 50 })
  }, [])

  const onFilter = (f) => {
    setFilter(f)
    if (f === 'All') fetchNotifications({ page: 1, limit: 50 })
    else if (f === 'Unread') fetchNotifications({ page: 1, limit: 50, unread: true })
    else fetchNotifications({ page: 1, limit: 50, type: f.toLowerCase() })
  }

  return (
    <div className="bg-slate-950 px-4 py-10 text-white">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {['All', 'Unread', 'Funding', 'Collaboration', 'Admin', 'System'].map((f) => (
              <button key={f} onClick={() => onFilter(f)} className={`rounded-full px-4 py-2 text-sm ${filter === f ? 'bg-indigo-500/20 text-indigo-100' : 'bg-white/5 text-slate-200'}`}>
                {f}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-400">Unread: <span className="font-semibold text-white">{unreadCount}</span></div>
            <button onClick={() => markAllAsRead()} className="rounded-xl bg-indigo-500/90 px-3 py-2 text-sm font-semibold">Mark all read</button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading && <div className="text-slate-400">Loading...</div>}
          {!isLoading && (notifications || []).length === 0 && <div className="text-slate-400">No notifications yet.</div>}
          {(notifications || []).map((n) => (
            <div key={n._id} className={`flex items-center justify-between rounded-2xl border border-white/10 ${n.isRead ? 'bg-white/3' : 'bg-white/6'} p-4`}>
              <div>
                <div className="text-sm font-semibold">{n.title}</div>
                <div className="text-xs text-slate-400 mt-1">{n.message}</div>
                <div className="text-xs text-slate-500 mt-1">{new Date(n.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                {!n.isRead && <button onClick={() => markAsRead(n._id)} className="rounded-md bg-emerald-600 px-3 py-1 text-xs">Mark read</button>}
                <div className="flex gap-2">
                  <a href={n.link || '#'} className="rounded-md border border-white/10 px-3 py-1 text-xs">Open</a>
                  <button onClick={() => deleteNotification(n._id)} className="rounded-md border border-rose-600/40 px-3 py-1 text-xs text-rose-400">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Notifications

