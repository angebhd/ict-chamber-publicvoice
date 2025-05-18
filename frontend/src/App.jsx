import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/citizen/DashboardPage';
import SubmitComplaintPage from './pages/citizen/SubmitComplaintPage';
import ComplaintDetailsPage from './pages/citizen/ComplaintDetailsPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminComplaintDetailsPage from './pages/admin/AdminComplaintDetailsPage';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import NotFound from './pages/NotFound';
import NotificationToast from './components/common/NotificationToast';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Citizen Routes */}
                <Route 
                  path="/dashboard" 
                  element={
                    <ProtectedRoute role="citizen">
                      <DashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/submit-complaint" 
                  element={
                    <ProtectedRoute role="citizen">
                      <SubmitComplaintPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/complaints/:id" 
                  element={
                    <ProtectedRoute role="citizen">
                      <ComplaintDetailsPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Department Admin Routes */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/complaints/:id" 
                  element={
                    <ProtectedRoute role="admin">
                      <AdminComplaintDetailsPage />
                    </ProtectedRoute>
                  } 
                />

                {/* Super Admin Routes */}
                <Route 
                  path="/superadmin" 
                  element={
                    <ProtectedRoute role="superadmin">
                      <SuperAdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="/404" element={<NotFound />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </main>
            <Footer />
            <NotificationToast />
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
