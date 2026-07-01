import { useState, type ReactNode } from 'react';
import { AthleteProfile } from './AthleteProfile';
import { CoachAssistantWidget } from './CoachAssistantWidget';
import { CoachDashboardOverview } from './CoachDashboardOverview';
import { CoachSidebar } from './CoachSidebar';

type DashboardTab = 'dashboard' | 'assistant';

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');
    const [selectedAthleteId, setSelectedAthleteId] = useState<string | null>(null);

    const renderMainContent = () => {
        if (selectedAthleteId) {
            return <AthleteProfile athleteId={selectedAthleteId} onBack={() => setSelectedAthleteId(null)} />;
        }

        if (activeTab === 'dashboard') {
            return <CoachDashboardOverview onSelectAthlete={setSelectedAthleteId} />;
        }

        if (activeTab === 'assistant') {
            return <CoachAssistantWidget onSelectAthlete={setSelectedAthleteId} />;
        }

        return null;
    };

    return (
        <div className="min-h-screen bg-[#0a0f1b] text-white">
            <div className="flex">
                <CoachSidebar
                    activeTab={selectedAthleteId ? 'dashboard' : activeTab}
                    onSelectTab={(tab) => {
                        setSelectedAthleteId(null);
                        setActiveTab(tab as DashboardTab);
                    }}
                />

                <div className="min-h-screen flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(95,59,190,0.18),_transparent_28%),linear-gradient(135deg,#111428_0%,#071824_100%)]">
                    <main className="ml-[230px] px-6 pb-8 pt-8 xl:px-7">
                        {renderMainContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};
