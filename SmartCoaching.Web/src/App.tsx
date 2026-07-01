import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { AuthGuard } from './features/auth/components/AuthGuard';
import { Login } from './features/auth/components/Login';
import { ChangePassword } from './features/auth/components/ChangePassword';
import { Dashboard } from './features/dashboard/components/Dashboard';
import { Onboarding } from './features/dashboard/components/Onboarding';
import { AthleteLayout } from './layouts/AthleteLayout';
import { AthleteDashboard } from './features/athlete-portal/components/AthleteDashboard';
import { AthletePrograms } from './features/athlete-portal/components/AthletePrograms';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/change-password" element={<AuthGuard><ChangePassword /></AuthGuard>} />
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
