import { AthleteDailyLogSection } from './AthleteDailyLogSection';
import { AthleteTrendSection } from './AthleteTrendSection';
import type { ProgressLog } from '@/features/dashboard/types';
import type { FormEvent } from 'react';

interface AthleteProgressSectionProps {
    logs: ProgressLog[] | undefined;
    targetCalories: number;
    targetSteps: number;
    weeklySummary: {
        averageCalories: number;
        averageSteps: number;
        workoutCount: number;
        totalDays: number;
    };
    todayIso: string;
    calories: string;
    steps: string;
    weight: string;
    notes: string;
    workoutCompleted: boolean;
    frontPhotoUrl: string;
    backPhotoUrl: string;
    sidePhotoUrl: string;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
    isLogging: boolean;
    onSubmit: (event: FormEvent) => void;
    onCaloriesChange: (value: string) => void;
    onStepsChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onWorkoutCompletedChange: (value: boolean) => void;
    onFrontPhotoUrlChange: (value: string) => void;
    onBackPhotoUrlChange: (value: string) => void;
    onSidePhotoUrlChange: (value: string) => void;
}

export const AthleteProgressSection = ({
    logs,
    targetCalories,
    targetSteps,
    weeklySummary,
    todayIso,
    ...dailyLogProps
}: AthleteProgressSectionProps) => {
    return (
        <div className="card-stack space-y-6">
            <AthleteDailyLogSection
                {...dailyLogProps}
            />

            <AthleteTrendSection
                logs={logs}
                targetCalories={targetCalories}
                targetSteps={targetSteps}
                weeklySummary={weeklySummary}
                todayIso={todayIso}
            />
        </div>
    );
};
