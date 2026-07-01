interface AthleteTargetsSectionProps {
    targetCalories: number;
    targetSteps: number;
    consumedCalories: number;
    takenSteps: number;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
}

export const AthleteTargetsSection = ({
    targetCalories,
    targetSteps,
    consumedCalories,
    takenSteps,
    calorieProgress,
    stepProgress,
    dailyCompletion,
}: AthleteTargetsSectionProps) => {
    return (
        <div className="space-y-6">
            <section className="rounded-[28px] border border-white/8 bg-[#0b111d] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                <div className="flex items-start justify-between gap-4 border-b border-white/8 pb-5">
                    <div>
                        <span className="text-[11px] uppercase tracking-[0.28em] text-white/38">Hedefler</span>
                        <h3 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-white">Gunluk ilerleme</h3>
                        <p className="mt-2 text-sm leading-7 text-white/45">Kalori, adim ve genel uyum akisini tek panelde gor.</p>
                    </div>
                </div>

                <div className="mt-6 grid gap-4 xl:grid-cols-3">
                    <article className={`rounded-[24px] border ${calorieProgress > 100 ? 'border-red-500/50 bg-red-500/[0.04] shadow-[0_0_20px_rgba(239,68,68,0.15)]' : 'border-white/8 bg-white/[0.03]'} p-5 transition-all`}>
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className={`text-[11px] uppercase tracking-[0.24em] ${calorieProgress > 100 ? 'text-red-400/80' : 'text-white/38'}`}>Kalori hedefi</span>
                                <div className={`mt-4 text-[34px] font-semibold tracking-[-0.05em] ${calorieProgress > 100 ? 'text-red-500' : 'text-white'}`}>{targetCalories || '-'}</div>
                            </div>
                            <span className={`rounded-full px-4 py-2 text-sm ${calorieProgress > 100 ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-300'}`}>{Math.round(calorieProgress)}%</span>
                        </div>
                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                            <div className={`h-full rounded-full bg-gradient-to-r ${calorieProgress > 100 ? 'from-red-500 to-rose-400' : 'from-cyan-400 to-cyan-300'}`} style={{ width: `${Math.min(100, calorieProgress)}%` }} />
                        </div>
                        <div className={`mt-4 flex items-center justify-between gap-4 text-sm ${calorieProgress > 100 ? 'text-red-400/80' : 'text-white/45'}`}>
                            <span>{consumedCalories} / {targetCalories || '-'} kcal</span>
                            <span>{calorieProgress > 100 ? 'Hedef Asildi!' : 'Bugunluk ilerleme'}</span>
                        </div>
                    </article>

                    <article className="rounded-[24px] border border-white/8 bg-white/[0.03] p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] uppercase tracking-[0.24em] text-white/38">Adim hedefi</span>
                                <div className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-white">{targetSteps || '-'}</div>
                            </div>
                            <span className="rounded-full bg-emerald-500/10 px-4 py-2 text-sm text-emerald-300">{Math.round(stepProgress)}%</span>
                        </div>
                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300" style={{ width: `${Math.min(100, stepProgress)}%` }} />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/45">
                            <span>{takenSteps} / {targetSteps || '-'} adim</span>
                            <span>Hedefe yakinlik</span>
                        </div>
                    </article>

                    <article className="rounded-[24px] border border-violet-400/15 bg-violet-400/[0.04] p-5">
                        <div className="flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] uppercase tracking-[0.24em] text-white/38">Genel uyum</span>
                                <div className="mt-4 text-[34px] font-semibold tracking-[-0.05em] text-white">{dailyCompletion}%</div>
                            </div>
                            <span className="rounded-full bg-violet-400/10 px-4 py-2 text-sm text-violet-200">{dailyCompletion >= 80 ? 'Guclu' : 'Takipte'}</span>
                        </div>
                        <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/8">
                            <div className="h-full rounded-full bg-gradient-to-r from-violet-400 to-fuchsia-400" style={{ width: `${dailyCompletion}%` }} />
                        </div>
                        <div className="mt-4 flex items-center justify-between gap-4 text-sm text-white/45">
                            <span>Kalori + adim + antrenman dengesi</span>
                            <span>Gun sonu skoru</span>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};
