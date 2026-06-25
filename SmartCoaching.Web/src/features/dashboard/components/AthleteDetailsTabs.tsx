import { useState } from 'react';
import { ProgressLogList } from './ProgressLogList';
import { WorkoutProgramPanel } from './WorkoutProgramPanel';
import { TeamOverviewPanel } from './TeamOverviewPanel';
import { DietProgramPanel } from './DietProgramPanel';
import { AthleteProfilePanel } from './AthleteProfilePanel';

interface AthleteDetailsTabsProps {
    athleteId: string | null;
}

const tabs = [
    { key: 'profile', label: '👤  Profil', enabled: true },
    { key: 'progresslogs', label: '📊  Gelişim', enabled: true },
    { key: 'workout', label: '🏋️  Antrenman', enabled: true },
    { key: 'diet', label: '🥗  Beslenme', enabled: true },
    { key: 'targets', label: '🎯  Hedefler', enabled: false },
] as const;

type TabKey = typeof tabs[number]['key'];

export const AthleteDetailsTabs = ({ athleteId }: AthleteDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    if (!athleteId) {
        return <TeamOverviewPanel />;
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {/* Sekmeler */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', marginBottom: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ 
                    display: 'flex',
                    gap: '24px'
                }}>
                    {tabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => tab.enabled && setActiveTab(tab.key)}
                            disabled={!tab.enabled}
                            className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                            title={!tab.enabled ? 'Çok Yakında' : undefined}
                            style={{
                                padding: '12px 4px',
                                fontSize: '0.95rem',
                                color: activeTab === tab.key ? '#fff' : 'var(--text-secondary)',
                                background: 'transparent',
                                border: 'none',
                                borderBottom: activeTab === tab.key ? '2px solid var(--primary-color)' : '2px solid transparent',
                                borderRadius: 0,
                                fontWeight: activeTab === tab.key ? 600 : 500,
                                transition: 'all 0.2s',
                                cursor: tab.enabled ? 'pointer' : 'not-allowed',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Seçili Sekmenin İçeriği */}
            <div style={{ flex: 1, overflow: 'auto' }} className="animate-fade-in" key={activeTab}>
                {activeTab === 'profile' && <AthleteProfilePanel athleteId={athleteId} />}
                {activeTab === 'progresslogs' && <ProgressLogList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
                {activeTab === 'diet' && <DietProgramPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
