import type { ProgressLog } from '@/features/dashboard/types';
import { clampPercent, isSameLocalDay } from '../utils/dashboardMetrics';

interface AthleteTrendSectionProps {
    logs: ProgressLog[] | undefined;
    targetCalories: number;
    targetSteps: number;
    weeklySummary: {
        averageCalories: number;
        averageSteps: number;
        workoutCount: number;
        totalDays: number;
    };
    todayIso: string;
}

export const AthleteTrendSection = ({
    logs,
    targetCalories,
    targetSteps,
    weeklySummary,
    todayIso,
}: AthleteTrendSectionProps) => {
    return (
        <section className="rounded-[28px] border border-white/8 bg-[#0b111d] p-7 shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
            <div className="flex flex-col gap-5 border-b border-white/8 pb-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <span className="text-[11px] uppercase tracking-[0.28em] text-white/38">Trend ozeti</span>
                    <h2 className="mt-3 text-[28px] font-semibold tracking-[-0.05em] text-white">Son 7 gunun akisi</h2>
                    <p className="mt-2 text-sm leading-7 text-white/45">Son kayitlarini gun gun izleyip ritmini takip et.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/58">
                        Ort. {weeklySummary.averageCalories} kcal
                    </span>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/58">
                        Ort. {weeklySummary.averageSteps} adim
                    </span>
                    <span className="rounded-full border border-white/8 bg-white/[0.03] px-4 py-2 text-sm text-white/58">
                        Antrenman {weeklySummary.workoutCount}/{weeklySummary.totalDays}
                    </span>
                </div>
            </div>

            {!logs || logs.length === 0 ? (
                <div className="grid min-h-[240px] place-items-center rounded-[24px] border border-dashed border-white/8 bg-white/[0.02] text-center">
                    <div>
                        <div className="text-4xl text-white/20">∅</div>
                        <p className="mt-3 text-base text-white/52">Henuz kayit yok.</p>
                    </div>
                </div>
            ) : (
                <div className="mt-6 grid gap-4 xl:grid-cols-2">
                    {logs.map((log) => {
                        const calorieFill = targetCalories > 0 ? clampPercent(((log.consumedCalories ?? 0) / targetCalories) * 100) : 0;
                        const stepFill = targetSteps > 0 ? clampPercent(((log.takenSteps ?? 0) / targetSteps) * 100) : 0;
                        const completion = Math.round((calorieFill + stepFill + (log.isWorkoutCompleted ? 100 : 0)) / 3);
                        const isToday = isSameLocalDay(log.date, todayIso);

                        return (
                            <article
                                key={log.id}
                                className={`rounded-[24px] border p-5 shadow-[0_12px_30px_rgba(0,0,0,0.14)] ${
                                    isToday
                                        ? 'border-cyan-400/20 bg-cyan-400/[0.04]'
                                        : 'border-white/8 bg-white/[0.03]'
                                }`}
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <div className="text-[18px] font-semibold tracking-[-0.03em] text-white">
                                            {new Date(log.date).toLocaleDateString('tr-TR', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </div>
                                        <p className="mt-2 text-sm leading-7 text-white/45">{log.notes || 'Not birakilmamis.'}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-4 py-2 text-sm ${
                                            log.isWorkoutCompleted
                                                ? 'bg-emerald-500/10 text-emerald-300'
                                                : 'bg-amber-500/10 text-amber-300'
                                        }`}
                                    >
                                        {log.isWorkoutCompleted ? 'Antrenman var' : 'Dinlenme'}
                                    </span>
                                </div>

                                <div className="mt-5 grid gap-4 md:grid-cols-2">
                                    <div className="rounded-[20px] border border-white/6 bg-black/12 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm text-white/48">Kalori</span>
                                            <strong className="text-base text-white">{log.consumedCalories} kcal</strong>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                                            <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-300" style={{ width: `${calorieFill}%` }} />
                                        </div>
                                    </div>

                                    <div className="rounded-[20px] border border-white/6 bg-black/12 p-4">
                                        <div className="flex items-center justify-between gap-3">
                                            <span className="text-sm text-white/48">Adim</span>
                                            <strong className="text-base text-white">{log.takenSteps}</strong>
                                        </div>
                                        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/8">
                                            <div className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-lime-300" style={{ width: `${stepFill}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-5 flex items-center justify-between gap-4 border-t border-white/6 pt-4">
                                    <span className="text-sm text-white/45">Gunluk uyum</span>
                                    <strong className="text-[22px] font-semibold tracking-[-0.04em] text-white">{completion}%</strong>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
