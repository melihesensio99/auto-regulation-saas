import { useMemo, useState } from 'react';
import { useAthletes, useCoachDashboard } from '@/features/dashboard/hooks/useDashboard';
import { AthleteDetailsTabs } from '@/features/dashboard/components/AthleteDetailsTabs';
import { AthleteList } from '@/features/dashboard/components/AthleteList';
import { CoachAssistantWidget } from '@/features/dashboard/components/CoachAssistantWidget';
import { CoachDashboardHeader } from '@/features/dashboard/components/CoachDashboardHeader';
import { CoachSelectedAthleteHero } from '@/features/dashboard/components/CoachSelectedAthleteHero';
import { CoachTeamHero } from '@/features/dashboard/components/CoachTeamHero';
import { TeamOverviewPanel } from '@/features/dashboard/components/TeamOverviewPanel';

export const Dashboard = () => {
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const { data: athletes, isLoading: athletesLoading, error: athletesError } = useAthletes();
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useCoachDashboard();

    const selectedAthlete = athletes?.find(athlete => athlete.id === selectedAthleteId);
    const selectedAthletePerformance = dashboardData?.athletePerformances?.find(item => item.athleteId === selectedAthleteId);

    const metrics = useMemo(() => [
        {
            label: 'Toplam sporcu',
            value: dashboardData?.totalAthletes ?? 0,
            hint: 'Takimdaki hesaplar'
        },
        {
            label: 'Bugun aktif',
            value: dashboardData?.dailyActiveAthletes ?? 0,
            hint: 'Bugun kayit yapanlar'
        },
        {
            label: 'Dikkat gereken',
            value: dashboardData?.needsAttentionCount ?? 0,
            hint: 'Eksik program veya kayit'
        }
    ], [dashboardData]);

    return (
        <div className="page-shell page-shell--coach">
            <CoachDashboardHeader metrics={metrics} />

            <main className={`coach-layout ${selectedAthleteId ? 'coach-layout--full' : ''}`}>
                {!selectedAthleteId && (
                    <aside className="sidebar">
                        <div className="sidebar-header">
                            <div>
                                <span className="section-label">Takim</span>
                                <h3 style={{ marginTop: 6 }}>Sporcularim</h3>
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
                )}

                <section className="coach-main">
                    {selectedAthleteId ? (
                        <>
                            <CoachSelectedAthleteHero
                                athlete={selectedAthlete}
                                athletePerformance={selectedAthletePerformance}
                                onBack={() => setSelectedAthleteId(null)}
                            />

                            <section className="surface" style={{ padding: 22, minHeight: 0 }}>
                                <AthleteDetailsTabs athleteId={selectedAthleteId} />
                            </section>
                        </>
                    ) : (
                        <>
                            <CoachTeamHero />

                            <TeamOverviewPanel
                                dashboard={dashboardData}
                                isLoading={dashboardLoading}
                                error={dashboardError}
                            />
                        </>
                    )}
                </section>
            </main>

            <CoachAssistantWidget
                contextAthleteId={selectedAthlete?.id ?? null}
                contextAthleteName={selectedAthlete ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}` : null}
            />
        </div>
    );
};
