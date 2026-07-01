import { Outlet, useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { clearStoredToken } from '@/shared/auth/token';

export const AthleteLayout = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearStoredToken();
        navigate('/login');
    };

    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#0b101a_0%,#071824_100%)] text-white">
            <header className="sticky top-0 z-20 border-b border-white/6 bg-[#08131f]/92 px-8 py-6 backdrop-blur-xl">
                <div className="mx-auto flex w-full max-w-[1600px] justify-end">
                    <div className="flex items-center gap-4 rounded-[24px] border border-white/8 bg-black/15 px-4 py-3">
                        <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6a58b5] text-sm font-semibold text-white">
                            AT
                        </div>
                        <div className="min-w-[170px]">
                            <p className="text-[15px] font-medium text-white">Athlete Workspace</p>
                            <p className="mt-0.5 text-sm text-white/42">Sporcu</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 px-4 py-2 text-sm text-white/65 transition hover:border-white/20 hover:text-white"
                            title="Logout"
                        >
                            <LogOut className="h-4 w-4" />
                            Cikis yap
                        </button>
                    </div>
                </div>
            </header>

            <main className="mx-auto w-full max-w-[1600px] px-8 py-8">
                <Outlet context={{ onLogout: handleLogout }} />
            </main>
        </div>
    );
};
