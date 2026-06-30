import type { Athlete, AthletePerformanceDto, CoachDashboardDto } from '@/features/dashboard/types';

export interface CoachOverviewRow {
    athleteId: string;
    fullName: string;
    initials: string;
    goal: string;
    adherence: number;
    weightKg: number | null;
    targetCalories: number | null;
    targetSteps: number | null;
    lastCheckIn: string;
    statusLabel: string;
    statusTone: 'success' | 'warning' | 'danger' | 'neutral';
    hasWorkoutProgram: boolean;
    hasDietProgram: boolean;
    isActiveToday: boolean;
    attentionReason: string | null;
}

const fallbackGoal = 'Hedef tanimlanmadi';

export const calculateAdherenceScore = (performance?: AthletePerformanceDto | null) => {
    if (!performance) {
        return 18;
    }

    let score = 24;

    if (performance.hasWorkoutProgram) score += 26;
    if (performance.hasDietProgram) score += 26;
    if (performance.isActiveToday) score += 18;
    if (!performance.needsAttention) score += 12;

    return Math.min(score, 100);
};

export const formatRelativeLogDate = (date: string | null) => {
    if (!date) {
        return 'No check-in';
    }

    const logDate = new Date(date);
    const now = new Date();
    const diffInMs = now.getTime() - logDate.getTime();
    const diffInHours = Math.max(0, Math.floor(diffInMs / (1000 * 60 * 60)));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;

    return logDate.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
    });
};

const getStatusMeta = (performance?: AthletePerformanceDto | null) => {
    if (!performance) {
        return { label: 'Inactive', tone: 'neutral' as const };
    }

    if (performance.needsAttention) {
        return { label: 'Pending', tone: 'warning' as const };
    }

    if (performance.isActiveToday) {
        return { label: 'Active', tone: 'success' as const };
    }

    if (!performance.hasWorkoutProgram || !performance.hasDietProgram) {
        return { label: 'Needs setup', tone: 'danger' as const };
    }

    return { label: 'Tracking', tone: 'neutral' as const };
};

const getGoalLabel = (athlete?: Athlete) => {
    if (!athlete) return fallbackGoal;

    return (
        athlete.shortTermGoal?.trim() ||
        athlete.mainReason?.trim() ||
        athlete.longTermGoal?.trim() ||
        fallbackGoal
    );
};

const getInitials = (fullName: string) =>
    fullName
        .split(' ')
        .filter(Boolean)
        .map((part) => part[0]?.toUpperCase())
        .slice(0, 2)
        .join('');

export const buildCoachOverviewRows = (
    athletes: Athlete[] | undefined,
    dashboard: CoachDashboardDto | undefined,
) => {
    const athleteMap = new Map((athletes ?? []).map((athlete) => [athlete.id, athlete]));

    return (dashboard?.athletePerformances ?? []).map((performance) => {
        const athlete = athleteMap.get(performance.athleteId);
        const fullName = athlete
            ? `${athlete.firstName} ${athlete.lastName}`
            : performance.fullName;
        const status = getStatusMeta(performance);

        return {
            athleteId: performance.athleteId,
            fullName,
            initials: getInitials(fullName),
            goal: getGoalLabel(athlete),
            adherence: calculateAdherenceScore(performance),
            weightKg: athlete?.startingWeightKg ?? null,
            targetCalories: athlete?.targetCalories ?? null,
            targetSteps: athlete?.targetSteps ?? null,
            lastCheckIn: formatRelativeLogDate(performance.lastLogDate),
            statusLabel: status.label,
            statusTone: status.tone,
            hasWorkoutProgram: performance.hasWorkoutProgram,
            hasDietProgram: performance.hasDietProgram,
            isActiveToday: performance.isActiveToday,
            attentionReason: performance.attentionReason,
        } satisfies CoachOverviewRow;
    });
};

export const getDashboardSummaryStats = (rows: CoachOverviewRow[]) => {
    const totalAthletes = rows.length;
    const activeCount = rows.filter((row) => row.isActiveToday).length;
    const adherenceAverage =
        totalAthletes === 0
            ? 0
            : Math.round(rows.reduce((sum, row) => sum + row.adherence, 0) / totalAthletes);
    const weeklyCheckIns = rows.filter((row) => row.lastCheckIn !== 'No check-in').length;

    return {
        totalAthletes,
        activeCount,
        adherenceAverage,
        weeklyCheckIns,
    };
};
