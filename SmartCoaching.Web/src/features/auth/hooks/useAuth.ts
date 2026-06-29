import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types';
import { decodeToken, getCurrentUserRole } from '@/shared/auth/token';

const getAthleteRedirectPath = (token: string) => {
    const payload = decodeToken(token);
    const mustChangePassword = payload.mustChangePassword;
    const isOnboardingCompleted = payload.isOnboardingCompleted;

    if (mustChangePassword === 'True') {
        return '/change-password';
    }

    if (isOnboardingCompleted === 'False') {
        return '/onboarding';
    }

    return '/athlete/dashboard';
};

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);
            localStorage.setItem('token', response.token);

            try {
                const role = getCurrentUserRole();

                if (role === 'Athlete') {
                    navigate(getAthleteRedirectPath(response.token));
                } else {
                    navigate('/dashboard');
                }
            } catch {
                navigate('/dashboard');
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Giriş başarısız. Lütfen bilgilerinizi kontrol edin.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
    };

    return { login, logout, isLoading, error };
};
