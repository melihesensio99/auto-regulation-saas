import axios from 'axios';

// Backend API adresimiz .env dosyasından güvenli bir şekilde okunur.
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5169/api';

// Tüm isteklerimizde kullanılacak ana Axios kopyası
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor (Araya Girici): Her istek arka plana gitmeden önce bu fonksiyondan geçer.
// Eğer kullanıcının giriş Token'ı varsa, bunu otomatik olarak isteğe (Header) ekler.
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// Interceptor (Cevap Yakalayıcı): Backend'den gelen cevabı uygulamaya gitmeden yakalar.
// Örneğin 401 (Yetkisiz) dönerse, kullanıcıyı otomatik Login sayfasına atabilir.
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Token süresi bitmiş veya yetkisiz erişim. Çıkış yap.
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
