import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type {
    AssignDietProgramRequest,
    AssignWorkoutProgramRequest,
    UpdateAthleteTargetsRequest,
} from '../types';

export const useCoachDashboard = () =>
    useQuery({
        queryKey: ['coachDashboard'],
        queryFn: dashboardService.getDashboard,
    });

export const useAthletes = () =>
    useQuery({
        queryKey: ['athletes'],
        queryFn: dashboardService.getAthletes,
    });

export const useAthlete = (athleteId: string | null) =>
    useQuery({
        queryKey: ['athlete', athleteId],
        queryFn: () => dashboardService.getAthleteById(athleteId!),
        enabled: !!athleteId,
    });

export const useProgressLogs = (athleteId: string | null, startDate: string, endDate: string) =>
    useQuery({
        queryKey: ['progressLogs', athleteId, startDate, endDate],
        queryFn: () => dashboardService.getProgressLogs(athleteId!, startDate, endDate),
        enabled: !!athleteId,
    });

export const useAddFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            athleteId,
            progressLogId,
            feedback,
        }: {
            athleteId: string;
            progressLogId: string;
            feedback: string;
        }) => dashboardService.addFeedback(athleteId, progressLogId, { feedback }),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['progressLogs', variables.athleteId] });
        },
    });
};

export const useCreateAthlete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: dashboardService.createAthlete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['athletes'] });
        },
    });
};

export const useWorkoutProgram = (athleteId: string | null) =>
    useQuery({
        queryKey: ['workoutProgram', athleteId],
        queryFn: () => dashboardService.getWorkoutProgram(athleteId!),
        enabled: !!athleteId,
        retry: false,
    });

export const useAssignWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, data }: { athleteId: string; data: AssignWorkoutProgramRequest }) =>
            dashboardService.assignWorkoutProgram(athleteId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workoutProgram', variables.athleteId] });
        },
    });
};

export const useDietProgram = (athleteId: string | null) =>
    useQuery({
        queryKey: ['dietProgram', athleteId],
        queryFn: () => dashboardService.getDietProgram(athleteId!),
        enabled: !!athleteId,
        retry: false,
    });

export const useAssignDietProgram = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, data }: { athleteId: string; data: AssignDietProgramRequest }) =>
            dashboardService.assignDietProgram(athleteId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dietProgram', variables.athleteId] });
        },
    });
};

export const useUpdateAthleteTargets = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, data }: { athleteId: string; data: UpdateAthleteTargetsRequest }) =>
            dashboardService.updateAthleteTargets(athleteId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['athletes'] });
            queryClient.invalidateQueries({ queryKey: ['coachDashboard'] });
            queryClient.invalidateQueries({ queryKey: ['athlete'] });
        },
    });
};
