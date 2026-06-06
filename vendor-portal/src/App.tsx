import { useState } from 'react';
import { LoginBox } from './components/auth/LoginBox';
import { RegistrationBox } from './components/auth/RegistrationBox';
import { DashboardShell } from './components/dashboard/DashboardShell';
import './styles/theme.css';

type PageRoute = 'login' | 'register' | 'dashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState<PageRoute>('login');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {currentPage === 'login' && (
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <LoginBox 
            onLoginSuccess={() => setCurrentPage('dashboard')} 
            onNavigateToRegister={() => setCurrentPage('register')} 
          />
        </div>
      )}

      {currentPage === 'register' && (
        <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RegistrationBox 
            onRegisterSuccess={() => setCurrentPage('dashboard')} 
            onNavigateToLogin={() => setCurrentPage('login')} 
          />
        </div>
      )}

      {currentPage === 'dashboard' && (
        <DashboardShell onLogout={() => setCurrentPage('login')} />
      )}
    </div>
  );
}
