import { useState } from 'react';
import { ProgressLogList } from './ProgressLogList';
import { WorkoutProgramPanel } from './WorkoutProgramPanel';
import { TeamOverviewPanel } from './TeamOverviewPanel';
import { DietProgramPanel } from './DietProgramPanel';

interface AthleteDetailsTabsProps {
    athleteId: string | null;
}

const tabs = [
    { key: 'progresslogs', label: '📊  Gelişim', enabled: true },
    { key: 'workout', label: '🏋️  Antrenman', enabled: true },
    { key: 'diet', label: '🥗  Beslenme', enabled: true },
    { key: 'targets', label: '🎯  Hedefler', enabled: false },
] as const;

type TabKey = typeof tabs[number]['key'];

export const AthleteDetailsTabs = ({ athleteId }: AthleteDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('progresslogs');

    if (!athleteId) {
        return <TeamOverviewPanel />;
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', overflow: 'hidden' }}>
            {/* Sekmeler */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '8px' }}>
                <div className="tab-bar" style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    padding: '6px', 
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    display: 'inline-flex',
                    gap: '4px'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => tab.enabled && setActiveTab(tab.key)}
                            disabled={!tab.enabled}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            title={!tab.enabled ? 'Çok Yakında' : undefined}
                            style={{
                                padding: '10px 20px',
                                fontSize: '0.9rem',
                                borderRadius: '8px',
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seçili Sekmenin İçeriği */}
            <div style={{ flex: 1, overflow: 'hidden' }} className="animate-fade-in" key={activeTab}>
                {activeTab === 'progresslogs' && <ProgressLogList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
                {activeTab === 'diet' && <DietProgramPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
