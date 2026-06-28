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
        <>
            <div className="card-stack">
                <button
                    type="button"
                    className={`athlete-item ${selectedAthleteId === null ? 'selected' : ''}`}
                    onClick={() => onSelectAthlete(null)}
                >
                    <div className="athlete-avatar">TS</div>
                    <div className="athlete-item__meta">
                        <span style={{ fontWeight: 700, color: 'inherit' }}>Takım özeti</span>
                        <span className="caption">Genel görünüm</span>
                    </div>
                </button>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                    <div>
                        <span className="section-label">Sporcular</span>
                        <h3 style={{ marginTop: 6 }}>Liste</h3>
                    </div>
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="btn-add"
                        title="Yeni sporcu ekle"
                    >
                        +
                    </button>
                </div>

                {isLoading && (
                    <div className="empty-state">
                        <div className="loader" />
                        <p>Yükleniyor...</p>
                    </div>
                )}

                {error && <p style={{ color: 'var(--danger-color)', fontSize: '0.9rem' }}>Sporcular alınamadı.</p>}

                <div className="card-stack" style={{ gap: 10 }}>
                    {athletes?.map((athlete, index) => (
                        <button
                            key={athlete.id}
                            type="button"
                            onClick={() => onSelectAthlete(athlete.id)}
                            className={`athlete-item animate-slide-in ${selectedAthleteId === athlete.id ? 'selected' : ''}`}
                            style={{ animationDelay: `${index * 0.04}s` }}
                        >
                            <div className="athlete-avatar">
                                {athlete.firstName[0]}{athlete.lastName[0]}
                            </div>
                            <div className="athlete-item__meta">
                                <span style={{ fontWeight: 700, color: 'inherit' }}>
                                    {athlete.firstName} {athlete.lastName}
                                </span>
                                <span className="caption">Sporcu</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <AddAthleteModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
        </>
    );
};
