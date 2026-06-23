import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dashboardService } from '../services/dashboard.service';

// 1. Sporcuları Getiren Hook (Read)
export const useAthletes = () => {
    return useQuery({
        queryKey: ['athletes'],
        queryFn: dashboardService.getAthletes,
    });
};

// 2. Seçili Sporcunun Raporlarını Getiren Hook (Read)
export const useCheckIns = (athleteId: string | null) => {
    return useQuery({
        queryKey: ['checkIns', athleteId],
        queryFn: () => dashboardService.getCheckIns(athleteId!),
        enabled: !!athleteId, // Sadece athleteId varsa bu isteği at (Hata önleyici)
    });
};

// 3. Koçun Feedback Göndermesini Sağlayan Hook (Write/Update)
export const useAddFeedback = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ athleteId, checkInId, feedback }: { athleteId: string, checkInId: string, feedback: string }) => 
            dashboardService.addFeedback(athleteId, checkInId, { feedback }),
        onSuccess: (_, variables) => {
            // Feedback başarıyla gidince, ekrandaki eski veriyi sil ve güncelini backend'den otomatik çek (Re-fetch)
            queryClient.invalidateQueries({ queryKey: ['checkIns', variables.athleteId] });
        }
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
