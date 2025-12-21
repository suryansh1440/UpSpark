import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedLayout from '../layouts/ProtectedLayout'
import ErrorBoundary from '../components/ErrorBoundary'
import Landing from '../pages/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Onboarding from '../pages/Onboarding'
import FounderDashboard from '../pages/dashboards/FounderDashboard'
import InvestorDashboard from '../pages/dashboards/InvestorDashboard'
import InvestorWatchlist from '../pages/dashboards/InvestorWatchlist'
import MyFundingRequests from '../pages/dashboards/MyFundingRequests'
import CollaboratorDashboard from '../pages/dashboards/CollaboratorDashboard'
import Startups from '../pages/Startups'
import StartupDetail from '../pages/StartupDetail'
import CollaborationBoard from '../pages/CollaborationBoard'
// Mentor pages removed
import FundingFounder from '../pages/funding/FundingFounder'
import FundingInvestor from '../pages/funding/FundingInvestor'
import AiPitch from '../pages/AiPitch'
import Notifications from '../pages/Notifications'
import Settings from '../pages/Settings'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'
import MyStartups from '../pages/dashboards/MyStartups'
import CreateEditStartup from '../pages/dashboards/CreateEditStartup'

const router = createBrowserRouter([
  {
    element: (
      <ErrorBoundary>
        <PublicLayout />
      </ErrorBoundary>
    ),
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/onboarding', element: <Onboarding /> },
      { path: '/startups', element: <Startups /> },
      { path: '/startups/:id', element: <StartupDetail /> },
      // mentors discovery removed
      // keep public discovery pages available
      { path: '/collaboration', element: <CollaborationBoard /> },
      { path: '/ai-pitch', element: <AiPitch /> },
      { path: '/notifications', element: <Notifications /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ErrorBoundary>
        <ProtectedLayout>
          <DashboardLayout />
        </ProtectedLayout>
      </ErrorBoundary>
    ),
    children: [
      { index: true, element: <ProtectedLayout roles={['founder']}><FounderDashboard /></ProtectedLayout> },
      { path: 'founder', element: <ProtectedLayout roles={['founder']}><FounderDashboard /></ProtectedLayout> },
      { path: 'investor', element: <ProtectedLayout roles={['investor']}><InvestorDashboard /></ProtectedLayout> },
      { path: 'investor/watchlist', element: <ProtectedLayout roles={['investor']}><InvestorWatchlist /></ProtectedLayout> },
      { path: 'investor/funding', element: <ProtectedLayout roles={['investor']}><MyFundingRequests /></ProtectedLayout> },
      // mentor dashboard removed
      { path: 'collaborator', element: <ProtectedLayout roles={['collaborator']}><CollaboratorDashboard /></ProtectedLayout> },
      { path: 'admin', element: <ProtectedLayout roles={['admin']}><AdminDashboard /></ProtectedLayout> },
      { path: 'admin/users', element: <ProtectedLayout roles={['admin']}><AdminUsers /></ProtectedLayout> },
      // dashboard-scoped explore for logged-in users
      { path: 'startup', element: <ProtectedLayout roles={['founder','investor','collaborator','admin']}><Startups /></ProtectedLayout> },
      // dashboard-scoped startup detail
      { path: 'startup/:id', element: <ProtectedLayout roles={['founder','investor','collaborator','admin']}><StartupDetail /></ProtectedLayout> },
      // founder-only management
      { path: 'my-startup', element: <ProtectedLayout roles={['founder']}><MyStartups /></ProtectedLayout> },
      { path: 'my-startup/new', element: <ProtectedLayout roles={['founder']}><CreateEditStartup /></ProtectedLayout> },
      { path: 'my-startup/:id/edit', element: <ProtectedLayout roles={['founder']}><CreateEditStartup /></ProtectedLayout> },
      { path: 'collaboration', element: <CollaborationBoard /> },
      // mentors pages removed from dashboard
      { path: 'funding', element: <ProtectedLayout roles={['founder']}><FundingFounder /></ProtectedLayout> },
      { path: 'funding/investor', element: <ProtectedLayout roles={['investor']}><FundingInvestor /></ProtectedLayout> },
      /* messages route removed */
      { path: 'ai-pitch', element: <AiPitch /> },
      { path: 'notifications', element: <Notifications /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <div className="text-white">Not found</div> },
    ],
  },
  {
    path: '*',
    element: <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">Page not found.</div>,
  },
])

export default router

