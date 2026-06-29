type JwtPayload = Record<string, string>;

const TOKEN_KEY = 'token';
const ROLE_CLAIM = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';

export const getStoredToken = () => localStorage.getItem(TOKEN_KEY);

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

export const clearStoredToken = () => {
    localStorage.removeItem(TOKEN_KEY);
};
