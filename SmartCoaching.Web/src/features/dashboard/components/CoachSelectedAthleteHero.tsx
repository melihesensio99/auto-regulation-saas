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
    const targetCalories = athlete?.targetCalories ?? 0;
    const targetSteps = athlete?.targetSteps ?? 0;
    const weightKg = athlete?.startingWeightKg ?? null;
    const shortGoal =
        athlete?.shortTermGoal ||
        athlete?.mainReason ||
        athlete?.longTermGoal ||
        'Goal not defined';

    return (
        <section className="coach-athlete-workspace surface">
            <div className="coach-athlete-workspace__hero">
                <div className="coach-athlete-workspace__intro">
                    <span className="eyebrow">Athlete workspace</span>
                    <h1>
                        {athlete?.firstName} {athlete?.lastName}
                    </h1>
                    <p>
                        Athlete overview, adherence, targets and planning details in one workspace.
                    </p>

                    <div className="button-group">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={onBack}
                        >
                            Back to dashboard
                        </button>
                        <span className="chip">{shortGoal}</span>
                        {athletePerformance && (
                            <span className={`chip ${athletePerformance.isActiveToday ? 'chip--success' : 'chip--warning'}`}>
                                {athletePerformance.isActiveToday ? 'Active today' : 'No log today'}
                            </span>
                        )}
                    </div>
                </div>

                <div className="coach-athlete-workspace__stats">
                    <article className="coach-dashboard-stat">
                        <span>Target calories</span>
                        <strong>{targetCalories || '-'}</strong>
                        <small>Current calorie target</small>
                    </article>
                    <article className="coach-dashboard-stat coach-dashboard-stat--cyan">
                        <span>Target steps</span>
                        <strong>{targetSteps || '-'}</strong>
                        <small>Current step target</small>
                    </article>
                    <article className="coach-dashboard-stat coach-dashboard-stat--violet">
                        <span>Starting weight</span>
                        <strong>{weightKg ? `${weightKg} kg` : '-'}</strong>
                        <small>Initial athlete profile</small>
                    </article>
                    <article className="coach-dashboard-stat coach-dashboard-stat--amber">
                        <span>Status</span>
                        <strong>{athletePerformance?.needsAttention ? 'Pending' : 'Tracking'}</strong>
                        <small>
                            {athletePerformance?.attentionReason ||
                                (athletePerformance?.hasWorkoutProgram && athletePerformance?.hasDietProgram
                                    ? 'Plans are ready'
                                    : 'Program setup still needed')}
                        </small>
                    </article>
                </div>
            </div>
        </section>
    );
};
