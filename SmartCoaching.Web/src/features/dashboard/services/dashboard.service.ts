import api from '@/shared/services/api';
import { athleteResourcesService } from '@/shared/services/athlete-resources.service';
import type {
    AddFeedbackRequest,
    AgentChatRequest,
    AgentChatResponse,
    AssignDietProgramRequest,
    AssignWorkoutProgramRequest,
    Athlete,
    AthleteDietProgram,
    AthleteWorkoutProgram,
    CoachDashboardDto,
    CreateAthleteRequest,
    ProgressLog,
    SubmitOnboardingFormRequest,
    UpdateAthleteTargetsRequest
} from '../types';

export const dashboardService = {
    getDashboard: async (): Promise<CoachDashboardDto> => {
        const response = await api.get<CoachDashboardDto>('/coaches/dashboard');
        return response.data;
    },

    getAthletes: async (): Promise<Athlete[]> => {
        const response = await api.get<Athlete[]>('/athletes');
        return response.data;
    },

    getAthleteById: athleteResourcesService.getAthleteById,

    getProgressLogs: athleteResourcesService.getProgressLogs as (
        athleteId: string,
        startDate: string,
        endDate: string
    ) => Promise<ProgressLog[]>,

    addFeedback: async (athleteId: string, progressLogId: string, data: AddFeedbackRequest): Promise<void> => {
        await api.put(`/athletes/${athleteId}/progress/${progressLogId}/feedback`, data);
    },

    createAthlete: async (data: CreateAthleteRequest): Promise<string> => {
        const response = await api.post<{ value: string }>('/athletes', data);
        return typeof response.data === 'string' ? response.data : response.data.value;
    },

    getWorkoutProgram: athleteResourcesService.getWorkoutProgram as (athleteId: string) => Promise<AthleteWorkoutProgram>,

    assignWorkoutProgram: async (athleteId: string, data: AssignWorkoutProgramRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/workout-programs`, data);
    },

    getDietProgram: athleteResourcesService.getDietProgram as (athleteId: string) => Promise<AthleteDietProgram>,

    assignDietProgram: async (athleteId: string, data: AssignDietProgramRequest): Promise<void> => {
        await api.post(`/athletes/${athleteId}/diet-programs`, data);
    },

    updateAthleteTargets: async (athleteId: string, data: UpdateAthleteTargetsRequest): Promise<void> => {
        await api.put(`/athletes/${athleteId}/targets`, data);
    },

    sendCoachAssistantMessage: async (data: AgentChatRequest): Promise<AgentChatResponse> => {
        const response = await api.post<AgentChatResponse>('/agent/chat', data);
        return response.data;
    },

    submitOnboardingForm: async (athleteId: string, data: SubmitOnboardingFormRequest): Promise<string> => {
        const response = await api.post<{ token?: string; value?: string } | string>(`/athletes/${athleteId}/onboarding`, data);
        return typeof response.data === 'string' ? response.data : response.data.token ?? response.data.value ?? '';
    }
};
