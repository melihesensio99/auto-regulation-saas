import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const AthleteLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', backgroundColor: 'var(--bg-dark)' }}>
            {/* Top Navigation Bar */}
            <header style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '15px 30px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(10px)'
            }}>
                <div className="brand-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/athlete/dashboard')}>
                    <div className="brand-icon">⚡</div>
                    <span className="brand-text">SmartCoaching</span>
                </div>
                
                <nav style={{ display: 'flex', gap: '20px' }}>
                    <button 
                        onClick={() => navigate('/athlete/dashboard')}
                        className={`tab-btn ${location.pathname === '/athlete/dashboard' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: location.pathname === '/athlete/dashboard' ? 'white' : 'var(--text-secondary)' }}
                    >
                        🏠 Ana Sayfa
                    </button>
                    <button 
                        onClick={() => navigate('/athlete/programs')}
                        className={`tab-btn ${location.pathname === '/athlete/programs' ? 'active' : ''}`}
                        style={{ padding: '8px 16px', borderRadius: '8px', border: 'none', background: 'transparent', cursor: 'pointer', color: location.pathname === '/athlete/programs' ? 'white' : 'var(--text-secondary)' }}
                    >
                        📋 Programlarım
                    </button>
                </nav>

                <button 
                    onClick={handleLogout}
                    style={{
                        padding: '8px 16px',
                        background: 'rgba(239, 68, 68, 0.1)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                        color: 'var(--danger)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    Çıkış Yap
                </button>
            </header>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: '30px', overflowY: 'auto' }}>
                <Outlet />
            </main>
        </div>
    );
};
