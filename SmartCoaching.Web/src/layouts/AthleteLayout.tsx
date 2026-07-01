import { Outlet } from 'react-router-dom';

export const AthleteLayout = () => {
    return (
        <div className="min-h-screen bg-[linear-gradient(135deg,#0b101a_0%,#071824_100%)] text-white">
            <Outlet />
        </div>
    );
};
