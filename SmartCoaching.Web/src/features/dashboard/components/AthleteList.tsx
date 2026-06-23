import React, { useState } from 'react';
import type { Athlete } from '../types';
import { AddAthleteModal } from './AddAthleteModal';

interface AthleteListProps {
    athletes: Athlete[] | undefined;
    isLoading: boolean;
    error: any;
    selectedAthleteId: string | null;
    onSelectAthlete: (id: string) => void;
}

export const AthleteList = ({ athletes, isLoading, error, selectedAthleteId, onSelectAthlete }: AthleteListProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="glass-panel" style={{ width: '300px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2 style={{ margin: 0 }}>Sporcularım</h2>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        background: 'var(--primary)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        fontSize: '20px',
                        cursor: 'pointer',
                        padding: 0,
                        lineHeight: '1'
                    }}
                    title="Yeni Sporcu Ekle"
                >
                    +
                </button>
            </div>
            
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

            {/* Yeni Sporcu Ekleme Modalı */}
            <AddAthleteModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
            />
        </div>
    );
};
