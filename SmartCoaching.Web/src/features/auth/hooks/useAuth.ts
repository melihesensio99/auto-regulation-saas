import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';
import { LoginRequest } from '../types';

export const useAuth = () => {
    // Component içinde görünecek Loading ve Error stateleri
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    // React Router yönlendirme hook'u
    const navigate = useNavigate();

    // Login iş mantığı (Tüm Try-Catch ve state yönetimini burada soyutluyoruz)
    const login = async (credentials: LoginRequest) => {
        setIsLoading(true);
        setError(null);
        
        try {
            const response = await authService.login(credentials);
            
            // Başarılı ise token'ı kaydet
            localStorage.setItem('token', response.token);
            
            // Dashboard'a yönlendir
            navigate('/dashboard');
            
        } catch (err: any) {
            // Hata mesajını yakala ve state'e ata
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
