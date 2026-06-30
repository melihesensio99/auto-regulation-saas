import type { CoachOverviewRow } from '@/features/dashboard/utils/coachDashboardView';
import { EmptyPanel } from '@/shared/components/feedback/StatePanels';

interface CoachOverviewPanelProps {
    rows: CoachOverviewRow[];
    onSelectAthlete: (athleteId: string) => void;
}

const toneClassMap = {
    success: 'success',
    warning: 'warning',
    danger: 'danger',
    neutral: 'neutral',
} as const;

export const CoachOverviewPanel = ({
    rows,
    onSelectAthlete,
}: CoachOverviewPanelProps) => {
    if (rows.length === 0) {
        return (
            <EmptyPanel
                icon="+"
                message="No athletes match this search."
                detail="Try clearing the search field."
                minHeight={360}
            />
        );
    }

    const recentRows = [...rows]
        .sort((a, b) => {
            if (a.lastCheckIn === 'No check-in') return 1;
            if (b.lastCheckIn === 'No check-in') return -1;
            return a.lastCheckIn.localeCompare(b.lastCheckIn);
        })
        .slice(0, 4);

    return (
        <section className="coach-overview-grid animate-fade-in">
            <article className="coach-overview-card coach-overview-card--table">
                <div className="coach-overview-card__header">
                    <div>
                        <h2>My Athletes</h2>
                        <p>Live athlete roster with adherence and latest check-ins.</p>
                    </div>
                    <button type="button" className="coach-overview-card__link-button">
                        View all
                    </button>
                </div>

                <div className="coach-overview-table">
                    <div className="coach-overview-table__head">
                        <span>Athlete</span>
                        <span>Goal</span>
                        <span>Adherence</span>
                        <span>Weight</span>
                        <span>Last check-in</span>
                        <span>Status</span>
                    </div>

                    {rows.map((row) => (
                        <button
                            key={row.athleteId}
                            type="button"
                            className="coach-overview-row"
                            onClick={() => onSelectAthlete(row.athleteId)}
                        >
                            <span className="coach-overview-row__athlete">
                                <span className="coach-overview-row__avatar">{row.initials}</span>
                                <span>
                                    <strong>{row.fullName}</strong>
                                    <small>{row.goal}</small>
                                </span>
                            </span>

                            <span className="coach-overview-row__goal">{row.goal}</span>

                            <span className="coach-overview-row__adherence">
                                <span className="coach-overview-row__adherence-bar">
                                    <span style={{ width: `${row.adherence}%` }} />
                                </span>
                                <strong>{row.adherence}%</strong>
                            </span>

                            <span className="coach-overview-row__target">
                                <strong>{row.weightKg ? `${row.weightKg} kg` : '-'}</strong>
                                <small>{row.targetSteps ?? '-'} step goal</small>
                            </span>

                            <span className="coach-overview-row__last">{row.lastCheckIn}</span>

                            <span className="coach-overview-row__status">
                                <span className={`coach-feed-card__tone coach-feed-card__tone--${toneClassMap[row.statusTone]}`}>
                                    {row.statusLabel}
                                </span>
                                <span className="coach-overview-row__arrow">{'>'}</span>
                            </span>
                        </button>
                    ))}
                </div>
            </article>

            <article className="coach-overview-card coach-overview-card--feed">
                <div className="coach-overview-card__header">
                    <div>
                        <h2>Recent check-ins</h2>
                        <p>Live progress logs from your athletes.</p>
                    </div>
                </div>

                <div className="coach-feed-list">
                    {recentRows.map((row) => (
                        <button
                            key={`${row.athleteId}-feed`}
                            type="button"
                            className="coach-feed-card"
                            onClick={() => onSelectAthlete(row.athleteId)}
                        >
                            <div className="coach-feed-card__top">
                                <div>
                                    <strong>{row.fullName}</strong>
                                    <span>{row.goal}</span>
                                </div>
                                <span className={`coach-feed-card__tone coach-feed-card__tone--${toneClassMap[row.statusTone]}`}>
                                    {row.statusLabel}
                                </span>
                            </div>

                            <div className="coach-feed-card__metrics">
                                <div>
                                    <span>Weight</span>
                                    <strong>{row.weightKg ? `${row.weightKg} kg` : '-'}</strong>
                                </div>
                                <div>
                                    <span>Calories</span>
                                    <strong>{row.targetCalories ?? '-'}</strong>
                                </div>
                                <div>
                                    <span>Steps</span>
                                    <strong>{row.targetSteps ?? '-'}</strong>
                                </div>
                            </div>

                            <p className="coach-feed-card__quote">
                                {row.attentionReason
                                    ? row.attentionReason
                                    : row.isActiveToday
                                        ? 'Felt strong on pulls today.'
                                        : 'Sleep was rough - still tracking.'}
                            </p>
                        </button>
                    ))}
                </div>
            </article>
        </section>
    );
};
