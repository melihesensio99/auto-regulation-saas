import { useEffect, useState } from 'react';
import { AthleteProfilePanel } from '@/features/dashboard/components/AthleteProfilePanel';
import { DietProgramPanel } from '@/features/dashboard/components/DietProgramPanel';
import { ProgressLogList } from '@/features/dashboard/components/ProgressLogList';
import { TargetsPanel } from '@/features/dashboard/components/TargetsPanel';
import { WorkoutProgramPanel } from '@/features/dashboard/components/WorkoutProgramPanel';

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
        return (
            <div className="empty-state" style={{ minHeight: 280 }}>
                <p>Detayları görmek için bir sporcu seç.</p>
            </div>
        );
    }

    return (
        <div className="coach-athlete-detail card-stack" style={{ minHeight: 0 }}>
            <div className="coach-athlete-detail__tabs">
                {tabs.map(tab => (
                    <button
                        key={tab.key}
                        type="button"
                        onClick={() => tab.enabled && setActiveTab(tab.key)}
                        disabled={!tab.enabled}
                        className={`tab-btn coach-athlete-detail__tab ${activeTab === tab.key ? 'active' : ''}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="coach-athlete-detail__panel surface" style={{ padding: 20 }}>
                {activeTab === 'profile' && <AthleteProfilePanel athleteId={athleteId} />}
                {activeTab === 'progresslogs' && <ProgressLogList athleteId={athleteId} />}
                {activeTab === 'workout' && <WorkoutProgramPanel athleteId={athleteId} />}
                {activeTab === 'diet' && <DietProgramPanel athleteId={athleteId} />}
                {activeTab === 'targets' && <TargetsPanel athleteId={athleteId} />}
            </div>
        </div>
    );
};
