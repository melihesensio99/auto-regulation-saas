import { useState } from 'react';
import { EmptyPanel, ErrorPanel, LoadingPanel } from '../../../shared/components/feedback/StatePanels';
import type { CoachDashboardDto } from '../types';

interface TeamOverviewPanelProps {
    dashboard: CoachDashboardDto | undefined;
    isLoading: boolean;
    error: unknown;
}

export const TeamOverviewPanel = ({ dashboard, isLoading, error }: TeamOverviewPanelProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) {
        return <LoadingPanel message="Dashboard yukleniyor..." />;
    }

    if (error || !dashboard) {
        return <ErrorPanel message="Dashboard yuklenirken bir hata olustu." />;
    }

    const filteredAthletes = dashboard.athletePerformances.filter((athlete) =>
        athlete.fullName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filteredAthletes.length === 0) {
        return (
            <EmptyPanel
                icon="🔎"
                message="Aramana uygun sporcu bulunamadi."
                detail="Farkli bir isimle tekrar deneyebilirsin."
                minHeight={280}
            />
        );
    }

    return (
        <div className="card-stack animate-fade-in">
            <div className="surface" style={{ padding: 20 }}>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 16,
                        flexWrap: 'wrap',
                    }}
                >
                    <div>
                        <span className="section-label">Dikkat listesi</span>
                        <h3 style={{ marginTop: 8 }}>Takip edilmesi gereken sporcular</h3>
                    </div>

                    <input
                        type="search"
                        placeholder="Sporcu ara..."
                        value={searchQuery}
                        onChange={(event) => setSearchQuery(event.target.value)}
                        className="field-input"
                        style={{ maxWidth: 280 }}
                    />
                </div>

                <div className="card-stack" style={{ marginTop: 18 }}>
                    {filteredAthletes.map((athlete) => (
                        <article key={athlete.athleteId} className="surface" style={{ padding: 20 }}>
                            <div
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 16,
                                    flexWrap: 'wrap',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                                    <div
                                        className="brand-mark"
                                        style={{
                                            width: 42,
                                            height: 42,
                                            background: athlete.isActiveToday ? 'var(--grad-brand)' : 'rgba(255,255,255,0.08)',
                                            color: athlete.isActiveToday ? '#07131a' : 'var(--text-secondary)',
                                        }}
                                    >
                                        {athlete.fullName
                                            .split(' ')
                                            .map((part) => part[0])
                                            .slice(0, 2)
                                            .join('')}
                                    </div>
                                    <div>
                                        <h4 style={{ fontSize: '1.2rem' }}>{athlete.fullName}</h4>
                                        <p className="caption" style={{ marginTop: 4 }}>
                                            {athlete.isActiveToday ? 'Bugun aktif' : 'Bugun kayit yok'}
                                        </p>
                                    </div>
                                    {athlete.needsAttention && <span className="chip chip--warning">Dikkat</span>}
                                </div>

                                <div className="pill-group">
                                    <span className={`chip ${athlete.hasWorkoutProgram ? 'chip--success' : 'chip--danger'}`}>
                                        Antrenman
                                    </span>
                                    <span className={`chip ${athlete.hasDietProgram ? 'chip--success' : 'chip--danger'}`}>
                                        Beslenme
                                    </span>
                                    <span className="chip">
                                        {athlete.lastLogDate
                                            ? new Date(athlete.lastLogDate).toLocaleDateString('tr-TR')
                                            : 'Kayit yok'}
                                    </span>
                                </div>
                            </div>

                            {athlete.attentionReason && (
                                <div className="timeline-card" style={{ marginTop: 16, padding: 16 }}>
                                    <span className="section-label">Neden dikkat?</span>
                                    <p style={{ marginTop: 8 }}>{athlete.attentionReason}</p>
                                </div>
                            )}
                        </article>
                    ))}
                </div>
            </div>
        </div>
    );
};
