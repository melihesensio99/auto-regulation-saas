import api from '@/shared/services/api';

export interface ExerciseLibraryDto {
    id: string;
    name: string;
    targetMuscle: string;
    imageUrl: string;
    gifUrl: string;
    instructions?: string | null;
}

export const exerciseService = {
    searchExercises: async (query: string): Promise<ExerciseLibraryDto[]> => {
        if (!query || query.trim().length < 2) return [];
        const { data } = await api.get<ExerciseLibraryDto[]>(`/exercises/search?query=${encodeURIComponent(query)}`);
        return data;
    }
};
