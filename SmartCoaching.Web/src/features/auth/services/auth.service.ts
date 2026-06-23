import api from '@/shared/services/api';
import { LoginRequest, LoginResponse } from '../types';

export const authService = {
    // API'ye POST isteği atıp cevabı dönen saf servis fonksiyonu
    login: async (data: LoginRequest): Promise<LoginResponse> => {
        const response = await api.post<LoginResponse>('/auth/login', data);
        return response.data;
    },

    // Çıkış yapma işlemi sadece localStorage'dan token silmek ve yönlendirmektir
    logout: () => {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
};
