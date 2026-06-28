import api from '@/shared/services/api';
import type { Athlete, ProgressLog, AddFeedbackRequest, CreateAthleteRequest, AthleteWorkoutProgram, AssignWorkoutProgramRequest, CoachDashboardDto, AthleteDietProgram, AssignDietProgramRequest, SubmitOnboardingFormRequest, UpdateAthleteTargetsRequest } from '../types';

export const dashboardService = {
    getDashboard: async (): Promise<CoachDashboardDto> => {
        const response = await api.get<CoachDashboardDto>('/coaches/dashboard');
        return response.data;
    },

    getAthletes: async (): Promise<Athlete[]> => {
        const response = await api.get<Athlete[]>('/Athletes');
        return response.data;
    },

    getAthleteById: async (athleteId: string): Promise<Athlete> => {
        const response = await api.get<Athlete>(`/Athletes/${athleteId}`);
        return response.data;
    },

    getProgressLogs: async (athleteId: string, startDate: string, endDate: string): Promise<ProgressLog[]> => {
        const response = await api.get<ProgressLog[]>(`/Athletes/${athleteId}/progress`, {
            params: { startDate, endDate }
        });
        return response.data;
    },

    addFeedback: async (athleteId: string, progressLogId: string, data: AddFeedbackRequest): Promise<void> => {
        await api.put(`/athletes/${athleteId}/progress/${progressLogId}/feedback`, data);
    },

    createAthlete: async (data: CreateAthleteRequest): Promise<string> => {
        const response = await api.post<{ value: string }>('/athletes', data);
        return typeof response.data === 'string' ? response.data : response.data.value;
    },

    getWorkoutProgram: async (athleteId: string): Promise<AthleteWorkoutProgram> => {
        const response = await api.get<AthleteWorkoutProgram>(`/athletes/${athleteId}/workout-programs`);
        return response.data;
    },

    assignWorkoutProgram: async (athleteId: string, data: AssignWorkoutProgramRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/workout-programs`, data);
    },

    getDietProgram: async (athleteId: string): Promise<AthleteDietProgram> => {
        const response = await api.get<AthleteDietProgram>(`/athletes/${athleteId}/diet-programs`);
        return response.data;
    },

    assignDietProgram: async (athleteId: string, data: AssignDietProgramRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/diet-programs`, data);
    },

    updateAthleteTargets: async (athleteId: string, data: UpdateAthleteTargetsRequest): Promise<void> => {
        await api.put(`/athletes/${athleteId}/targets`, data);
    },

    submitOnboardingForm: async (athleteId: string, data: SubmitOnboardingFormRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/onboarding`, data);
    }
};
