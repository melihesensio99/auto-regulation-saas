import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletePortalService, type LogProgressRequest } from '../services/athletePortal.service';
import { getCurrentAthleteId } from '@/shared/auth/token';

export const useAthleteProfile = () => {
    const athleteId = getCurrentAthleteId();
    return useQuery({
        queryKey: ['athleteProfile', athleteId],
        queryFn: () => athletePortalService.getAthleteProfile(athleteId!),
        enabled: !!athleteId
    });
};

export const useAthleteProgressLogs = (startDate: string, endDate: string) => {
    const athleteId = getCurrentAthleteId();
    return useQuery({
        queryKey: ['athleteProgressLogs', athleteId, startDate, endDate],
        queryFn: () => athletePortalService.getProgressLogs(athleteId!, startDate, endDate),
        enabled: !!athleteId
    });
};

export const useLogProgress = () => {
    const queryClient = useQueryClient();
    const athleteId = getCurrentAthleteId();

    return useMutation({
        mutationFn: (data: LogProgressRequest) => athletePortalService.logProgress(athleteId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['athleteProgressLogs', athleteId] });
        }
    });
};

export const useAthleteWorkoutProgram = () => {
    const athleteId = getCurrentAthleteId();
    return useQuery({
        queryKey: ['athleteWorkoutProgram', athleteId],
        queryFn: () => athletePortalService.getWorkoutProgram(athleteId!),
        enabled: !!athleteId,
        retry: false
    });
};

export const useAthleteDietProgram = () => {
    const athleteId = getCurrentAthleteId();
    return useQuery({
        queryKey: ['athleteDietProgram', athleteId],
        queryFn: () => athletePortalService.getDietProgram(athleteId!),
        enabled: !!athleteId,
        retry: false
    });
};

export const useDailyNutrition = (date: string) => {
    return useQuery({
        queryKey: ['dailyNutrition', date],
        queryFn: async () => {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:5246/api/nutrition/daily/${date}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!res.ok) throw new Error('Failed to fetch daily nutrition');
            return res.json();
        }
    });
};
