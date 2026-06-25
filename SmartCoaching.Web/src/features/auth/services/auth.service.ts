import api from '@/shared/services/api';
import type { LoginRequest, LoginResponse } from '../types';

export const authService = {
    // API'ye POST isteği atıp cevabı dönen saf servis fonksiyonu
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const endpoint = data.role === 'athlete' ? '/auth/athlete-login' : '/auth/login';
        const payload = { email: data.email, password: data.password };
        const response = await api.post<any>(endpoint, payload);
        // C# Backend token'ı direkt string olarak (veya obje içinde) dönebilir.
        const tokenValue = typeof response.data === 'string' ? response.data : response.data.token;
        return { token: tokenValue };
    },

    // Çıkış yapma işlemi sadece localStorage'dan token silmek ve yönlendirmektir
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};
