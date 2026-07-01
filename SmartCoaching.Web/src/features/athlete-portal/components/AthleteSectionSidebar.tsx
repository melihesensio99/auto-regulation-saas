import React from 'react';
import { Home, Dumbbell, Utensils, Activity, ChevronRight, ClipboardList, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { clearStoredToken } from '@/shared/auth/token';

export type AthleteSectionKey = 'dashboard' | 'log' | 'workout' | 'diet';

interface AthleteSectionSidebarProps {
    activeSection: AthleteSectionKey;
    onSelect: (section: AthleteSectionKey) => void;
}

export const AthleteSectionSidebar: React.FC<AthleteSectionSidebarProps> = ({ activeSection, onSelect }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        clearStoredToken();
        navigate('/login');
    };

    const navItems = [
        { id: 'dashboard' as const, label: 'Dashboard', icon: Home },
        { id: 'log' as const, label: 'Log (Veri Girişi)', icon: ClipboardList },
        { id: 'workout' as const, label: 'Antrenman', icon: Dumbbell },
        { id: 'diet' as const, label: 'Beslenme', icon: Utensils },
    ];

    return (
        <aside className="fixed left-0 top-0 z-30 flex h-screen w-[230px] flex-col border-r border-white/6 bg-[#171433]">
            <div className="px-7 pb-8 pt-10">
                <button 
                    onClick={() => onSelect('dashboard')}
                    className="flex items-center gap-3 min-w-0 text-left cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/25 text-neon-cyan shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                        <h1 className="text-[20px] font-semibold leading-[0.92] tracking-[-0.035em] text-white">
                            <span className="block">Smart</span>
                            <span className="block">Coaching</span>
                        </h1>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.3em] text-white/35">Athlete</p>
                    </div>
                </button>
            </div>

            <nav className="flex-1 space-y-2 px-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelect(item.id)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
                            activeSection === item.id 
                            ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                            : 'text-white/58 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="text-[15px] font-medium">{item.label}</span>
                        </div>
                        {activeSection === item.id && <ChevronRight className="h-4 w-4 text-white/70" />}
                    </button>
                ))}
            </nav>

            <div className="p-4 mt-auto">
                <div className="rounded-[28px] border border-white/8 bg-[#10192a] p-5 mb-4">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Portal</p>
                    <p className="mt-3 text-xl font-semibold text-neon-cyan">Kişisel Takip</p>
                    <p className="mt-3 text-sm leading-7 text-white/52">
                        Hedeflerini, beslenmeni ve antrenmanlarını buradan yönet.
                    </p>
                </div>

                <div className="flex flex-col gap-3 rounded-2xl bg-black/20 p-3 border border-white/5">
                    <div className="flex items-center gap-3 px-2">
                        <div className="grid h-9 w-9 place-items-center rounded-xl bg-[#6a58b5] text-xs font-bold text-white">
                            AT
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-medium text-white truncate">Athlete Workspace</p>
                            <p className="text-[10px] uppercase tracking-wider text-emerald-400">Aktif</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm font-medium text-red-400 transition hover:bg-red-500/20 hover:text-red-300"
                    >
                        <LogOut className="h-4 w-4" />
                        Çıkış Yap
                    </button>
                </div>
            </div>
        </aside>
    );
};
