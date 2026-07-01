import { Bell, Search, User } from 'lucide-react';

export const CoachTopbar = () => {
    return (
        <header className="sticky top-0 z-20 ml-[230px] flex h-[92px] items-center justify-between border-b border-white/6 bg-[#0b1320]/90 px-7 backdrop-blur-xl xl:px-8">
            <div className="w-full max-w-[480px]">
                <div className="group relative">
                    <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-white/30 transition-colors group-focus-within:text-cyan-300" />
                    <input
                        type="text"
                        placeholder="Search athletes, programs..."
                        className="w-full rounded-[22px] border border-white/8 bg-[#15172b] py-4 pl-14 pr-5 text-[15px] text-white outline-none transition placeholder:text-white/28 focus:border-cyan-400/50"
                    />
                </div>
            </div>

            <div className="ml-4 flex items-center gap-4">
                <button className="relative grid h-12 w-12 place-items-center rounded-2xl border border-white/8 bg-white/5 text-white/60 transition hover:text-white">
                    <Bell className="h-5 w-5" />
                    <span className="absolute right-3 top-3 h-2 w-2 rounded-full bg-emerald-400"></span>
                </button>

                <div className="flex items-center gap-4 rounded-[22px] border border-white/8 bg-black/20 px-4 py-3">
                    <div className="grid h-10 w-10 place-items-center rounded-2xl bg-[#6a58b5] text-sm font-semibold text-white">
                        CA
                    </div>
                    <div className="min-w-[150px]">
                        <p className="text-[15px] font-medium text-white">Coach Workspace</p>
                        <p className="mt-0.5 text-sm text-white/42">Coach</p>
                    </div>
                    <User className="h-4 w-4 text-white/40" />
                </div>
            </div>
        </header>
    );
};
