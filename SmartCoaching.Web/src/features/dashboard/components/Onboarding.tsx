import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { dashboardService } from '../services/dashboard.service';

export const Onboarding = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        dateOfBirth: '',
        phoneNumber: '',
        occupation: '',
        mainReason: '',
        shortTermGoal: '',
        longTermGoal: '',
        expectations: '',
        heightCm: '',
        startingWeightKg: '',
        trainingHistory: '',
        currentTrainingRoutine: '',
        outsidePhysicalActivity: '',
        hasTrackedMacros: '',
        hasWorkedWithCoach: '',
        hearAboutUs: '',
        additionalNotes: ''
    });
    
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        
        // Basic validation
        if (!formData.dateOfBirth || !formData.phoneNumber || !formData.shortTermGoal || !formData.heightCm || !formData.startingWeightKg) {
            setError('Lütfen (*) ile işaretli zorunlu alanları doldurun.');
            return;
        }

        const h = parseFloat(formData.heightCm);
        const w = parseFloat(formData.startingWeightKg);

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
                ...formData,
                dateOfBirth: new Date(formData.dateOfBirth).toISOString(),
                heightCm: h,
                startingWeightKg: w
            });

            alert('Kayıt tamamlandı! Koçunuz bilgilerinizi inceleyecektir.');
            localStorage.removeItem('token');
            alert('Lütfen form onaylandı, güncel bilgilerinizle tekrar giriş yapın.');
            navigate('/login');

        } catch (err: any) {
            setError(err.response?.data?.message || 'Form gönderilirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputStyle = { padding: '12px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white', width: '100%', boxSizing: 'border-box' as const };
    const labelStyle = { fontSize: '14px', color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' };
    const groupStyle = { marginBottom: '20px' };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            background: 'var(--bg-dark)'
        }}>
            <div className="glass-panel" style={{ width: '800px', maxWidth: '95vw', padding: '40px', borderRadius: '24px' }}>
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <div className="brand-logo" style={{ justifyContent: 'center', marginBottom: '20px' }}>
                        <div className="brand-icon">🏔️</div>
                        <span className="brand-text">Apex Athletics</span>
                    </div>
                    <h2>Başvuru Formu</h2>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Size en uygun programı hazırlayabilmem için lütfen aşağıdaki soruları eksiksiz yanıtlayın.
                    </p>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Doğum Tarihi *</label>
                            <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} style={inputStyle} />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Telefon Numarası (WhatsApp) *</label>
                            <input type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} style={inputStyle} placeholder="+90 5..." />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Boy (cm) *</label>
                            <input type="number" name="heightCm" required min="100" max="250" value={formData.heightCm} onChange={handleChange} style={inputStyle} placeholder="Örn: 180" />
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Kilo (kg) *</label>
                            <input type="number" name="startingWeightKg" step="0.1" required min="30" max="300" value={formData.startingWeightKg} onChange={handleChange} style={inputStyle} placeholder="Örn: 75.5" />
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Meslek / Okul *</label>
                        <input type="text" name="occupation" required value={formData.occupation} onChange={handleChange} style={inputStyle} placeholder="Günlük yaşamınızda ne yapıyorsunuz?" />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Koçluk almak istemenizin ana sebebi nedir?</label>
                        <textarea name="mainReason" value={formData.mainReason} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Kısa vadeli hedefiniz nedir? *</label>
                        <textarea name="shortTermGoal" required value={formData.shortTermGoal} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Uzun vadeli hedefiniz nedir? *</label>
                        <textarea name="longTermGoal" required value={formData.longTermGoal} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Koçluktan beklentileriniz nelerdir? *</label>
                        <textarea name="expectations" required value={formData.expectations} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Kısa Antrenman Geçmişiniz *</label>
                        <textarea name="trainingHistory" required value={formData.trainingHistory} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Ne zamandır spor yapıyorsunuz? Ara verdiniz mi?" />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Şu anki antrenman düzeniniz nedir? *</label>
                        <textarea name="currentTrainingRoutine" required value={formData.currentTrainingRoutine} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Haftada kaç gün, neler yapıyorsunuz?" />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Antrenman dışı fiziksel aktiviteniz nasıl? *</label>
                        <textarea name="outsidePhysicalActivity" required value={formData.outsidePhysicalActivity} onChange={handleChange} style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} placeholder="Adım sayınız, hareketli mi masa başı mı?" />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Daha önce kalori/makro takibi yaptınız mı? *</label>
                            <select name="hasTrackedMacros" required value={formData.hasTrackedMacros} onChange={handleChange} style={inputStyle}>
                                <option value="">Seçiniz...</option>
                                <option value="Evet, aktif olarak yapıyorum">Evet, aktif olarak yapıyorum</option>
                                <option value="Evet, eskiden yaptım">Evet, eskiden yaptım</option>
                                <option value="Hayır, yapmadım">Hayır, yapmadım</option>
                            </select>
                        </div>
                        <div style={groupStyle}>
                            <label style={labelStyle}>Daha önce başka bir koçla çalıştınız mı? *</label>
                            <select name="hasWorkedWithCoach" required value={formData.hasWorkedWithCoach} onChange={handleChange} style={inputStyle}>
                                <option value="">Seçiniz...</option>
                                <option value="Evet">Evet</option>
                                <option value="Hayır">Hayır</option>
                            </select>
                        </div>
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Beni nereden duydunuz / buldunuz? *</label>
                        <input type="text" name="hearAboutUs" required value={formData.hearAboutUs} onChange={handleChange} style={inputStyle} placeholder="Instagram, Referans, YouTube vb." />
                    </div>

                    <div style={groupStyle}>
                        <label style={labelStyle}>Eklemek İstedikleriniz (Hastalık, Sakatlık vs.)</label>
                        <textarea name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }} placeholder="Sağlık problemleriniz veya belirtmek istediğiniz ek bilgiler..." />
                    </div>

                    <button type="submit" disabled={isLoading} style={{ marginTop: '20px', padding: '16px', fontSize: '18px', fontWeight: 'bold', width: '100%' }}>
                        {isLoading ? 'Gönderiliyor...' : 'Formu Tamamla ve Gönder'}
                    </button>
                </form>
            </div>
        </div>
    );
};
