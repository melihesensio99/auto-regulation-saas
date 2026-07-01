import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import type { LoginRequest } from '../types';
import { setStoredToken, getCurrentUserRole } from '@/shared/auth/token';
import { getAthleteRedirectPath } from '@/features/auth/utils/authRedirect';

export const useAuth = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await authService.login(credentials);
            setStoredToken(response.token);

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
