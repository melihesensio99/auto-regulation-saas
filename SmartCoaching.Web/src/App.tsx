import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { Login } from './features/auth/components/Login';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { Onboarding } from './features/dashboard/components/Onboarding';
import { AthleteLayout } from './layouts/AthleteLayout';
import { AthleteDashboard } from './features/athlete-portal/components/AthleteDashboard';
import { AthletePrograms } from './features/athlete-portal/components/AthletePrograms';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token');
  if (!token) return <Navigate to="/login" replace />;
  
  try {
      const payloadStr = atob(token.split('.')[1]);
      const payload = JSON.parse(payloadStr);
      const role = payload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
      const isOnboardingCompleted = payload['isOnboardingCompleted'];

      // Dashboard'a gitmeye çalışıyor ama onboarding yapmamış
      if (role === 'Athlete' && isOnboardingCompleted === 'False' && window.location.pathname !== '/onboarding') {
          return <Navigate to="/onboarding" replace />;
      }
      
      // Onboarding'e gitmeye çalışıyor ama zaten yapmış
      if (role === 'Athlete' && isOnboardingCompleted === 'True' && window.location.pathname === '/onboarding') {
          return <Navigate to="/athlete/dashboard" replace />;
      }

      // Sporcu ise coach dashboard'a girmesini engelle
      if (role === 'Athlete' && window.location.pathname === '/dashboard') {
          return <Navigate to="/athlete/dashboard" replace />;
      }

      // Koç ise athlete sayfasına girmesini engelle
      if (role === 'Coach' && window.location.pathname.startsWith('/athlete')) {
          return <Navigate to="/dashboard" replace />;
      }

  } catch (e) {
      return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
        <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
        
        <Route path="/athlete" element={<AuthGuard><AthleteLayout /></AuthGuard>}>
            <Route path="dashboard" element={<AthleteDashboard />} />
            <Route path="programs" element={<AthletePrograms />} />
        </Route>

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
