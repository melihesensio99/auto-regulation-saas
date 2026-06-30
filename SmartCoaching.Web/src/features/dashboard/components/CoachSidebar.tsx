interface CoachSidebarProps {
    onSelectAthlete: (id: string | null) => void;
}

const navItems = ['Dashboard', 'Athletes', 'AI Assistant'];

export const CoachSidebar = ({ onSelectAthlete }: CoachSidebarProps) => {
    return (
        <aside className="coach-workspace__sidebar">
            <div className="coach-workspace__brand">
                <div className="coach-workspace__brand-mark">SC</div>
                <div>
                    <strong>SmartCoaching</strong>
                    <span>PRO SUITE</span>
                </div>
            </div>

            <nav className="coach-workspace__nav" aria-label="Coach menu">
                {navItems.map((item, index) => (
                    <button
                        key={item}
                        type="button"
                        className={`coach-workspace__nav-item ${index === 0 ? 'is-active' : ''}`}
                        onClick={() => {
                            if (index === 0) {
                                onSelectAthlete(null);
                            }
                        }}
                    >
                        <span className="coach-workspace__nav-dot" />
                        {item}
                    </button>
                ))}
            </nav>

            <div className="coach-workspace__plan-card">
                <span className="section-label">Active plan</span>
                <strong>Coach Elite</strong>
                <p>Unlimited athletes, AI insights and program automation.</p>
            </div>
        </aside>
    );
};
