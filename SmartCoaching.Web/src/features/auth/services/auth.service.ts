import api from '@/shared/services/api';
import { clearStoredToken } from '@/shared/auth/token';
import type { ChangePasswordRequest, LoginRequest, LoginResponse } from '../types';

export const authService = {
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const endpoint = data.role === 'athlete' ? '/auth/athlete-login' : '/auth/login';
        const payload = { email: data.email, password: data.password };
        const response = await api.post<any>(endpoint, payload);
        const tokenValue = typeof response.data === 'string' ? response.data : response.data.token;
        return { token: tokenValue };
    },

    changePassword: async (data: ChangePasswordRequest): Promise<LoginResponse> => {
        const response = await api.put<any>('/auth/change-password', {
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        });

        const tokenValue = typeof response.data === 'string' ? response.data : response.data.token ?? response.data.value;
        return { token: tokenValue };
    },

    logout: () => {
        clearStoredToken();
        window.location.href = '/login';
    }
};
