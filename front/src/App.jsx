import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import AdminDashboard from './components/dashboard/AdminDashboard';
import UserDashboard from './components/dashboard/UserDashboard';
import AuthScreen from './components/auth/AuthScreen';
import Loader from './components/common/Loader';

function DashboardRouter() {
  const { isAdmin } = useAuth();
  return isAdmin ? <AdminDashboard /> : <UserDashboard />;
}

function AppContent() {
  const { isAuthenticated, authLoading } = useAuth();

  if (authLoading) {
    return <Loader fullPage />;
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <AppProvider>
      <DashboardRouter />
    </AppProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: 'var(--radius-md)',
          },
          success: {
            style: {
              background: 'var(--color-success)',
              color: '#ffffff',
            },
          },
          error: {
            style: {
              background: 'var(--color-danger)',
              color: '#ffffff',
            },
          },
        }}
      />
      <AppContent />
    </AuthProvider>
  );
}
