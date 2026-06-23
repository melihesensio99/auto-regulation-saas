import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import { Login } from './features/auth/components/Login';

const Dashboard = () => (
  <div style={{ padding: '40px' }}>
    <h1>Koç Paneli</h1>
    <p>Yakında burası grafikler ve AI analizleriyle dolacak!</p>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Şimdilik direkt Login'e yönlendiriyoruz */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
