import { Navigate, useSearchParams } from 'react-router-dom';

export const AthletePrograms = () => {
    const [searchParams] = useSearchParams();
    const view = searchParams.get('view') === 'diet' ? 'diet' : 'workout';

    return <Navigate to={`/athlete/dashboard?section=${view}`} replace />;
};
