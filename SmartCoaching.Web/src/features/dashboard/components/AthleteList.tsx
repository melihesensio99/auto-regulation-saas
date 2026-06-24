import { useState } from 'react';
import type { Athlete } from '../types';
import { AddAthleteModal } from './AddAthleteModal';

interface AthleteListProps {
    athletes: Athlete[] | undefined;
    isLoading: boolean;
    error: any;
    selectedAthleteId: string | null;
    onSelectAthlete: (id: string | null) => void;
}

export const AthleteList = ({ athletes, isLoading, error, selectedAthleteId, onSelectAthlete }: AthleteListProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <div className="glass-panel" style={{ width: '210px', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0, fontSize: '0.95rem', letterSpacing: '-0.01em' }}>Sporcularım</h3>
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="btn-add"
                    title="Yeni Sporcu Ekle"
                >
                    +
                </button>
            </div>
            
            {isLoading && (
                <div className="empty-state">
                    <span>Yükleniyor...</span>
                </div>
            )}

            {error && <p style={{ color: 'var(--danger)', fontSize: '0.85rem' }}>Sporcular alınamadı.</p>}
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                
                {/* Takım Özeti Butonu */}
                <button 
                    onClick={() => onSelectAthlete(null)}
                    className={`athlete-item animate-slide-in ${selectedAthleteId === null ? 'selected' : ''}`}
                    style={{ animationDelay: `0s`, marginBottom: '10px', background: selectedAthleteId === null ? 'rgba(99, 102, 241, 0.2)' : 'rgba(255,255,255,0.02)', borderLeft: selectedAthleteId === null ? '3px solid var(--primary-color)' : 'none' }}
                >
                    <div className="athlete-avatar" style={{ background: 'var(--primary-color)' }}>
                        📊
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', alignItems: 'flex-start' }}>
                        <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            Takım Özeti
                        </span>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                            Genel Bakış
                        </span>
                    </div>
                </button>

                {athletes?.map((athlete, index) => (
                    <button 
                        key={athlete.id}
                        onClick={() => onSelectAthlete(athlete.id)}
                        className={`athlete-item animate-slide-in ${selectedAthleteId === athlete.id ? 'selected' : ''}`}
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div className="athlete-avatar">
                            {athlete.firstName[0]}{athlete.lastName[0]}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                                {athlete.firstName} {athlete.lastName}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                Sporcu
                            </span>
                        </div>
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
