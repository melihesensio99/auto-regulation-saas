type JwtPayload = Record<string, string>;

const TOKEN_KEY = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
const ATHLETE_ROLE = 'Athlete';
const COACH_ROLE = 'Coach';
const TRUE_VALUE = 'True';
const FALSE_VALUE = 'False';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

export const setStoredToken = (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
};

export const decodeToken = (token: string): JwtPayload => {
    const payloadStr = atob(token.split('.')[1]);
    return JSON.parse(payloadStr) as JwtPayload;
};

export const getTokenPayload = (): JwtPayload | null => {
    const token = getStoredToken();
    if (!token) {
        return null;
    }

    try {
        return decodeToken(token);
    } catch {
        return null;
    }
};

export const getCurrentAthleteId = () => getTokenPayload()?.sub ?? null;

export const getCurrentUserRole = () => getTokenPayload()?.[ROLE_CLAIM] ?? null;

export const isAthleteToken = (payload: JwtPayload | null) => payload?.[ROLE_CLAIM] === ATHLETE_ROLE;

export const isCoachToken = (payload: JwtPayload | null) => payload?.[ROLE_CLAIM] === COACH_ROLE;

export const mustChangePassword = (payload: JwtPayload | null) => payload?.mustChangePassword === TRUE_VALUE;

export const isOnboardingCompleted = (payload: JwtPayload | null) => payload?.isOnboardingCompleted !== FALSE_VALUE;

export const clearStoredToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
