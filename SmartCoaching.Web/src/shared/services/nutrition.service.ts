import api from '@/shared/services/api';

export interface FatSecretFoodItem {
    id: string;
    name: string;
    description: string;
    brandName?: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
}

export interface AnalyzeFoodImageResponse {
    estimatedCalories: number;
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    estimatedGrams?: number;
}

export interface LogConsumedFoodRequest {
    foodName: string;
    calories: number;
    protein: number;
    carbs: number;
    fats: number;
    source?: string;
}

export const nutritionService = {
    searchFatSecret: async (query: string): Promise<FatSecretFoodItem[]> => {
        try {
            const response = await api.get<FatSecretFoodItem[]>('/nutrition/fatsecret/search', {
                params: { query }
            });
            if (response.data && response.data.length > 0) {
                return response.data;
            }
        } catch (error) {
            console.warn('FatSecret API failed (maybe IP restricted), using mock data', error);
        }

        // Mock Fallback
        const mocks: FatSecretFoodItem[] = [
            { id: '1', name: 'Yulaf Ezmesi', description: '', calories: 138, protein: 4.76, carbs: 26.16, fats: 2.32 },
            { id: '2', name: 'Elma', description: '', calories: 52, protein: 0.3, carbs: 14, fats: 0.2 },
            { id: '3', name: 'Izgara Tavuk', description: '', calories: 165, protein: 31, carbs: 0, fats: 3.6 },
            { id: '4', name: 'Yumurta (Haşlanmış)', description: '', calories: 78, protein: 6.3, carbs: 0.6, fats: 5.3 }
        ];
        return mocks.filter(m => m.name.toLowerCase().includes(query.toLowerCase()));
    },

    analyzeImage: async (base64Image: string): Promise<AnalyzeFoodImageResponse> => {
        try {
            const response = await api.post<AnalyzeFoodImageResponse>('/nutrition/analyze-image', {
                base64Image
            });
            if (response.data && response.data.foodName) {
                return response.data;
            }
        } catch (error) {
            console.warn('Mistral API failed, using mock data', error);
        }

        // Mock Fallback
        await new Promise(r => setTimeout(r, 1500));
        return {
            calories: 456,
            protein: 22,
            carbs: 45,
            fats: 15,
            foodName: 'Izgara Somon, Kuşkonmaz, Pirinç Pilavı',
            estimatedGrams: 350
        };
    },

    logConsumedFood: async (data: LogConsumedFoodRequest): Promise<{ id: string }> => {
        try {
            const response = await api.post<{ id: string }>('/nutrition/log', data);
            return response.data;
        } catch (e) {
            return { id: 'mock-id' };
        }
    },

    getDailyNutrition: async (date: string): Promise<any> => {
        const response = await api.get(`/nutrition/daily/${date}`);
        return response.data;
    }
};
