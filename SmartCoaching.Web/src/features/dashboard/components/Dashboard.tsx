import { useState } from 'react';
import { useAthletes } from '../hooks/useDashboard';
import { AthleteList } from './AthleteList';
import { AthleteDetailsTabs } from './AthleteDetailsTabs';

export const Dashboard = () => {
    // Tüm Dashboard'u ilgilendiren tek lokal state: "Hangi sporcu seçili?"
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

    // Beyin (Hook): Sadece sporcuları getir
    const { data: athletes, isLoading, error } = useAthletes();

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px', gap: '20px' }}>
            
            {/* SOL PANEL (Lego Parçası 1) */}
            <AthleteList 
                athletes={athletes} 
                isLoading={isLoading} 
                error={error} 
                selectedAthleteId={selectedAthleteId} 
                onSelectAthlete={setSelectedAthleteId} 
            />

            {/* SAĞ PANEL (Lego Parçası 2 - Sekmeli Yapı) */}
            <AthleteDetailsTabs athleteId={selectedAthleteId} />
            
        </div>
    );
};
