import { useState } from 'react';
import { useAthletes } from '../hooks/useDashboard';
import { AthleteList } from './AthleteList';
import { AthleteDetailsTabs } from './AthleteDetailsTabs';

export const Dashboard = () => {
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);
    const { data: athletes, isLoading, error } = useAthletes();

    // Seçili sporcunun bilgisini bul
    const selectedAthlete = athletes?.find(a => a.id === selectedAthleteId);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            {/* NAVBAR */}
            <nav className="navbar">
                <div className="navbar-brand">
                    <span style={{ fontSize: '1.4rem' }}>⚡</span>
                    SmartCoaching
                </div>
                <div className="navbar-user">
                    <span>Koç Paneli</span>
                    <div className="navbar-avatar">K</div>
                </div>
            </nav>

            {/* ANA İÇERİK */}
            <div style={{ display: 'flex', flex: 1, padding: '20px', gap: '20px', overflow: 'hidden' }}>
                {/* SOL PANEL */}
                <AthleteList 
                    athletes={athletes} 
                    isLoading={isLoading} 
                    error={error} 
                    selectedAthleteId={selectedAthleteId} 
                    onSelectAthlete={setSelectedAthleteId} 
                />

                {/* SAĞ PANEL (Sekmeli Yapı) */}
                <AthleteDetailsTabs 
                    athleteId={selectedAthleteId} 
                    athleteName={selectedAthlete ? `${selectedAthlete.firstName} ${selectedAthlete.lastName}` : null}
                />
            </div>
        </div>
    );
};
