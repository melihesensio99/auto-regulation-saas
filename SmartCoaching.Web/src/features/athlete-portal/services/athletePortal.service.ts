import { athleteResourcesService } from '@/shared/services/athlete-resources.service';

export interface LogProgressRequest {
    date: string;
    consumedCalories: number;
    takenSteps: number;
    isWorkoutCompleted: boolean;
    weightKg: number | null;
    notes: string | null;
    frontPhotoUrl: string | null;
    backPhotoUrl: string | null;
    sidePhotoUrl: string | null;
}

export const athletePortalService = {
    getAthleteProfile: athleteResourcesService.getAthleteById,
    getProgressLogs: athleteResourcesService.getProgressLogs,
    logProgress: (athleteId: string, data: LogProgressRequest) => athleteResourcesService.logProgress(athleteId, data),
    getWorkoutProgram: athleteResourcesService.getWorkoutProgram,
    getDietProgram: athleteResourcesService.getDietProgram
};
