import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredToken } from '@/shared/auth/token';
import { getAuthorizedPath } from '@/features/auth/utils/authRedirect';

interface AuthGuardProps {
    children: ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
    const location = useLocation();
    const token = getStoredToken();

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const redirectPath = getAuthorizedPath(location.pathname);

    if (redirectPath) {
        return <Navigate to={redirectPath} replace />;
    }

    return <>{children}</>;
};
