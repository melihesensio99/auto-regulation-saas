import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

export const Login = () => {
    // 1. Local State (Sadece bu formu ilgilendiren input değerleri)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'coach' | 'athlete'>('coach');

    // 2. Custom Hook'tan gelen iş mantığı fonksiyonları ve stateler (Sorumluluk Ayrımı)
    const { login, isLoading, error } = useAuth();

    // 3. Form gönderildiğinde tetiklenecek fonksiyon
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Sayfanın yenilenmesini engeller
        await login({ email, password, role });
    };

    // 4. Saf Sunum (Presentational) Kısmı (HTML/JSX)
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <div className="glass-panel" style={{ width: '400px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Apex Athletics</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>Sisteme Giriş Yapın</p>
                </div>

                {/* Role Toggle */}
                <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '4px', marginBottom: '24px' }}>
                    <button 
                        type="button"
                        onClick={() => setRole('coach')}
                        style={{ 
                            flex: 1, 
                            padding: '10px', 
                            background: role === 'coach' ? 'var(--primary-color)' : 'transparent',
                            color: role === 'coach' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: role === 'coach' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        👨‍🏫 Koç Girişi
                    </button>
                    <button 
                        type="button"
                        onClick={() => setRole('athlete')}
                        style={{ 
                            flex: 1, 
                            padding: '10px', 
                            background: role === 'athlete' ? 'var(--primary-color)' : 'transparent',
                            color: role === 'athlete' ? '#fff' : 'var(--text-secondary)',
                            border: 'none',
                            borderRadius: '6px',
                            fontWeight: role === 'athlete' ? 'bold' : 'normal',
                            transition: 'all 0.2s'
                        }}
                    >
                        🏃‍♂️ Sporcu Girişi
                    </button>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    
                    {/* Hata Mesajı Bölümü */}
                    {error && (
                        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', border: '1px solid var(--danger)', fontSize: '14px' }}>
                            {error}
                        </div>
                    )}

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>E-Posta Adresi</label>
                        <input 
                            type="email" 
                            required 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }}
                            placeholder="ornek@mail.com"
                        />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Şifre</label>
                        <input 
                            type="password" 
                            required 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ marginTop: '16px', opacity: isLoading ? 0.7 : 1 }}>
                        {isLoading ? 'Giriş Yapılıyor...' : 'Giriş Yap'}
                    </button>
                </form>
            </div>
        </div>
    );
};
