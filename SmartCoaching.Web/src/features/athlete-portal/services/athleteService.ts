import api from '@/shared/services/api';
import { getCurrentAthleteId } from '@/shared/auth/token';

export interface OnboardingData {
    heightCm: number;
    startingWeightKg: number;
    dateOfBirth: string;
    phoneNumber: string;
    occupation: string;
    mainReason: number;
    shortTermGoal: string;
    longTermGoal: string;
    expectations: string;
    trainingHistory: string;
    currentTrainingRoutine: string;
    outsidePhysicalActivity: string;
    hasTrackedMacros: string;
    hasWorkedWithCoach: string;
    hearAboutUs: string;
    additionalNotes: string;
}

export const athleteService = {
    submitOnboarding: async (data: OnboardingData): Promise<string> => {
        const athleteId = getCurrentAthleteId();
        if (!athleteId) {
            throw new Error('Sporcu kimligi bulunamadi. Lutfen yeniden giris yap.');
        }

        const response = await api.post<{ token?: string; value?: string } | string>(`/athletes/${athleteId}/onboarding`, data);
        return typeof response.data === 'string' ? response.data : response.data.token ?? response.data.value ?? '';
    },
    getProfile: async (): Promise<any> => {
        const response = await api.get('/athletes/me');
        return response.data;
    }
};
