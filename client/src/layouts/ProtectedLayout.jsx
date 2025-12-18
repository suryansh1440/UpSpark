import { Navigate, useLocation } from 'react-router-dom'
import { useAuthStore } from '../store/useAuthStore'

const ProtectedLayout = ({ children, roles }) => {
  const {user} = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  // If roles are provided, ensure the user's activeRole is included; otherwise allow access
  if (roles && user.activeRole && !roles.includes(user.activeRole)) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Not authorized.</div>
  }

  return children
}

export default ProtectedLayout

