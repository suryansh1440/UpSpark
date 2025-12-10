import { useSelector } from 'react-redux'
import { Navigate, useLocation } from 'react-router-dom'

const ProtectedLayout = ({ children, roles }) => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.auth)
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && currentUser && !roles.includes(currentUser.role)) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Not authorized.</div>
  }

  return children
}

export default ProtectedLayout

