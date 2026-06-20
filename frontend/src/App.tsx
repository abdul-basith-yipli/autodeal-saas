import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Layout from './components/Layout'
import PublicLayout from './components/PublicLayout'
import LoginPage from './pages/auth/LoginPage'
import DashboardPage from './pages/dashboard/DashboardPage'
import ShowroomsPage from './pages/showrooms/ShowroomsPage'
import DepartmentsPage from './pages/departments/DepartmentsPage'
import StaffPage from './pages/staff/StaffPage'
import VehiclesPage from './pages/vehicles/VehiclesPage'
import VehicleDetailPage from './pages/vehicles/VehicleDetailPage'
import EnquiriesPage from './pages/enquiries/EnquiriesPage'
import EnquiryDetailPage from './pages/enquiries/EnquiryDetailPage'
import BrowsePage from './pages/browse/BrowsePage'
import BrowseVehicleDetailPage from './pages/browse/BrowseVehicleDetailPage'
import RegisterPage from './pages/customer/RegisterPage'
import CustomerLoginPage from './pages/customer/CustomerLoginPage'
import CustomerDashboardPage from './pages/customer/CustomerDashboardPage'

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
        <Route path="/browse" element={<PublicLayout><BrowsePage /></PublicLayout>} />
        <Route path="/browse/:id" element={<PublicLayout><BrowseVehicleDetailPage /></PublicLayout>} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/customer/login" element={<CustomerLoginPage />} />
        <Route path="/customer/dashboard" element={<PublicLayout><CustomerDashboardPage /></PublicLayout>} />
        <Route path="/" element={<ProtectedLayout><DashboardPage /></ProtectedLayout>} />
        <Route path="/showrooms" element={<ProtectedLayout><ShowroomsPage /></ProtectedLayout>} />
        <Route path="/departments" element={<ProtectedLayout><DepartmentsPage /></ProtectedLayout>} />
        <Route path="/staff" element={<ProtectedLayout><StaffPage /></ProtectedLayout>} />
        <Route path="/vehicles" element={<ProtectedLayout><VehiclesPage /></ProtectedLayout>} />
        <Route path="/vehicles/:id" element={<ProtectedLayout><VehicleDetailPage /></ProtectedLayout>} />
        <Route path="/vehicles/:id/edit" element={<ProtectedLayout><VehicleDetailPage /></ProtectedLayout>} />
        <Route path="/enquiries" element={<ProtectedLayout><EnquiriesPage /></ProtectedLayout>} />
        <Route path="/enquiries/:id" element={<ProtectedLayout><EnquiryDetailPage /></ProtectedLayout>} />
        <Route path="/enquiries/:id/edit" element={<ProtectedLayout><EnquiryDetailPage /></ProtectedLayout>} />
        <Route path="*" element={<Navigate to="/browse" replace />} />
      </Routes>
    </AuthProvider>
  )
}
