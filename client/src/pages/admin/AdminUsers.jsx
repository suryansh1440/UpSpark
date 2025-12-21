import NotAllowed from '../../components/NotAllowed'
import { useAuthStore } from '../../store/useAuthStore'
import useAdminStore from '../../store/useAdminStore'
import { Loader } from 'lucide-react'

const AdminUsers = () => {
  const { user } = useAuthStore()
  // require an authenticated user with activeRole 'admin'
  if (!user || user.activeRole !== 'admin') {
    return <NotAllowed message="Admin access only." />
  }

  const users = useAdminStore((s) => s.users)
  const fetchUsers = useAdminStore((s) => s.fetchUsers)
  const verifyUser = useAdminStore((s) => s.verifyUser)
  const blockUser = useAdminStore((s) => s.blockUser)
  const unblockUser = useAdminStore((s) => s.unblockUser)
  const deleteUser = useAdminStore((s) => s.deleteUser)
  const isLoading = useAdminStore((s) => s.isLoading)
  const isUpdating = useAdminStore((s) => s.isUpdating)
  const isDeleting = useAdminStore((s) => s.isDeleting)

  React.useEffect(() => {
    if (user && user.activeRole === 'admin') fetchUsers()
  }, [user, fetchUsers])

  return (
    <div className="space-y-4 text-white">
      <div className="flex flex-wrap items-center gap-3">
        {['All', 'Founders', 'Investors', 'Advisors', 'Blocked'].map((filter, idx) => (
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

        {isLoading && (
          <div className="p-4 text-sm text-slate-200"><Loader className="inline-block animate-spin" /> Loading users...</div>
        )}

        {!isLoading && users.map((row) => (
          <div key={row._id} className="grid grid-cols-4 items-center px-4 py-3 text-sm text-white">
            <div>{row.name || row.email}</div>
            <div className="text-slate-300">{row.role}</div>
            <div className="text-indigo-200">{row.isBlocked ? 'Blocked' : (row.isVerified ? 'Verified' : 'Active')}</div>
            <div className="flex justify-end gap-2 text-xs">
              <button onClick={() => window.open(`/profile/${row._id}`, '_blank')} className="rounded-lg border border-white/10 px-3 py-1 text-white">View</button>
              {!row.isVerified && (
                <button disabled={isUpdating} onClick={() => verifyUser(row._id)} className="rounded-lg bg-indigo-500/80 px-3 py-1 text-white">Verify</button>
              )}
              {row.isBlocked ? (
                <button disabled={isUpdating} onClick={() => unblockUser(row._id)} className="rounded-lg border border-white/10 px-3 py-1 text-white">Unblock</button>
              ) : (
                <button disabled={isUpdating} onClick={() => blockUser(row._id)} className="rounded-lg border border-white/10 px-3 py-1 text-white">Block</button>
              )}
              <button disabled={isDeleting} onClick={() => { if (window.confirm('Delete user?')) deleteUser(row._id) }} className="rounded-lg border border-red-500 px-3 py-1 text-red-300">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminUsers

