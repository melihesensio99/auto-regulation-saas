import { useMemo, useState } from 'react';
import { AddAthleteModal } from '@/features/dashboard/components/AddAthleteModal';
import { AthleteDetailsTabs } from '@/features/dashboard/components/AthleteDetailsTabs';
import { CoachAssistantWidget } from '@/features/dashboard/components/CoachAssistantWidget';
import { CoachOverviewPanel } from '@/features/dashboard/components/CoachOverviewPanel';
import { CoachSelectedAthleteHero } from '@/features/dashboard/components/CoachSelectedAthleteHero';
import { CoachSidebar } from '@/features/dashboard/components/CoachSidebar';
import { CoachTopbar } from '@/features/dashboard/components/CoachTopbar';
import { useAthletes, useCoachDashboard } from '@/features/dashboard/hooks/useDashboard';
import { ErrorPanel, LoadingPanel } from '@/shared/components/feedback/StatePanels';
import {
    buildCoachOverviewRows,
    getDashboardSummaryStats,
} from '@/features/dashboard/utils/coachDashboardView';

const coachStatCards = [
    { title: 'Total athletes', accent: '+2 this month', icon: 'A', variant: '' },
    { title: 'Active', accent: '67%', icon: 'B', variant: 'coach-dashboard-stat--violet' },
    { title: 'Avg. adherence', accent: '+4.1%', icon: 'C', variant: 'coach-dashboard-stat--cyan' },
    { title: 'Weekly check-ins', accent: '-3 vs last wk', icon: 'D', variant: 'coach-dashboard-stat--amber' },
] as const;

export const Dashboard = () => {
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [isAddAthleteModalOpen, setIsAddAthleteModalOpen] = useState(false);

    const { data: athletes, isLoading: athletesLoading, error: athletesError } = useAthletes();
    const { data: dashboardData, isLoading: dashboardLoading, error: dashboardError } = useCoachDashboard();

    const selectedAthlete = athletes?.find((athlete) => athlete.id === selectedAthleteId);
    const selectedAthletePerformance = dashboardData?.athletePerformances?.find(
        (item) => item.athleteId === selectedAthleteId,
    );

    const rows = useMemo(
        () => buildCoachOverviewRows(athletes, dashboardData),
        [athletes, dashboardData],
    );

    const filteredRows = useMemo(() => {
        const normalizedQuery = searchQuery.trim().toLocaleLowerCase('tr-TR');

        if (!normalizedQuery) {
            return rows;
        }

        return rows.filter((row) =>
            `${row.fullName} ${row.goal}`.toLocaleLowerCase('tr-TR').includes(normalizedQuery),
        );
    }, [rows, searchQuery]);

    const summaryStats = useMemo(
        () => getDashboardSummaryStats(filteredRows),
        [filteredRows],
    );

    const statValues = [
        summaryStats.totalAthletes,
        summaryStats.activeCount,
        `${summaryStats.adherenceAverage}%`,
        summaryStats.weeklyCheckIns,
    ];

    return (
        <div className="coach-workspace">
            <CoachSidebar onSelectAthlete={setSelectedAthleteId} />

            <div className="coach-workspace__main">
                <CoachTopbar
                    searchQuery={searchQuery}
                    onSearchChange={setSearchQuery}
                />

                {selectedAthleteId ? (
                    <section className="coach-workspace__detail">
                        <CoachSelectedAthleteHero
                            athlete={selectedAthlete}
                            athletePerformance={selectedAthletePerformance}
                            onBack={() => setSelectedAthleteId(null)}
                        />

                        <section className="surface coach-athlete-detail-shell">
                            <AthleteDetailsTabs athleteId={selectedAthleteId} />
                        </section>
                    </section>
                ) : (
                    <section className="coach-workspace__overview">
                        <section className="coach-dashboard-hero">
                            <div className="coach-dashboard-hero__headline">
                                <div className="coach-dashboard-hero__copy">
                                    <span className="eyebrow">Coach Dashboard</span>
                                    <h1>Welcome back, Coach</h1>
                                    <p>Here&apos;s what&apos;s happening across your team today.</p>
                                </div>

                                <button
                                    type="button"
                                    className="coach-dashboard-hero__link"
                                    onClick={() => setIsAddAthleteModalOpen(true)}
                                >
                                    + Invite athlete
                                </button>
                            </div>

                            <div className="coach-dashboard-hero__metrics">
                                {coachStatCards.map((card, index) => (
                                    <article
                                        key={card.title}
                                        className={`coach-dashboard-stat ${card.variant}`.trim()}
                                    >
                                        <span>{card.title}</span>
                                        <strong>{statValues[index]}</strong>
                                        <small>{card.accent}</small>
                                        <div className={`coach-dashboard-stat__icon coach-dashboard-stat__icon--${['teal', 'violet', 'cyan', 'amber'][index]}`}>
                                            {card.icon}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        </section>

                        {athletesLoading || dashboardLoading ? (
                            <LoadingPanel message="Coach dashboard is loading..." />
                        ) : athletesError || dashboardError ? (
                            <ErrorPanel message="Coach dashboard could not be loaded." />
                        ) : (
                            <CoachOverviewPanel
                                rows={filteredRows}
                                onSelectAthlete={setSelectedAthleteId}
                            />
                        )}
                    </section>
                )}
            </div>

            <CoachAssistantWidget
                contextAthleteId={selectedAthlete?.id ?? null}
                contextAthleteName={
                    selectedAthlete
                        ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}`
                        : null
                }
            />

            <AddAthleteModal
                isOpen={isAddAthleteModalOpen}
                onClose={() => setIsAddAthleteModalOpen(false)}
            />
        </div>
    );
};
