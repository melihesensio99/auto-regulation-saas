import { useMemo, useState } from 'react';
import { useAthletes, useCoachDashboard } from '../hooks/useDashboard';
import { AthleteList } from './AthleteList';
import { AthleteDetailsTabs } from './AthleteDetailsTabs';
import { TeamOverviewPanel } from './TeamOverviewPanel';

export const Dashboard = () => {
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const { data: athletes, isLoading: athletesLoading, error: athletesError } = useAthletes();
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useCoachDashboard();

    const selectedAthlete = athletes?.find(a => a.id === selectedAthleteId);
    const selectedCard = dashboardData?.athletePerformances?.find(p => p.athleteId === selectedAthleteId);

    const metrics = useMemo(() => [
        {
            label: 'Toplam sporcu',
            value: dashboardData?.totalAthletes ?? 0,
            hint: 'Takımdaki hesaplar'
        },
        {
            label: 'Bugün aktif',
            value: dashboardData?.dailyActiveAthletes ?? 0,
            hint: 'Bugün kayıt yapanlar'
        },
        {
            label: 'Dikkat gereken',
            value: dashboardData?.needsAttentionCount ?? 0,
            hint: 'Eksik program veya kayıt'
        }
    ], [dashboardData]);

    return (
        <div className="page-shell page-shell--coach">
            <header className="coach-header surface">
                <div className="coach-header__brand">
                    <div className="brand-mark">SC</div>
                    <div>
                        <span className="eyebrow">Coach console</span>
                        <h1 style={{ marginTop: 8, fontSize: '1.7rem' }}>SmartCoaching</h1>
                    </div>
                </div>

                <div className="stats-grid" style={{ flex: 1, maxWidth: 720 }}>
                    {metrics.map(metric => (
                        <div key={metric.label} className="metric-card">
                            <span className="metric-card__label">{metric.label}</span>
                            <span className="metric-card__value">{metric.value}</span>
                            <div className="metric-card__hint">{metric.hint}</div>
                        </div>
                    ))}
                </div>

                <div className="coach-header__actions">
                    <span className="chip chip--success">Live</span>
                    <div className="navbar-avatar">K</div>
                </div>
            </header>

            <main className="coach-layout">
                <aside className="sidebar">
                    <div className="sidebar-header">
                        <div>
                            <span className="section-label">Takım</span>
                            <h3 style={{ marginTop: 6 }}>Sporcularım</h3>
                        </div>
                    </div>

                    <div className="sidebar-body">
                        <AthleteList
                            athletes={athletes}
                            isLoading={athletesLoading}
                            error={athletesError}
                            selectedAthleteId={selectedAthleteId}
                            onSelectAthlete={setSelectedAthleteId}
                        />
                    </div>
                </aside>

                <section className="coach-main">
                    {selectedAthleteId ? (
                        <>
                            <section className="coach-hero surface">
                                <div className="coach-hero__grid">
                                    <div className="card-stack">
                                        <span className="eyebrow">Athlete focus</span>
                                        <div>
                                            <h2 className="page-title" style={{ fontSize: '2.2rem' }}>
                                                {selectedAthlete?.firstName} {selectedAthlete?.lastName}
                                            </h2>
                                            <p className="page-subtitle" style={{ marginTop: 10 }}>
                                                Sporcunun son durumu ve program özetini tek bakışta gör.
                                            </p>
                                        </div>
                                        <div className="button-group">
                                            <button
                                                type="button"
                                                className="btn btn-secondary"
                                                onClick={() => setSelectedAthleteId(null)}
                                            >
                                                Takım özetine dön
                                            </button>
                                            {selectedCard && (
                                                <span className={`chip ${selectedCard.isActiveToday ? 'chip--success' : 'chip--warning'}`}>
                                                    {selectedCard.isActiveToday ? 'Bugün aktif' : 'Bugün kayıt yok'}
                                                </span>
                                            )}
                                            {selectedCard?.needsAttention && (
                                                <span className="chip chip--warning">Dikkat</span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="card-stack">
                                        <div className="metric-card">
                                            <span className="metric-card__label">Son kayıt</span>
                                            <span className="metric-card__value">
                                                {selectedCard?.lastLogDate ? new Date(selectedCard.lastLogDate).toLocaleDateString('tr-TR') : '-'}
                                            </span>
                                            <div className="metric-card__hint">Güncellenme tarihi</div>
                                        </div>
                                        {selectedCard && (
                                            <div className="timeline-card" style={{ padding: 18 }}>
                                                <span className="section-label">Program durumu</span>
                                                <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
                                                    <span>{selectedCard.hasWorkoutProgram ? 'Antrenman var' : 'Antrenman eksik'}</span>
                                                    <span>{selectedCard.hasDietProgram ? 'Beslenme var' : 'Beslenme eksik'}</span>
                                                    {selectedCard.attentionReason && <span className="caption">{selectedCard.attentionReason}</span>}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </section>

                            <section className="surface" style={{ padding: 22, minHeight: 0 }}>
                                <AthleteDetailsTabs athleteId={selectedAthleteId} />
                            </section>
                        </>
                    ) : (
                        <>
                            <section className="coach-hero surface">
                                <div className="coach-hero__grid">
                                    <div className="card-stack">
                                        <span className="eyebrow">Team overview</span>
                                        <div>
                                            <h2 className="page-title" style={{ fontSize: '2.5rem' }}>
                                                Takımın bugünü nasıl?
                                            </h2>
                                            <p className="page-subtitle" style={{ marginTop: 12 }}>
                                                Sadece kritik özetler ve dikkat edilmesi gereken sporcular.
                                            </p>
                                        </div>
                                        <div className="pill-group">
                                            <span className="chip chip--success">Bugün aktif</span>
                                            <span className="chip">Eksik program</span>
                                            <span className="chip">Kayıt takibi</span>
                                        </div>
                                    </div>

                                    <div className="timeline-card" style={{ padding: 18 }}>
                                        <span className="section-label">Dashboard mantığı</span>
                                        <p style={{ marginTop: 10 }}>
                                            Bu ekran artık sadece özet verir: kaç sporcu var, bugün kim aktif ve kim takip istiyor.
                                            Detaylar seçilen sporcunun sayfalarında açılır.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            <TeamOverviewPanel
                                dashboard={dashboardData}
                                isLoading={dashboardLoading}
                                error={dashboardError}
                            />
                        </>
                    )}
                </section>
            </main>
        </div>
    );
};
