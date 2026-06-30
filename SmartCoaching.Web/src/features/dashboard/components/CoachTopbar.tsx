interface CoachTopbarProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
    onInviteAthlete: () => void;
}

export const CoachTopbar = ({
    searchQuery,
    onSearchChange,
    onInviteAthlete,
}: CoachTopbarProps) => {
    return (
        <header className="coach-workspace__topbar">
            <label className="coach-workspace__search">
                <span className="coach-workspace__search-icon">Q</span>
                <input
                    type="search"
                    placeholder="Search athletes, programs..."
                    value={searchQuery}
                    onChange={(event) => onSearchChange(event.target.value)}
                />
            </label>

            <div className="coach-workspace__topbar-actions">
                <button
                    type="button"
                    className="coach-workspace__invite-link"
                    onClick={onInviteAthlete}
                >
                    + Invite athlete
                </button>

                <button
                    type="button"
                    className="coach-workspace__ghost-button"
                    aria-label="Notifications"
                >
                    *
                </button>

                <div className="coach-workspace__profile-pill">
                    <div className="coach-workspace__profile-avatar">CA</div>
                    <div>
                        <strong>Coach Workspace</strong>
                        <span>Coach</span>
                    </div>
                </div>
            </div>
        </header>
    );
};
