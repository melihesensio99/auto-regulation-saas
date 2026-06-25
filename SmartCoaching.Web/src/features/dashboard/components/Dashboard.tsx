import { useState } from 'react';
import { useAthletes, useCoachDashboard } from '../hooks/useDashboard';
import { AthleteList } from './AthleteList';
import { AthleteDetailsTabs } from './AthleteDetailsTabs';
import { TeamOverviewPanel } from './TeamOverviewPanel';

export const Dashboard = () => {
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const { data: athletes, isLoading, error } = useAthletes();
    const { data: dashboardData } = useCoachDashboard();

    const selectedAthlete = athletes?.find(a => a.id === selectedAthleteId);
    const selectedPerformance = dashboardData?.athletePerformances?.find(p => p.athleteId === selectedAthleteId);

    const handleSelectAthlete = (id: string | null) => {
        setSelectedAthleteId(id);
    };

    const handleBack = () => {
        setSelectedAthleteId(null);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <span style={{ fontSize: '1.4rem' }}>🏔️</span>
                    Apex Athletics
                </div>
                <div className="navbar-user">
                    <span>Koç Paneli</span>
                    <div className="navbar-avatar">K</div>
                </div>
            </nav>

            {/* ANA İÇERİK */}
            {selectedAthleteId ? (
                /* ── TAM EKRAN: Sporcu Detayı ── */
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', padding: '20px', gap: '16px', overflow: 'hidden' }}>
                    {/* Geri Butonu + Sporcu Adı + Sekmeler */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                        <button
                            onClick={handleBack}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'rgba(255,255,255,0.07)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: '8px',
                                color: 'var(--text-secondary)',
                                fontSize: '0.82rem',
                                fontWeight: 600,
                                padding: '7px 14px',
                                cursor: 'pointer',
                                transition: 'all 0.15s ease',
                                flexShrink: 0,
                                marginBottom: '4px'
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                e.currentTarget.style.color = '#fff';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }}
                        >
                            ← Sporcularım
                        </button>
                    </div>

                    {/* Sporcu Adı ve Kalan Gün */}
                    {selectedAthlete && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '-6px' }}>
                            <div style={{
                                width: '4px',
                                height: '32px',
                                borderRadius: '4px',
                                background: 'linear-gradient(180deg, #6366f1, #8b5cf6)',
                                flexShrink: 0,
                            }} />
                            <h2 style={{
                                margin: 0,
                                fontSize: '1.45rem',
                                fontWeight: 800,
                                letterSpacing: '-0.03em',
                                background: 'linear-gradient(135deg, #ffffff 60%, #a5b4fc)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                {selectedAthlete.firstName} {selectedAthlete.lastName}
                            </h2>
                            {selectedPerformance && (
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    background: selectedPerformance.remainingSubscriptionDays < 7 ? 'rgba(239, 68, 68, 0.15)' : 'rgba(99, 102, 241, 0.15)',
                                    border: `1px solid ${selectedPerformance.remainingSubscriptionDays < 7 ? 'rgba(239, 68, 68, 0.3)' : 'rgba(99, 102, 241, 0.3)'}`,
                                    color: selectedPerformance.remainingSubscriptionDays < 7 ? '#f87171' : '#a5b4fc',
                                    padding: '4px 10px',
                                    borderRadius: '12px',
                                    fontSize: '0.75rem',
                                    fontWeight: 700,
                                    letterSpacing: '0.5px'
                                }}>
                                    ⏳ Kalan Üyelik: {selectedPerformance.remainingSubscriptionDays} Gün
                                </div>
                            )}
                        </div>
                    )}

                    {/* Sekmeli Detay — tam genişlik */}
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <AthleteDetailsTabs
                            athleteId={selectedAthleteId}
                        />
                    </div>
                </div>
            ) : (
                /* ── DASHBOARD: Sol Liste + Sağ Takım Özeti ── */
                <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', overflow: 'hidden' }}>
                    <AthleteList
                        athletes={athletes}
                        isLoading={isLoading}
                        error={error}
                        selectedAthleteId={null}
                        onSelectAthlete={handleSelectAthlete}
                    />
                    <div style={{ flex: 1, overflow: 'hidden' }}>
                        <TeamOverviewPanel />
                    </div>
                </div>
            )}
        </div>
    );
};
