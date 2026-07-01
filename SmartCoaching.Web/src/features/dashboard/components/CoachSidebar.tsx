import React from 'react';
import { Home, Users, MessageSquare, Activity, ChevronRight } from 'lucide-react';

interface CoachSidebarProps {
    activeTab: string;
    onSelectTab: (tab: string) => void;
}

export const CoachSidebar: React.FC<CoachSidebarProps> = ({ activeTab, onSelectTab }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home },
        { id: 'athletes', label: 'Athletes', icon: Users },
        { id: 'assistant', label: 'AI Assistant', icon: MessageSquare },
    ];

    return (
        <aside className="fixed left-0 top-0 z-30 flex h-screen w-[230px] flex-col border-r border-white/6 bg-[#171433]">
            <div className="px-7 pb-8 pt-10">
                <div className="flex items-center gap-4">
                    <div className="grid h-11 w-11 place-items-center rounded-2xl bg-black/25 text-cyan-300 shadow-[0_10px_30px_rgba(0,0,0,0.25)]">
                        <Activity className="h-5 w-5" />
                    </div>
                    <div>
                        <h1 className="text-[26px] font-semibold tracking-[-0.04em] text-white">SmartCoaching</h1>
                        <p className="mt-1 text-[11px] uppercase tracking-[0.34em] text-white/35">Pro suite</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 space-y-2 px-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onSelectTab(item.id)}
                        className={`flex w-full items-center justify-between rounded-2xl px-4 py-4 transition-all duration-300 ${
                            activeTab === item.id 
                            ? 'bg-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]' 
                            : 'text-white/58 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className="w-5 h-5" />
                            <span className="text-[15px] font-medium">{item.label}</span>
                        </div>
                        {activeTab === item.id && <ChevronRight className="h-4 w-4 text-white/70" />}
                    </button>
                ))}
            </nav>

            <div className="p-4">
                <div className="rounded-[28px] border border-white/8 bg-[#10192a] p-5">
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Active plan</p>
                    <p className="mt-3 text-xl font-semibold text-emerald-300">Coach Elite</p>
                    <p className="mt-3 text-sm leading-7 text-white/52">
                        Takip, hedef ve asistan akislarini bu panelden yonet.
                    </p>
                </div>
            </div>
        </aside>
    );
};
