import React, { useState } from 'react';
import { CheckInList } from './CheckInList';
import { WorkoutProgramPanel } from './WorkoutProgramPanel';

interface AthleteDetailsTabsProps {
    athleteId: string | null;
}

export const AthleteDetailsTabs = ({ athleteId }: AthleteDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState<'checkins' | 'workout' | 'diet' | 'targets'>('checkins');

    if (!athleteId) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                Detayları görmek için sol taraftan bir sporcu seçin.
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {/* Sekme Butonları (Tabs Header) */}
            <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)', padding: '10px', borderRadius: '12px' }}>
                <button 
                    onClick={() => setActiveTab('checkins')}
                    style={{ 
                        background: activeTab === 'checkins' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'checkins' ? '#000' : '#fff',
                        border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'checkins' ? 'bold' : 'normal'
                    }}
                >
                    Haftalık Raporlar
                </button>
                <button 
                    onClick={() => setActiveTab('workout')}
                    style={{ 
                        background: activeTab === 'workout' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'workout' ? '#000' : '#fff',
                        border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', fontWeight: activeTab === 'workout' ? 'bold' : 'normal'
                    }}
                >
                    Antrenman Programı
                </button>
                <button 
                    disabled
                    onClick={() => setActiveTab('diet')}
                    style={{ 
                        background: activeTab === 'diet' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'diet' ? '#000' : 'rgba(255,255,255,0.3)',
                        border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'not-allowed', transition: 'all 0.2s'
                    }}
                    title="Çok Yakında"
                >
                    Beslenme (Yakında)
                </button>
                <button 
                    disabled
                    onClick={() => setActiveTab('targets')}
                    style={{ 
                        background: activeTab === 'targets' ? 'var(--primary)' : 'transparent',
                        color: activeTab === 'targets' ? '#000' : 'rgba(255,255,255,0.3)',
                        border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'not-allowed', transition: 'all 0.2s'
                    }}
                    title="Çok Yakında"
                >
                    Hedefler (Yakında)
                </button>
            </div>

            {/* Seçili Sekmenin İçeriği (Tab Content) */}
            <div style={{ flex: 1, overflow: 'hidden' }}>
                {activeTab === 'checkins' && <CheckInList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
