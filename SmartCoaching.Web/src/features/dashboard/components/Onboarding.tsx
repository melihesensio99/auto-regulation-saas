import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';

export const Onboarding = () => {
    const navigate = useNavigate();

    const [dateOfBirth, setDateOfBirth] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [startingWeightKg, setStartingWeightKg] = useState('');
    const [injuryHistory, setInjuryHistory] = useState('');
    const [goals, setGoals] = useState('');
    const [lifestyle, setLifestyle] = useState('');
    const [supplementUsage, setSupplementUsage] = useState('');
    const [dietaryPreferences, setDietaryPreferences] = useState('');
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Client-side validation
        if (!dateOfBirth || !heightCm || !startingWeightKg || !goals || !lifestyle) {
            setError('Lütfen zorunlu alanları doldurun.');
            return;
        }

        const h = parseFloat(heightCm);
        const w = parseFloat(startingWeightKg);

        if (h < 100 || h > 250) {
            setError('Lütfen geçerli bir boy giriniz (100-250 cm).');
            return;
        }

        if (w < 30 || w > 300) {
            setError('Lütfen geçerli bir kilo giriniz (30-300 kg).');
            return;
        }

        try {
            setIsLoading(true);
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            const payloadStr = atob(token.split('.')[1]);
            const payload = JSON.parse(payloadStr);
            const athleteId = payload.sub;

            await dashboardService.submitOnboardingForm(athleteId, {
                dateOfBirth: new Date(dateOfBirth).toISOString(),
                heightCm: h,
                startingWeightKg: w,
                injuryHistory,
                goals,
                lifestyle,
                supplementUsage,
                dietaryPreferences
            });

            // Başarılı olduğunda yeniden token alamıyoruz şimdilik (Login olup yenilemek lazım)
            // Ama basitçe dashboard'a yönlendirelim
            alert('Kayıt tamamlandı! Koçunuz bilgilerinizi inceleyecektir.');
            
            // Çıkış yapıp tekrar girmesini sağlayabiliriz veya direkt dashboard'a atabiliriz.
            // Dashboard'a girince yetki hatası almaması için token'ı yenilemesi en sağlıklısı.
            // Ancak şimdilik dashboard'a gönderelim.
            localStorage.removeItem('token');
            alert('Lütfen güncel bilgilerinizle tekrar giriş yapın.');
            navigate('/login');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Form gönderilirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="glass-panel" style={{ width: '600px', maxWidth: '90vw', maxHeight: '90vh', overflowY: 'auto', padding: '30px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
                        <div className="brand-icon">⚡</div>
                        <span className="brand-text">SmartCoaching</span>
                    </div>
                    <h2>Hoş Geldiniz!</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Koçunuzun size en uygun programı hazırlayabilmesi için lütfen aşağıdaki tanışma formunu eksiksiz doldurun.
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Doğum Tarihi *</label>
                            <input type="date" required value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                                style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Boy (cm) *</label>
                            <input type="number" required min="100" max="250" value={heightCm} onChange={e => setHeightCm(e.target.value)}
                                style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Kilo (kg) *</label>
                            <input type="number" step="0.1" required min="30" max="300" value={startingWeightKg} onChange={e => setStartingWeightKg(e.target.value)}
                                style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Sakatlık Geçmişi</label>
                        <textarea value={injuryHistory} onChange={e => setInjuryHistory(e.target.value)} maxLength={1000}
                            placeholder="Daha önce yaşadığınız önemli bir sakatlık var mı?"
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Hedefleriniz *</label>
                        <textarea required value={goals} onChange={e => setGoals(e.target.value)} maxLength={1000}
                            placeholder="Kilo vermek, kas yapmak, daha fit olmak vb."
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Hayat Şartları *</label>
                        <textarea required value={lifestyle} onChange={e => setLifestyle(e.target.value)} maxLength={1000}
                            placeholder="Masa başı mı çalışıyorsunuz? Uyku düzeniniz nasıl?"
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Supplement Kullanımı / Bütçesi</label>
                        <textarea value={supplementUsage} onChange={e => setSupplementUsage(e.target.value)} maxLength={1000}
                            placeholder="Şu an kullandığınız veya bütçe ayırabileceğiniz takviyeler?"
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Beslenme Tercihleri / Alerjiler</label>
                        <textarea value={dietaryPreferences} onChange={e => setDietaryPreferences(e.target.value)} maxLength={1000}
                            placeholder="Alerjiniz olan veya kesinlikle yemem dediğiniz şeyler?"
                            style={{ padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ marginTop: '10px', padding: '15px', fontSize: '16px', fontWeight: 'bold' }}>
                        {isLoading ? 'Kaydediliyor...' : 'Formu Kaydet ve Tamamla'}
                    </button>
                </form>
            </div>
        </div>
    );
};
