import { useEffect, useState } from 'react';
import { ProgressLogList } from './ProgressLogList';
import { WorkoutProgramPanel } from './WorkoutProgramPanel';
import { TeamOverviewPanel } from './TeamOverviewPanel';
import { DietProgramPanel } from './DietProgramPanel';
import { AthleteProfilePanel } from './AthleteProfilePanel';
import { TargetsPanel } from './TargetsPanel';

interface AthleteDetailsTabsProps {
    athleteId: string | null;
}

const tabs = [
    { key: 'profile', label: 'Profil', enabled: true },
    { key: 'progresslogs', label: 'Gelişim', enabled: true },
    { key: 'workout', label: 'Antrenman', enabled: true },
    { key: 'diet', label: 'Beslenme', enabled: true },
    { key: 'targets', label: 'Hedefler', enabled: true },
] as const;

type TabKey = typeof tabs[number]['key'];

export const AthleteDetailsTabs = ({ athleteId }: AthleteDetailsTabsProps) => {
    const [activeTab, setActiveTab] = useState<TabKey>('profile');

    useEffect(() => {
        setActiveTab('profile');
    }, [athleteId]);

    if (!athleteId) {
        return <TeamOverviewPanel />;
    }

    return (
        <div className="card-stack" style={{ minHeight: 0 }}>
            <div className="tab-bar">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => tab.enabled && setActiveTab(tab.key)}
                        disabled={!tab.enabled}
                        className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="surface" style={{ padding: 20 }}>
                {activeTab === 'profile' && <AthleteProfilePanel athleteId={athleteId} />}
                {activeTab === 'progresslogs' && <ProgressLogList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
                {activeTab === 'diet' && <DietProgramPanel athleteId={athleteId} />}
                {activeTab === 'targets' && <TargetsPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
