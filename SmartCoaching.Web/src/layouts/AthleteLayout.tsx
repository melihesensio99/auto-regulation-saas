import { Outlet, useNavigate, useLocation } from 'react-router-dom';

export const AthleteLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="page-shell page-shell--athlete">
            <header className="athlete-header surface">
                <div className="athlete-header__brand brand-logo" style={{ cursor: 'pointer' }} onClick={() => navigate('/athlete/dashboard')}>
                    <div className="brand-mark">SC</div>
                    <div>
                        <div className="brand-text">SmartCoaching</div>
                        <div className="caption">Athlete space</div>
                    </div>
                </div>

                <nav className="navbar-center">
                    <button
                        type="button"
                        className={`tab-btn ${location.pathname === '/athlete/dashboard' ? 'active' : ''}`}
                        onClick={() => navigate('/athlete/dashboard')}
                    >
                        Ana sayfa
                    </button>
                    <button
                        type="button"
                        className={`tab-btn ${location.pathname === '/athlete/programs' ? 'active' : ''}`}
                        onClick={() => navigate('/athlete/programs')}
                    >
                        Programlarım
                    </button>
                </nav>

                <div className="athlete-header__actions">
                    <span className="chip">Kişisel panel</span>
                    <button type="button" className="btn btn-secondary" onClick={handleLogout}>
                        Çıkış yap
                    </button>
                </div>
            </header>

            <main className="athlete-content surface" style={{ padding: 24, minHeight: 'calc(100vh - 120px)' }}>
                <Outlet />
            </main>
        </div>
    );
};
