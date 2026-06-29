import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/auth.service';

const decodeToken = (token: string) => {
    const payloadStr = atob(token.split('.')[1]);
    return JSON.parse(payloadStr) as Record<string, string>;
};

export const ChangePassword = () => {
    const navigate = useNavigate();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (newPassword.length < 6) {
            setError('Yeni şifre en az 6 karakter olmalı.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Yeni şifreler eşleşmiyor.');
            return;
        }

        try {
            setIsLoading(true);
            const response = await authService.changePassword({ oldPassword, newPassword });
            localStorage.setItem('token', response.token);

            const payload = decodeToken(response.token);
            if (payload.isOnboardingCompleted === 'False') {
                navigate('/onboarding', { replace: true });
            } else {
                navigate('/athlete/dashboard', { replace: true });
            }
        } catch (err: any) {
            const errorMsg = err.response?.data?.message || 'Şifre değiştirilemedi.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-shell auth-shell">
            <div className="auth-panel surface" style={{ width: 'min(520px, 100%)' }}>
                <div className="card-stack">
                    <div>
                        <span className="eyebrow">Security first</span>
                        <h2 style={{ marginTop: 12, fontSize: '2rem' }}>İlk girişte şifreni değiştir</h2>
                        <p style={{ marginTop: 8 }}>
                            Hesabı kullanmaya devam etmeden önce geçici şifreni yeni bir şifreyle güncelle.
                        </p>
                    </div>

                    {error && (
                        <div className="chip chip--danger" style={{ justifyContent: 'flex-start' }}>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="card-stack">
                        <div className="field">
                            <label className="field-label">Mevcut şifre</label>
                            <input
                                className="field-input"
                                type="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Geçici şifre"
                            />
                        </div>

                        <div className="field">
                            <label className="field-label">Yeni şifre</label>
                            <input
                                className="field-input"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Yeni şifre"
                            />
                        </div>

                        <div className="field">
                            <label className="field-label">Yeni şifre tekrar</label>
                            <input
                                className="field-input"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Yeni şifre tekrar"
                            />
                        </div>

                        <button type="submit" className="btn btn-primary" disabled={isLoading}>
                            {isLoading ? 'Şifre güncelleniyor...' : 'Şifreyi değiştir'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};
