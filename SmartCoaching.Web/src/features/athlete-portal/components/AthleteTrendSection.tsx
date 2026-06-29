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
        <section className="surface dashboard-section">
            <div className="section-header">
                <div>
                    <span className="section-label">Trend özeti</span>
                    <h2 style={{ marginTop: 8, fontSize: '1.8rem' }}>Son 7 günün akışı</h2>
                </div>
                <div className="button-group">
                    <span className="chip">Ort. {weeklySummary.averageCalories} kcal</span>
                    <span className="chip">Ort. {weeklySummary.averageSteps} adım</span>
                    <span className="chip">Antrenman {weeklySummary.workoutCount}/{weeklySummary.totalDays}</span>
                </div>
            </div>

            {(!logs || logs.length === 0) ? (
                <div className="empty-state">
                    <span className="empty-state-icon">∅</span>
                    <p>Henüz kayıt yok.</p>
                </div>
            ) : (
                <div className="trend-grid">
                    {logs.map(log => {
                        const calorieFill = targetCalories > 0 ? clampPercent(((log.consumedCalories ?? 0) / targetCalories) * 100) : 0;
                        const stepFill = targetSteps > 0 ? clampPercent(((log.takenSteps ?? 0) / targetSteps) * 100) : 0;
                        const completion = Math.round((calorieFill + stepFill + (log.isWorkoutCompleted ? 100 : 0)) / 3);
                        const isToday = isSameLocalDay(log.date, todayIso);

                        return (
                            <article key={log.id} className={`trend-log-card ${isToday ? 'trend-log-card--today' : ''}`}>
                                <div className="trend-log-card__top">
                                    <div>
                                        <div className="trend-log-card__date">
                                            {new Date(log.date).toLocaleDateString('tr-TR', {
                                                weekday: 'long',
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </div>
                                        <p className="caption" style={{ marginTop: 4 }}>
                                            {log.notes || 'Not bırakılmamış.'}
                                        </p>
                                    </div>
                                    <span className={`chip ${log.isWorkoutCompleted ? 'chip--success' : 'chip--warning'}`}>
                                        {log.isWorkoutCompleted ? 'Antrenman var' : 'Dinlenme'}
                                    </span>
                                </div>

                                <div className="trend-metrics">
                                    <div className="trend-metric">
                                        <div className="trend-metric__head">
                                            <span>Kalori</span>
                                            <strong>{log.consumedCalories} kcal</strong>
                                        </div>
                                        <div className="progress-bar progress-bar--small">
                                            <div className="progress-bar__fill" style={{ width: `${calorieFill}%` }} />
                                        </div>
                                    </div>

                                    <div className="trend-metric">
                                        <div className="trend-metric__head">
                                            <span>Adım</span>
                                            <strong>{log.takenSteps}</strong>
                                        </div>
                                        <div className="progress-bar progress-bar--small">
                                            <div className="progress-bar__fill progress-bar__fill--green" style={{ width: `${stepFill}%` }} />
                                        </div>
                                    </div>
                                </div>

                                <div className="trend-log-card__footer">
                                    <span className="caption">Günlük uyum</span>
                                    <strong>{completion}%</strong>
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}
        </section>
    );
};
