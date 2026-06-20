import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ShowroomsPage from './pages/showrooms/ShowroomsPage'
import DepartmentsPage from './pages/departments/DepartmentsPage'
import StaffPage from './pages/staff/StaffPage'
import VehiclesPage from './pages/vehicles/VehiclesPage'
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage'

function ProtectedLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute>
      <Layout>{children}</Layout>
    </ProtectedRoute>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/showrooms" element={<ProtectedLayout><ShowroomsPage /></ProtectedLayout>} />
        <Route path="/departments" element={<ProtectedLayout><DepartmentsPage /></ProtectedLayout>} />
        <Route path="/staff" element={<ProtectedLayout><StaffPage /></ProtectedLayout>} />
        <Route path="/vehicles" element={<ProtectedLayout><VehiclesPage /></ProtectedLayout>} />
        <Route path="/vehicles/:id" element={<ProtectedLayout><VehicleDetailPage /></ProtectedLayout>} />
        <Route path="/vehicles/:id/edit" element={<ProtectedLayout><VehicleDetailPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  )
}
