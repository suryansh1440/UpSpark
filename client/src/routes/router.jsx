import { createBrowserRouter, Navigate } from 'react-router-dom'
import PublicLayout from '../layouts/PublicLayout'
import DashboardLayout from '../layouts/DashboardLayout'
import ProtectedLayout from '../layouts/ProtectedLayout'
import Landing from '../pages/Landing'
import Login from '../pages/auth/Login'
import Register from '../pages/auth/Register'
import Onboarding from '../pages/Onboarding'
import FounderDashboard from '../pages/dashboards/FounderDashboard'
import InvestorDashboard from '../pages/dashboards/InvestorDashboard'
import MentorDashboard from '../pages/dashboards/MentorDashboard'
import CollaboratorDashboard from '../pages/dashboards/CollaboratorDashboard'
import Startups from '../pages/Startups'
import StartupDetail from '../pages/StartupDetail'
import CollaborationBoard from '../pages/CollaborationBoard'
import Mentors from '../pages/Mentors'
import MentorProfile from '../pages/MentorProfile'
import FundingFounder from '../pages/funding/FundingFounder'
import FundingInvestor from '../pages/funding/FundingInvestor'
import AiPitch from '../pages/AiPitch'
import Notifications from '../pages/Notifications'
import Settings from '../pages/Settings'
import AdminDashboard from '../pages/admin/AdminDashboard'
import AdminUsers from '../pages/admin/AdminUsers'

const router = createBrowserRouter([
  {
    element: <PublicLayout />,
    children: [
      { path: '/', element: <Landing /> },
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/onboarding', element: <Onboarding /> },
      { path: '/startups', element: <Startups /> },
      { path: '/startups/:id', element: <StartupDetail /> },
      { path: '/mentors', element: <Mentors /> },
      { path: '/mentors/:id', element: <MentorProfile /> },
      // keep public discovery pages available
      { path: '/collaboration', element: <CollaborationBoard /> },
      { path: '/ai-pitch', element: <AiPitch /> },
      { path: '/notifications', element: <Notifications /> },
    ],
  },
  {
    path: '/dashboard',
    element: (
      <ProtectedLayout>
        <DashboardLayout />
      </ProtectedLayout>
    ),
    children: [
      { index: true, element: <ProtectedLayout roles={['founder']}><FounderDashboard /></ProtectedLayout> },
      { path: 'founder', element: <ProtectedLayout roles={['founder']}><FounderDashboard /></ProtectedLayout> },
      { path: 'investor', element: <ProtectedLayout roles={['investor']}><InvestorDashboard /></ProtectedLayout> },
      { path: 'mentor', element: <ProtectedLayout roles={['mentor']}><MentorDashboard /></ProtectedLayout> },
      { path: 'collaborator', element: <ProtectedLayout roles={['collaborator']}><CollaboratorDashboard /></ProtectedLayout> },
      { path: 'admin', element: <ProtectedLayout roles={['admin']}><AdminDashboard /></ProtectedLayout> },
      { path: 'admin/users', element: <ProtectedLayout roles={['admin']}><AdminUsers /></ProtectedLayout> },
      { path: 'startups', element: <Startups /> },
      { path: 'startups/:id', element: <StartupDetail /> },
      { path: 'collaboration', element: <CollaborationBoard /> },
      { path: 'mentors', element: <Mentors /> },
      { path: 'mentors/:id', element: <MentorProfile /> },
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

