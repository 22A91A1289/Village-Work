import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { NotificationProvider } from './context/NotificationContext'
import Loading from './components/common/Loading'
import ErrorBoundary from './components/common/ErrorBoundary'

// Lazy load pages for better performance
const RoleSelection = React.lazy(() => import('./pages/auth/RoleSelection'))
const Login = React.lazy(() => import('./pages/auth/Login'))
const SignUp = React.lazy(() => import('./pages/auth/SignUp'))

// Worker pages
const WorkerDashboard = React.lazy(() => import('./pages/worker/WorkerDashboard'))
const JobSearch = React.lazy(() => import('./pages/worker/JobSearch'))
const Applications = React.lazy(() => import('./pages/worker/Applications'))
const Profile = React.lazy(() => import('./pages/worker/Profile'))
const SkillAssessment = React.lazy(() => import('./pages/worker/SkillAssessment'))

// Owner pages
const OwnerDashboard = React.lazy(() => import('./pages/owner/OwnerDashboard'))
const CreateJob = React.lazy(() => import('./pages/owner/CreateJob'))
const JobManagement = React.lazy(() => import('./pages/owner/JobManagement'))
const OwnerApplications = React.lazy(() => import('./pages/owner/Applications'))

// Admin pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'))
const PaymentManagement = React.lazy(() => import('./pages/admin/PaymentManagement'))

// Common pages
const JobDetails = React.lazy(() => import('./pages/common/JobDetails'))
const NotFound = React.lazy(() => import('./pages/common/NotFound'))

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Suspense fallback={<Loading />}>
            <Routes>
              {/* Authentication Routes */}
              <Route path="/" element={<RoleSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />

              {/* Worker Routes */}
              <Route path="/worker" element={<WorkerDashboard />} />
              <Route path="/worker/jobs" element={<JobSearch />} />
              <Route path="/worker/applications" element={<Applications />} />
              <Route path="/worker/profile" element={<Profile />} />
              <Route path="/worker/assessment" element={<SkillAssessment />} />

              {/* Owner Routes */}
              <Route path="/owner" element={<OwnerDashboard />} />
              <Route path="/owner/create-job" element={<CreateJob />} />
              <Route path="/owner/jobs" element={<JobManagement />} />
              <Route path="/owner/applications" element={<OwnerApplications />} />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/payments" element={<PaymentManagement />} />

              {/* Common Routes */}
              <Route path="/job/:id" element={<JobDetails />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}

export default App 