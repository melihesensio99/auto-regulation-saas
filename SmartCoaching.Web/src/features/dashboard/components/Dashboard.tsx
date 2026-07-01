import { useState, type ReactNode } from 'react';
import { AthletesTab } from './AthletesTab';
import { CoachAssistantWidget } from './CoachAssistantWidget';
import { CoachDashboardOverview } from './CoachDashboardOverview';
import { CoachSidebar } from './CoachSidebar';
import { CoachTopbar } from './CoachTopbar';

type DashboardTab = 'dashboard' | 'athletes' | 'assistant';

const tabViews: Record<DashboardTab, ReactNode> = {
    dashboard: <CoachDashboardOverview />,
    athletes: <AthletesTab />,
    assistant: <CoachAssistantWidget />,
};

export const Dashboard = () => {
    const [activeTab, setActiveTab] = useState<DashboardTab>('dashboard');

    return (
        <div className="min-h-screen bg-[#0a0f1b] text-white">
            <div className="flex">
                <CoachSidebar activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab as DashboardTab)} />

                <div className="min-h-screen flex-1 bg-[radial-gradient(circle_at_top_left,_rgba(95,59,190,0.18),_transparent_28%),linear-gradient(135deg,#111428_0%,#071824_100%)]">
                    <CoachTopbar />
                    <main className="ml-[230px] px-7 pb-10 pt-7 xl:px-8">
                        {tabViews[activeTab]}
                    </main>
                </div>
            </div>
        </div>
    );
};
