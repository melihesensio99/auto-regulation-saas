import type { Athlete, AthletePerformanceDto } from '../types';

interface CoachSelectedAthleteHeroProps {
    athlete: Athlete | undefined;
    athletePerformance: AthletePerformanceDto | undefined;
    onBack: () => void;
}

export const CoachSelectedAthleteHero = ({
    athlete,
    athletePerformance,
    onBack,
}: CoachSelectedAthleteHeroProps) => {
    return (
        <section className="coach-hero surface">
            <div className="coach-hero__grid">
                <div className="card-stack">
                    <span className="eyebrow">Athlete focus</span>
                    <div>
                        <h2 className="page-title" style={{ fontSize: '2.2rem' }}>
                            {athlete?.firstName} {athlete?.lastName}
                        </h2>
                        <p className="page-subtitle" style={{ marginTop: 10 }}>
                            Sporcunun son durumu ve program ozetini tek bakista gor.
                        </p>
                    </div>
                    <div className="button-group">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onBack}
                        >
                            Takim ozetine don
                        </button>
                        {athletePerformance && (
                            <span className={`chip ${athletePerformance.isActiveToday ? 'chip--success' : 'chip--warning'}`}>
                                {athletePerformance.isActiveToday ? 'Bugun aktif' : 'Bugun kayit yok'}
                            </span>
                        )}
                        {athletePerformance?.needsAttention && (
                            <span className="chip chip--warning">Dikkat</span>
                        )}
                    </div>
                </div>

                <div className="card-stack">
                    <div className="metric-card">
                        <span className="metric-card__label">Son kayit</span>
                        <span className="metric-card__value">
                            {athletePerformance?.lastLogDate ? new Date(athletePerformance.lastLogDate).toLocaleDateString('tr-TR') : '-'}
                        </span>
                        <div className="metric-card__hint">Guncellenme tarihi</div>
                    </div>
                    {athletePerformance && (
                        <div className="timeline-card" style={{ padding: 18 }}>
                            <span className="section-label">Program durumu</span>
                            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                                <span>{athletePerformance.hasWorkoutProgram ? 'Antrenman var' : 'Antrenman eksik'}</span>
                                <span>{athletePerformance.hasDietProgram ? 'Beslenme var' : 'Beslenme eksik'}</span>
                                {athletePerformance.attentionReason && <span className="caption">{athletePerformance.attentionReason}</span>}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};
