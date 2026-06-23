import { useState } from 'react';
import { CheckInList } from './CheckInList';
import { WorkoutProgramPanel } from './WorkoutProgramPanel';

interface AthleteDetailsTabsProps {
    athleteId: string | null;
    athleteName: string | null;
}

const tabs = [
    { key: 'checkins', label: '📊  Haftalık Raporlar', enabled: true },
    { key: 'workout', label: '🏋️  Antrenman', enabled: true },
    { key: 'diet', label: '🥗  Beslenme', enabled: false },
    { key: 'targets', label: '🎯  Hedefler', enabled: false },
] as const;

type TabKey = typeof tabs[number]['key'];

export const AthleteDetailsTabs = ({ athleteId, athleteName }: AthleteDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('checkins');

    if (!athleteId) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                <div className="empty-state">
                    <span className="empty-state-icon">👈</span>
                    <p style={{ fontSize: '1rem' }}>Detayları görmek için sol taraftan bir sporcu seçin.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
            {/* Sporcu Adı + Sekmeler */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                {athleteName && (
                    <h2 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.02em' }}>
                        {athleteName}
                    </h2>
                )}
                <div className="tab-bar">
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => tab.enabled && setActiveTab(tab.key)}
                            disabled={!tab.enabled}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            title={!tab.enabled ? 'Çok Yakında' : undefined}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seçili Sekmenin İçeriği */}
            <div style={{ flex: 1, overflow: 'hidden' }} className="animate-fade-in" key={activeTab}>
                {activeTab === 'checkins' && <CheckInList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
