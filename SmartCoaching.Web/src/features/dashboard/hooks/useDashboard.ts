import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';
import type { AssignWorkoutProgramRequest } from '../types';

// 0. Coach Dashboard Özetini Getiren Hook
export const useCoachDashboard = () => {
    return useQuery({
        queryKey: ['coachDashboard'],
        queryFn: dashboardService.getDashboard,
    });
};

// 1. Sporcuları Getiren Hook (Read)
export const useAthletes = () => {
    return useQuery({
        queryKey: ['athletes'],
        queryFn: dashboardService.getAthletes,
    });
};

// 2. Seçili Sporcunun Raporlarını Getiren Hook (Read)
export const useProgressLogs = (athleteId: string | null, startDate: string, endDate: string) => {
    return useQuery({
        queryKey: ['progressLogs', athleteId, startDate, endDate],
        queryFn: () => dashboardService.getProgressLogs(athleteId!, startDate, endDate),
        enabled: !!athleteId, // Sadece athleteId varsa bu isteği at (Hata önleyici)
    });
};

// 3. Koçun Feedback Göndermesini Sağlayan Hook (Write/Update)
export const useAddFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, progressLogId, feedback }: { athleteId: string, progressLogId: string, feedback: string }) => 
            dashboardService.addFeedback(athleteId, progressLogId, { feedback }),
        onSuccess: (_, variables) => {
            // Feedback başarıyla gidince, ekrandaki eski veriyi sil ve güncelini backend'den otomatik çek (Re-fetch)
            queryClient.invalidateQueries({ queryKey: ['progressLogs', variables.athleteId] });
        }
    });
};

// 4. Yeni Sporcu Ekleme Hook'u
export const useCreateAthlete = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: dashboardService.createAthlete,
        onSuccess: () => {
            // Başarılı olduğunda sporcular listesini yeniden çek
            queryClient.invalidateQueries({ queryKey: ['athletes'] });
        }
    });
};

// 5. Antrenman Programı Getiren Hook
export const useWorkoutProgram = (athleteId: string | null) => {
    return useQuery({
        queryKey: ['workoutProgram', athleteId],
        queryFn: () => dashboardService.getWorkoutProgram(athleteId!),
        enabled: !!athleteId,
        retry: false, // 404 (Program yok) dönebilir, tekrar denemesine gerek yok
    });
};

// 6. Antrenman Programı Atayan Hook
export const useAssignWorkout = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, data }: { athleteId: string, data: AssignWorkoutProgramRequest }) => 
            dashboardService.assignWorkoutProgram(athleteId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['workoutProgram', variables.athleteId] });
        }
    });
};

// 7. Diyet Programı Getiren Hook
export const useDietProgram = (athleteId: string | null) => {
    return useQuery({
        queryKey: ['dietProgram', athleteId],
        queryFn: () => dashboardService.getDietProgram(athleteId!),
        enabled: !!athleteId,
        retry: false, // 404 dönebilir
    });
};

// 8. Diyet Programı Atayan Hook
export const useAssignDietProgram = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, data }: { athleteId: string, data: any }) => 
            dashboardService.assignDietProgram(athleteId, data),
        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({ queryKey: ['dietProgram', variables.athleteId] });
        }
    });
};
