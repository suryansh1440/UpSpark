import { Link, useNavigate } from 'react-router-dom'
import { roles } from '../data/mockData'
import { useAuthStore } from '../store/useAuthStore';

const RoleCards = () => {
  const { user, addRole, isAddingRole, changeRole, isChangingRole } = useAuthStore();
  const navigate = useNavigate()
   return(
   <section className="bg-slate-950 py-12">
    <div className="mx-auto max-w-6xl px-4">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Choose your path</h2>
        <p className="text-sm text-slate-400">Tailored flows for every role</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {roles.map((role) => (
          <div
            key={role.role}
            className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-white shadow-lg shadow-indigo-500/10 transition hover:-translate-y-1 hover:shadow-indigo-500/20"
          >
            <div className={`mb-4 h-10 w-10 rounded-xl bg-gradient-to-br ${role.color} opacity-80`} />
            <h3 className="text-lg font-semibold">{role.title}</h3>
            <p className="mt-2 text-sm text-slate-300">Get matched, track funding, and collaborate.</p>
            {user ? (
              user.roles?.includes(role.role) ? (
                <button
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-2 text-sm font-semibold text-slate-400 cursor-default"
                  disabled
                >
                  Done
                </button>
              ) : (
                <button
                  onClick={async () => {
                    try {
                      await addRole(role.role)
                      await changeRole(role.role)
                      navigate(`/dashboard/${role.role}`)
                    } catch (err) {
                      console.error(err)
                    }
                  }}
                  disabled={isAddingRole || isChangingRole}
                  className="mt-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
                >
                  {isAddingRole ? 'Adding…' : isChangingRole ? 'Switching…' : 'Add Role'}
                </button>
              )
            ) : (
                 <Link
                   to="/register"
                   className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-200 transition hover:text-white"
                 >
                   {role.cta} →
                 </Link>
               )}
          </div>
        ))}
      </div>
    </div>
  </section>
)}

export default RoleCards

