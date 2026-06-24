import api from '@/shared/services/api';
import type { ProgressLog, AthleteWorkoutProgram, AthleteDietProgram } from '../../dashboard/types';

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
    getAthleteProfile: async (athleteId: string) => {
        const response = await api.get(`/athletes/${athleteId}`);
        return response.data;
    },

    getProgressLogs: async (athleteId: string, startDate: string, endDate: string): Promise<ProgressLog[]> => {
        const response = await api.get<ProgressLog[]>(`/Athletes/${athleteId}/progress`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    logProgress: async (athleteId: string, data: LogProgressRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/progress`, data);
    },

    getWorkoutProgram: async (athleteId: string): Promise<AthleteWorkoutProgram> => {
        const response = await api.get<AthleteWorkoutProgram>(`/athletes/${athleteId}/workout-programs`);
        return response.data;
    },

    getDietProgram: async (athleteId: string): Promise<AthleteDietProgram> => {
        const response = await api.get<AthleteDietProgram>(`/athletes/${athleteId}/diet-programs`);
        return response.data;
    }
};
