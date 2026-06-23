import type { Athlete } from '../types';

interface AthleteListProps {
    athletes: Athlete[] | undefined;
    isLoading: boolean;
    error: any;
    selectedAthleteId: string | null;
    onSelectAthlete: (id: string) => void;
}

export const AthleteList = ({ athletes, isLoading, error, selectedAthleteId, onSelectAthlete }: AthleteListProps) => {
    return (
        <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
            <h2 style={{ marginBottom: '20px' }}>Sporcularım</h2>
            
            {isLoading && <p>Yükleniyor...</p>}
            {error && <p style={{ color: 'var(--danger)' }}>Sporcular alınamadı.</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {athletes?.map(athlete => (
                    <button 
                        key={athlete.id}
                        onClick={() => onSelectAthlete(athlete.id)}
                        style={{ 
                            padding: '15px', 
                            textAlign: 'left',
                            backgroundColor: selectedAthleteId === athlete.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                            color: selectedAthleteId === athlete.id ? '#000' : '#fff',
                            transition: 'all 0.2s'
                        }}
                    >
                        {athlete.firstName} {athlete.lastName}
                    </button>
                ))}
            </div>
        </div>
    );
};
