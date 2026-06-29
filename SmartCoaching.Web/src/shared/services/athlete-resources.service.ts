import api from '@/shared/services/api';
import type { Athlete, AthleteDietProgram, AthleteWorkoutProgram, ProgressLog } from '@/features/dashboard/types';

export const athleteResourcesService = {
    getAthleteById: async (athleteId: string): Promise<Athlete> => {
        const response = await api.get<Athlete>(`/athletes/${athleteId}`);
        return response.data;
    },

    getProgressLogs: async (athleteId: string, startDate: string, endDate: string): Promise<ProgressLog[]> => {
        const response = await api.get<ProgressLog[]>(`/athletes/${athleteId}/progress`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    logProgress: async (
        athleteId: string,
        data: {
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
    ): Promise<void> => {
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
