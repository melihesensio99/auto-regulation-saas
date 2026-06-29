interface CoachDashboardHeaderProps {
    metrics: Array<{
        label: string;
        value: number;
        hint: string;
    }>;
}

export const CoachDashboardHeader = ({ metrics }: CoachDashboardHeaderProps) => {
    return (
        <header className="coach-header surface">
            <div className="coach-header__brand">
                <div className="brand-mark">SC</div>
                <div>
                    <span className="eyebrow">Coach console</span>
                    <h1 style={{ marginTop: 8, fontSize: '1.7rem' }}>SmartCoaching</h1>
                </div>
            </div>

            <div className="stats-grid" style={{ flex: 1, maxWidth: 720 }}>
                {metrics.map(metric => (
                    <div key={metric.label} className="metric-card">
                        <span className="metric-card__label">{metric.label}</span>
                        <span className="metric-card__value">{metric.value}</span>
                        <div className="metric-card__hint">{metric.hint}</div>
                    </div>
                ))}
            </div>

            <div className="coach-header__actions">
                <span className="chip chip--success">Live</span>
                <div className="navbar-avatar">K</div>
            </div>
        </header>
    );
};
