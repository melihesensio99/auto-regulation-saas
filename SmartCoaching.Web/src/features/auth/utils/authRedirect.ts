import {
    decodeToken,
    getTokenPayload,
    isAthleteToken,
    isCoachToken,
    isOnboardingCompleted,
    mustChangePassword,
} from '@/shared/auth/token';

export const getAthleteRedirectPath = (token: string) => {
    const payload = decodeToken(token);

    if (mustChangePassword(payload)) {
        return '/change-password';
    }

    if (!isOnboardingCompleted(payload)) {
        return '/onboarding';
    }

    return '/athlete/dashboard';
};

export const getAuthorizedPath = (pathname: string) => {
    const payload = getTokenPayload();

    if (!payload) {
        return '/login';
    }

    if (isAthleteToken(payload)) {
        if (mustChangePassword(payload) && pathname !== '/change-password') {
            return '/change-password';
        }

        if (!mustChangePassword(payload) && !isOnboardingCompleted(payload) && pathname !== '/onboarding') {
            return '/onboarding';
        }

        if (isOnboardingCompleted(payload) && pathname === '/onboarding') {
            return '/athlete/dashboard';
        }

        if (pathname === '/dashboard') {
            return '/athlete/dashboard';
        }
    }

    if (isCoachToken(payload) && pathname.startsWith('/athlete')) {
        return '/dashboard';
    }

    return null;
};
