import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { Login } from './features/auth/components/Login';
import { Dashboard } from './features/dashboard/components/Dashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
