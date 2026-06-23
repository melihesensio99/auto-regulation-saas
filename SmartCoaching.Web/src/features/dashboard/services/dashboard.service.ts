import api from '@/shared/services/api';
import type { Athlete, CheckIn, AddFeedbackRequest } from '../types';

export const dashboardService = {
    getAthletes: async (): Promise<Athlete[]> => {
        const response = await api.get<Athlete[]>('/Athletes');
        return response.data;
    },

    getCheckIns: async (athleteId: string): Promise<CheckIn[]> => {
        const response = await api.get<CheckIn[]>(`/Athletes/${athleteId}/check-ins`);
        return response.data;
    },

    addCoachFeedback: async (athleteId: string, checkInId: string, data: AddFeedbackRequest): Promise<void> => {
        await api.put(`/Athletes/${athleteId}/check-ins/${checkInId}/feedback`, data);
    }
};
