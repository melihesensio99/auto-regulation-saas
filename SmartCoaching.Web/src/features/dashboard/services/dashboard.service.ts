import api from '@/shared/services/api';
import type { Athlete, CheckIn, AddFeedbackRequest, CreateAthleteRequest } from '../types';

export const dashboardService = {
    getAthletes: async (): Promise<Athlete[]> => {
        const response = await api.get<Athlete[]>('/Athletes');
        return response.data;
    },

    getCheckIns: async (athleteId: string): Promise<CheckIn[]> => {
        const response = await api.get<CheckIn[]>(`/Athletes/${athleteId}/check-ins`);
        return response.data;
    },

    addFeedback: async (athleteId: string, checkInId: string, data: AddFeedbackRequest): Promise<void> => {
        await api.put(`/athletes/${athleteId}/check-ins/${checkInId}/feedback`, data);
    },

    createAthlete: async (data: CreateAthleteRequest): Promise<string> => {
        const response = await api.post<{ value: string }>('/athletes', data);
        return typeof response.data === 'string' ? response.data : response.data.value; // GUID of new athlete
    }
};
