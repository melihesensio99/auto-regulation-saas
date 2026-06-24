import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { athletePortalService, type LogProgressRequest } from '../services/athletePortal.service';

// Decode token to get Athlete ID (assuming the athlete is logged in)
const getAthleteIdFromToken = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payloadStr = atob(token.split('.')[1]);
        const payload = JSON.parse(payloadStr);
        return payload.sub; // Or however you store the ID in your JWT
    } catch {
        return null;
    }
};

export const useAthleteProfile = () => {
    const athleteId = getAthleteIdFromToken();
    return useQuery({
        queryKey: ['athleteProfile', athleteId],
        queryFn: () => athletePortalService.getAthleteProfile(athleteId!),
        enabled: !!athleteId
    });
};

export const useAthleteProgressLogs = (startDate: string, endDate: string) => {
    const athleteId = getAthleteIdFromToken();
    return useQuery({
        queryKey: ['athleteProgressLogs', athleteId, startDate, endDate],
        queryFn: () => athletePortalService.getProgressLogs(athleteId!, startDate, endDate),
        enabled: !!athleteId
    });
};

export const useLogProgress = () => {
    const queryClient = useQueryClient();
    const athleteId = getAthleteIdFromToken();

    return useMutation({
        mutationFn: (data: LogProgressRequest) => athletePortalService.logProgress(athleteId!, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['athleteProgressLogs', athleteId] });
        }
    });
};

export const useAthleteWorkoutProgram = () => {
    const athleteId = getAthleteIdFromToken();
    return useQuery({
        queryKey: ['athleteWorkoutProgram', athleteId],
        queryFn: () => athletePortalService.getWorkoutProgram(athleteId!),
        enabled: !!athleteId,
        retry: false
    });
};

export const useAthleteDietProgram = () => {
    const athleteId = getAthleteIdFromToken();
    return useQuery({
        queryKey: ['athleteDietProgram', athleteId],
        queryFn: () => athletePortalService.getDietProgram(athleteId!),
        enabled: !!athleteId,
        retry: false
    });
};
