import type { ProgressLog } from '@/features/dashboard/types';

export const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export const isSameLocalDay = (left: string, right: string) => {
    const leftDate = new Date(left);
    const rightDate = new Date(right);

    return (
        leftDate.getFullYear() === rightDate.getFullYear() &&
        leftDate.getMonth() === rightDate.getMonth() &&
        leftDate.getDate() === rightDate.getDate()
    );
};

export const createLastWeekDateRange = () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    return {
        startDate: startDate.toISOString(),
        endDate: new Date().toISOString(),
    };
};

export const getWeeklySummary = (logs: ProgressLog[] | undefined) => {
    const normalizedLogs = logs ?? [];

    if (normalizedLogs.length === 0) {
        return {
            averageCalories: 0,
            averageSteps: 0,
            workoutCount: 0,
            totalDays: 0
        };
    }

    const totals = normalizedLogs.reduce(
        (acc, log) => {
            acc.calories += log.consumedCalories ?? 0;
            acc.steps += log.takenSteps ?? 0;
            acc.workouts += log.isWorkoutCompleted ? 1 : 0;
            return acc;
        },
        { calories: 0, steps: 0, workouts: 0 }
    );

    return {
        averageCalories: Math.round(totals.calories / normalizedLogs.length),
        averageSteps: Math.round(totals.steps / normalizedLogs.length),
        workoutCount: totals.workouts,
        totalDays: normalizedLogs.length
    };
};

export const getDailyProgressSummary = ({
    logs,
    targetCalories,
    targetSteps,
}: {
    logs: ProgressLog[] | undefined;
    targetCalories: number;
    targetSteps: number;
}) => {
    const todayIso = new Date().toISOString();
    const todayLog = logs?.find(log => isSameLocalDay(log.date, todayIso));
    const latestLog = logs?.[0];
    const activeLog = todayLog ?? latestLog;

    const consumedCalories = activeLog?.consumedCalories ?? 0;
    const takenSteps = activeLog?.takenSteps ?? 0;
    const calorieProgress = targetCalories > 0 ? clampPercent((consumedCalories / targetCalories) * 100) : 0;
    const stepProgress = targetSteps > 0 ? clampPercent((takenSteps / targetSteps) * 100) : 0;
    const workoutProgress = activeLog?.isWorkoutCompleted ? 100 : 0;

    return {
        todayIso,
        todayLog,
        latestLog,
        activeLog,
        consumedCalories,
        takenSteps,
        calorieProgress,
        stepProgress,
        workoutProgress,
        dailyCompletion: Math.round((calorieProgress + stepProgress + workoutProgress) / 3),
    };
};
