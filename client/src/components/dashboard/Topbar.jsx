import { Bell, Search, User, Check } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useRef, useEffect } from 'react'
import { useAuthStore } from '../../store/useAuthStore'

const roleDashMap = {
  founder: '/dashboard/founder',
  investor: '/dashboard/investor',
  mentor: '/dashboard/mentor',
  collaborator: '/dashboard/collaborator',
  admin: '/dashboard/admin',
}

const roles = ['founder', 'investor', 'mentor', 'collaborator']

const Topbar = () => {
  const navigate = useNavigate()
  const { user, addRole, isAddingRole, changeRole, isChangingRole } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const containerRef = useRef(null)
  // compute missing roles safely (user may be undefined during auth check)
  const missingRoles = roles.filter(r => !(user?.roles || []).includes(r))

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setMenuOpen(false)
        setShowAddMenu(false)
      }
    }
    window.addEventListener('click', onClick)
    return () => window.removeEventListener('click', onClick)
  }, [])

  const handleSelectRole = async (r) => {
      await changeRole(r)
      navigate(roleDashMap[r] || '/dashboard')
    
  }

  return (
    <div className="sticky top-0 z-10 flex items-center gap-4 border-b border-white/5 bg-slate-950/80 px-4 py-3 backdrop-blur">
      <div className="relative flex-1 max-w-xl">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search startups or people"
          className="w-full rounded-xl bg-white/5 pl-9 pr-3 py-2 text-sm text-white placeholder:text-slate-500 outline-none ring-1 ring-white/10 focus:ring-indigo-400/50"
        />
      </div>
      <div className="flex items-center gap-2">
        <div className="relative" ref={containerRef}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen((s) => !s)}
              disabled={!user || isChangingRole}
              aria-haspopup="menu"
              aria-expanded={menuOpen}
              className="flex items-center gap-2 rounded-xl border border-white/15 bg-gradient-to-r from-slate-900/80 to-slate-800/80 px-3 py-2 text-xs font-semibold text-white"
            >
              <span className="capitalize">{user?.activeRole ?? 'Role'}</span>
              <span className="text-[10px]">▼</span>
            </button>

            {missingRoles.length > 0 && (
              <button
                title="Add role"
                onClick={() => setShowAddMenu((s) => !s)}
                disabled={!user || isAddingRole}
                className="rounded-xl border border-white/15 px-2 py-2 text-xs font-semibold text-white"
              >
                +
              </button>
            )}
          </div>

          {menuOpen && user?.roles?.length > 0 && (
            <div role="menu" className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-lg">
              {user.roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleSelectRole(r)}
                  disabled={isChangingRole}
                  className="w-full flex items-center justify-between rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                >
                  <span className="capitalize">{r}</span>
                  {user?.activeRole === r && <Check size={14} className="text-indigo-400" />}
                </button>
              ))}
            </div>
          )}

          {showAddMenu && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-slate-900 p-2 shadow-lg">
              {missingRoles.map((r) => (
                <button
                  key={r}
                  onClick={async () => {
                    try {
                      await addRole(r)
                      await changeRole(r)
                      navigate(roleDashMap[r] || '/dashboard')
                    } catch (err) {
                      console.log(err);
                    } finally {
                      setShowAddMenu(false)
                      setMenuOpen(false)
                    }
                  }}
                  disabled={isAddingRole}
                  className="w-full text-left rounded-md px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
                >
                  {r.charAt(0).toUpperCase() + r.slice(1)} {isAddingRole ? '…' : ''}
                </button>
              ))}
            </div>
          )}
        </div>
        <button className="relative rounded-xl border border-white/10 bg-white/5 p-2 text-slate-200 transition hover:border-indigo-400/50">
          <Bell size={16} />
          <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-indigo-400" />
        </button>
        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
            <User size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user?.name ?? 'Guest'}</div>
            <div className="text-xs text-slate-400 capitalize">{user?.activeRole ?? 'role'}</div>
            <div className="text-[11px] text-slate-500 truncate max-w-[14rem]">{user?.email ?? ''}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Topbar

