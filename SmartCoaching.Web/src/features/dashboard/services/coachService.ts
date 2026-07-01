import api from '@/shared/services/api';

export interface CoachDashboardSummary {
    totalAthletes: number;
    activeAthletes: number;
    averageAdherence: number;
    tasksCount: number;
    recentActivities: any[];
}

export interface AthleteDto {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    targetCalories: number;
    targetSteps: number;
    isOnboardingCompleted: boolean;
    dateOfBirth?: string;
    phoneNumber?: string;
    occupation?: string;
    mainReason?: number;
    shortTermGoal?: string;
    longTermGoal?: string;
    expectations?: string;
    heightCm?: number;
    startingWeightKg?: number;
    trainingHistory?: string;
    currentTrainingRoutine?: string;
    outsidePhysicalActivity?: string;
    hasTrackedMacros?: string;
    hasWorkedWithCoach?: string;
    hearAboutUs?: string;
    additionalNotes?: string;
    subscriptionEndDate: string;
}

export const coachService = {
    getDashboardSummary: async (): Promise<CoachDashboardSummary> => {
        const response = await api.get<CoachDashboardSummary>('/coaches/dashboard');
        return response.data;
    },
    getAthletes: async (): Promise<AthleteDto[]> => {
        const response = await api.get<AthleteDto[]>('/athletes');
        return response.data;
    },
    getAthleteById: async (id: string): Promise<AthleteDto> => {
        const response = await api.get<AthleteDto>(`/athletes/${id}`);
        return response.data;
    },
    createAthlete: async (data: { firstName: string; lastName: string; email: string; subscriptionEndDate: string }): Promise<{ id: string }> => {
        const response = await api.post<{ id: string }>('/athletes', data);
        return response.data;
    },
    updateTargets: async (id: string, data: { targetCalories: number; targetSteps: number }): Promise<void> => {
        await api.put(`/athletes/${id}/targets`, data);
    },
    searchExercises: async (query: string): Promise<ExerciseDto[]> => {
        const response = await api.get<ExerciseDto[]>(`/exercises/search?query=${query}`);
        return response.data;
    },
    assignWorkoutProgram: async (athleteId: string, exercises: WorkoutExerciseDto[]): Promise<void> => {
        await api.post(`/athletes/${athleteId}/workout-programs`, { exercises });
    },
    assignDietProgram: async (athleteId: string, meals: DietMealDto[], generalDietNotes: string = ""): Promise<void> => {
        await api.post(`/athletes/${athleteId}/diet-programs`, { meals, generalDietNotes });
    },
    getAthleteDietProgram: async (athleteId: string): Promise<AthleteDietProgramDto | null> => {
        try {
            const response = await api.get<AthleteDietProgramDto>(`/athletes/${athleteId}/diet-programs`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    getAthleteWorkoutProgram: async (athleteId: string): Promise<AthleteWorkoutProgramDto | null> => {
        try {
            const response = await api.get<AthleteWorkoutProgramDto>(`/athletes/${athleteId}/workout-programs`);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            }
            throw error;
        }
    },
    getAthleteProgressLogs: async (athleteId: string, startDate?: string, endDate?: string): Promise<any[]> => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        const response = await api.get<any[]>(`/athletes/${athleteId}/progress?${params.toString()}`);
        return response.data;
    },
    addCoachFeedback: async (athleteId: string, logId: string, feedback: string): Promise<void> => {
        await api.put(`/athletes/${athleteId}/progress/${logId}/feedback`, { feedback });
    },
    askAiAgent: async (message: string, contextAthleteId?: string, contextAthleteName?: string): Promise<{ textReply: string; uiAction?: string; actionData?: any }> => {
        const response = await api.post<{ textReply: string; uiAction?: string; actionData?: any }>('/agent/chat', { message, contextAthleteId, contextAthleteName });
        return response.data;
    }
};

export interface ExerciseDto {
    id: string;
    name: string;
    bodyPart: string;
    equipment: string;
    gifUrl: string;
}

export interface WorkoutExerciseDto {
    dayName: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restTimeInSeconds: number;
    notes?: string;
    exerciseLibraryId?: string;
}

export interface WorkoutExerciseResponseDto {
    id: string;
    dayName: string;
    exerciseName: string;
    sets: number;
    reps: string;
    restTimeInSeconds: number;
    notes?: string;
    exerciseLibraryId?: string;
    targetMuscle?: string;
    gifUrl?: string;
    imageUrl?: string;
    instructions?: string;
}

export interface AthleteWorkoutProgramDto {
    athleteId: string;
    exercises: WorkoutExerciseResponseDto[];
}

export interface AthleteDietProgramDto {
    athleteId: string;
    generalDietNotes: string;
    meals: DietMealDto[];
    totalCalories: number;
    totalProtein: number;
    totalCarbs: number;
    totalFats: number;
}

export interface DietMealDto {
    order: number;
    mealName: string;
    foods: string;
    notes: string;
}
