import api from '@/shared/services/api';

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
}

export const athleteService = {
    submitOnboarding: async (data: OnboardingData): Promise<void> => {
        await api.post('/athletes/onboarding', data);
    },
    getProfile: async (): Promise<any> => {
        const response = await api.get('/athletes/me');
        return response.data;
    }
};
