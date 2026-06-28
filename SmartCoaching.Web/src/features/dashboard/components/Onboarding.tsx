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

        if (!formData.dateOfBirth || !formData.phoneNumber || !formData.shortTermGoal || !formData.heightCm || !formData.startingWeightKg) {
            setError('Lütfen zorunlu alanları doldurun.');
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

            alert('Kaydın tamamlandı! Koçun bilgilerini inceleyecek.');
            localStorage.removeItem('token');
            navigate('/login');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Form gönderilirken bir hata oluştu.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-shell auth-shell" style={{ alignItems: 'stretch' }}>
            <div className="auth-grid" style={{ width: 'min(1240px, 100%)' }}>
                <section className="auth-visual surface">
                    <span className="kicker">Onboarding</span>
                    <div className="card-stack" style={{ marginTop: 18 }}>
                        <h1 className="hero-title">Seni ve hedefini tanıyalım.</h1>
                        <p className="hero-copy">
                            Buradaki bilgiler, koçunun sana daha net program yazmasına yardımcı olur.
                        </p>
                    </div>

                    <div className="card-stack" style={{ marginTop: 24 }}>
                        <div className="auth-feature">
                            <h4>Kısa vadeli hedef</h4>
                            <p>Önümüzdeki birkaç haftada neyi değiştirmek istediğini yaz.</p>
                        </div>
                        <div className="auth-feature">
                            <h4>Geçmiş ve rutin</h4>
                            <p>Eski antrenman alışkanlıklarını ve mevcut düzenini anlat.</p>
                        </div>
                        <div className="auth-feature">
                            <h4>Notlar</h4>
                            <p>Sakatlık, sağlık durumu ve özel dikkat isteyen noktaları ekle.</p>
                        </div>
                    </div>
                </section>

                <section className="auth-panel surface">
                    <div className="card-stack">
                        <div>
                            <span className="eyebrow">Profile setup</span>
                            <h2 style={{ marginTop: 10, fontSize: '2rem' }}>Başvuru formu</h2>
                            <p style={{ marginTop: 8 }}>Seni doğru analiz etmek için temel bilgileri doldur.</p>
                        </div>

                        {error && <div className="chip chip--danger" style={{ justifyContent: 'flex-start' }}>{error}</div>}

                        <form onSubmit={handleSubmit} className="card-stack">
                            <div className="split-grid">
                                <div className="field">
                                    <label className="field-label">Doğum tarihi *</label>
                                    <input className="field-input" type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label className="field-label">Telefon numarası *</label>
                                    <input className="field-input" type="tel" name="phoneNumber" required value={formData.phoneNumber} onChange={handleChange} placeholder="+90 5..." />
                                </div>
                                <div className="field">
                                    <label className="field-label">Boy (cm) *</label>
                                    <input className="field-input" type="number" name="heightCm" required min="100" max="250" value={formData.heightCm} onChange={handleChange} placeholder="180" />
                                </div>
                                <div className="field">
                                    <label className="field-label">Kilo (kg) *</label>
                                    <input className="field-input" type="number" name="startingWeightKg" step="0.1" required min="30" max="300" value={formData.startingWeightKg} onChange={handleChange} placeholder="75.5" />
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Meslek / okul *</label>
                                <input className="field-input" type="text" name="occupation" required value={formData.occupation} onChange={handleChange} placeholder="Günlük yaşamında ne yapıyorsun?" />
                            </div>

                            <div className="field">
                                <label className="field-label">Koçluk almak isteme sebebi</label>
                                <textarea className="field-textarea" name="mainReason" value={formData.mainReason} onChange={handleChange} />
                            </div>

                            <div className="split-grid">
                                <div className="field">
                                    <label className="field-label">Kısa vadeli hedef *</label>
                                    <textarea className="field-textarea" name="shortTermGoal" required value={formData.shortTermGoal} onChange={handleChange} />
                                </div>
                                <div className="field">
                                    <label className="field-label">Uzun vadeli hedef *</label>
                                    <textarea className="field-textarea" name="longTermGoal" required value={formData.longTermGoal} onChange={handleChange} />
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Beklentilerin *</label>
                                <textarea className="field-textarea" name="expectations" required value={formData.expectations} onChange={handleChange} />
                            </div>

                            <div className="field">
                                <label className="field-label">Antrenman geçmişi *</label>
                                <textarea className="field-textarea" name="trainingHistory" required value={formData.trainingHistory} onChange={handleChange} placeholder="Ne zamandır spor yapıyorsun?" />
                            </div>

                            <div className="field">
                                <label className="field-label">Şu anki düzenin *</label>
                                <textarea className="field-textarea" name="currentTrainingRoutine" required value={formData.currentTrainingRoutine} onChange={handleChange} placeholder="Haftada kaç gün, hangi tarz çalışma?" />
                            </div>

                            <div className="field">
                                <label className="field-label">Antrenman dışı aktivite *</label>
                                <textarea className="field-textarea" name="outsidePhysicalActivity" required value={formData.outsidePhysicalActivity} onChange={handleChange} placeholder="Adım sayın, işin, günlük hareketliliğin..." />
                            </div>

                            <div className="split-grid">
                                <div className="field">
                                    <label className="field-label">Makro takibi yaptın mı? *</label>
                                    <select name="hasTrackedMacros" required value={formData.hasTrackedMacros} onChange={handleChange}>
                                        <option value="">Seçiniz...</option>
                                        <option value="Evet, aktif olarak yapıyorum">Evet, aktif olarak yapıyorum</option>
                                        <option value="Evet, eskiden yaptım">Evet, eskiden yaptım</option>
                                        <option value="Hayır, yapmadım">Hayır, yapmadım</option>
                                    </select>
                                </div>
                                <div className="field">
                                    <label className="field-label">Koçla çalıştın mı? *</label>
                                    <select name="hasWorkedWithCoach" required value={formData.hasWorkedWithCoach} onChange={handleChange}>
                                        <option value="">Seçiniz...</option>
                                        <option value="Evet">Evet</option>
                                        <option value="Hayır">Hayır</option>
                                    </select>
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Beni nereden buldun? *</label>
                                <input className="field-input" type="text" name="hearAboutUs" required value={formData.hearAboutUs} onChange={handleChange} placeholder="Instagram, referans, YouTube..." />
                            </div>

                            <div className="field">
                                <label className="field-label">Ek notlar</label>
                                <textarea className="field-textarea" name="additionalNotes" value={formData.additionalNotes} onChange={handleChange} placeholder="Sağlık problemi, sakatlık vb." />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Gönderiliyor...' : 'Formu tamamla'}
                            </button>
                        </form>
                    </div>
                </section>
            </div>
        </div>
    );
};
