import { useState } from 'react';
import { ChevronRight, Plus, User } from 'lucide-react';
import { useAthletes } from '../hooks/useDashboard';
import { AthleteProfile } from './AthleteProfile';
import { AddAthleteModal } from './AddAthleteModal';

export const AthletesTab = () => {
    const { data: athletes = [], isLoading } = useAthletes();
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    if (selectedAthleteId) {
        return (
            <div className="space-y-6">
                <button
                    type="button"
                    onClick={() => setSelectedAthleteId(null)}
                    className="inline-flex items-center rounded-2xl border border-cyan-400/30 px-4 py-2 text-sm text-cyan-200 transition hover:border-cyan-400/60 hover:text-white"
                >
                    Geri don
                </button>
                <AthleteProfile athleteId={selectedAthleteId} />
            </div>
        );
    }

    return (
        <section className="space-y-6">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Athletes</p>
                    <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">Takim sporculari</h2>
                    <p className="mt-2 max-w-2xl text-sm text-white/55">
                        Sporcularini tek listede gor, yeni hesap ekle ve detay ekranina gecerek programlarini yonet.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => setIsAdding(true)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110"
                >
                    <Plus className="h-4 w-4" />
                    Sporcu ekle
                </button>
            </div>

            {isLoading ? (
                <div className="rounded-[32px] border border-white/10 bg-[#111826] p-8 text-sm text-white/55">
                    Sporcular yukleniyor...
                </div>
            ) : athletes.length === 0 ? (
                <div className="rounded-[32px] border border-dashed border-white/10 bg-[#111826] p-10 text-center text-white/55">
                    Henuz sporcu yok. Ilk sporcuyu ekleyerek devam edebiliriz.
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                    {athletes.map((athlete) => (
                        <button
                            key={athlete.id}
                            type="button"
                            onClick={() => setSelectedAthleteId(athlete.id)}
                            className="group rounded-[28px] border border-white/8 bg-[#111826] p-6 text-left transition hover:border-cyan-400/30 hover:bg-[#131c2b]"
                        >
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                                        <User className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-white">
                                            {athlete.firstName} {athlete.lastName}
                                        </h3>
                                        <p className="mt-1 text-sm text-white/45">{athlete.phoneNumber || athlete.occupation || 'Sporcu profili'}</p>
                                    </div>
                                </div>

                                <ChevronRight className="h-5 w-5 text-white/30 transition group-hover:text-cyan-300" />
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
                                <div className="rounded-2xl border border-white/6 bg-black/15 px-4 py-3">
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">Kalori</span>
                                    <strong className="mt-2 block text-lg text-white">{athlete.targetCalories || '-'}</strong>
                                </div>
                                <div className="rounded-2xl border border-white/6 bg-black/15 px-4 py-3">
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">Adim</span>
                                    <strong className="mt-2 block text-lg text-white">{athlete.targetSteps || '-'}</strong>
                                </div>
                                <div className="rounded-2xl border border-white/6 bg-black/15 px-4 py-3">
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">Ana hedef</span>
                                    <strong className="mt-2 block text-base text-white">{athlete.mainReason || '-'}</strong>
                                </div>
                                <div className="rounded-2xl border border-white/6 bg-black/15 px-4 py-3">
                                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">Durum</span>
                                    <strong className="mt-2 block text-base text-white">
                                        {athlete.isOnboardingCompleted ? 'Aktif' : 'Onboarding'}
                                    </strong>
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {isAdding && <AddAthleteModal onClose={() => setIsAdding(false)} />}
        </section>
    );
};
