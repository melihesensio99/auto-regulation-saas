import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ClipboardCheck } from 'lucide-react';
import { athleteService, type OnboardingData } from '../../athlete-portal/services/athleteService';
import { setStoredToken } from '@/shared/auth/token';

export const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<OnboardingData>>({
        heightCm: 175,
        startingWeightKg: 70,
        dateOfBirth: '2000-01-01',
        phoneNumber: '',
        occupation: '',
        mainReason: 1,
        shortTermGoal: '',
        longTermGoal: '',
        expectations: '',
        trainingHistory: '',
        currentTrainingRoutine: '',
        outsidePhysicalActivity: '',
        hasTrackedMacros: '',
        hasWorkedWithCoach: '',
        hearAboutUs: '',
        additionalNotes: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Number(value) : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const token = await athleteService.submitOnboarding(formData as OnboardingData);
            if (token) {
                setStoredToken(token);
            }
            navigate('/athlete/dashboard', { replace: true });
        } catch (err: any) {
            const responseData = err.response?.data;
            const validationErrors = responseData?.errors;
            const flattenedValidationMessage =
                validationErrors && typeof validationErrors === 'object'
                    ? Object.values(validationErrors).flat().find((value) => typeof value === 'string')
                    : null;

            const validationMessage =
                validationErrors?.[0]?.message ||
                validationErrors?.[0]?.Message ||
                flattenedValidationMessage ||
                responseData?.message ||
                responseData?.Message ||
                err.message;

            setError(validationMessage || 'Profil tamamlanamadi. Lutfen alanlari kontrol et.');
        } finally {
            setIsLoading(false);
        }
    };

    const inputClassName =
        'w-full rounded-2xl border border-white/10 bg-black/25 px-4 py-3.5 text-white outline-none transition focus:border-neon-cyan/55 focus:bg-black/35';

    const sectionTitleClassName = 'text-xl font-semibold tracking-[-0.04em] text-white';

    return (
        <div className="min-h-screen overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.15),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(138,43,226,0.18),transparent_30%),linear-gradient(135deg,#08111b_0%,#0b1220_45%,#071824_100%)] text-white">
            <div className="mx-auto w-full max-w-[1480px] px-6 py-8 lg:px-10">
                <div className="grid gap-8 xl:grid-cols-[320px_minmax(0,1fr)]">
                    <aside className="rounded-[32px] border border-white/10 bg-[#0c1521]/88 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.2)] backdrop-blur-xl xl:sticky xl:top-8 xl:h-fit">
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Onboarding flow</p>
                        <h3 className="mt-4 text-2xl font-semibold tracking-[-0.05em] text-white">Kisisel menu</h3>
                        <p className="mt-3 text-sm leading-7 text-white/48">
                            Formu soldan saga dusunelim: once temel profil, sonra hedefler ve en sonda gecmis.
                        </p>

                        <div className="mt-6 space-y-3">
                            {[
                                { step: '01', title: 'Temel bilgiler', description: 'Boy, kilo, dogum tarihi ve iletisim bilgileri' },
                                { step: '02', title: 'Hedefler', description: 'Kisa vade, uzun vade ve koctan beklentiler' },
                                { step: '03', title: 'Gecmis', description: 'Su anki rutin ve ekstra fiziksel aktivite' },
                            ].map((item, index) => (
                                <div key={item.step} className={`rounded-[22px] border px-4 py-4 ${index === 0 ? 'border-neon-cyan/25 bg-neon-cyan/8' : 'border-white/8 bg-white/4'}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`grid h-9 w-9 place-items-center rounded-xl text-sm font-semibold ${index === 0 ? 'bg-neon-cyan/15 text-neon-cyan' : 'bg-white/8 text-white/60'}`}>
                                            {item.step}
                                        </span>
                                        <div>
                                            <p className="text-sm font-semibold text-white">{item.title}</p>
                                            <p className="mt-1 text-xs leading-6 text-white/44">{item.description}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </aside>

                    <section className="rounded-[32px] border border-white/10 bg-[#0d1522]/88 p-7 shadow-[0_24px_80px_rgba(0,0,0,0.24)] backdrop-blur-xl md:p-8">
                        <div className="mb-8 flex items-start justify-between gap-4">
                            <div>
                                <span className="text-[11px] uppercase tracking-[0.28em] text-neon-purple/85">Onboarding</span>
                                <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Kocuna dogru baslangic verisi hazirla</h2>
                                <p className="mt-3 max-w-2xl text-sm leading-7 text-white/54">
                                    Formu tamamladiginda sistem seni uygulamadan atmayacak; dogrudan kendi paneline gecirecegiz.
                                </p>
                            </div>
                            <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neon-purple/20 bg-neon-purple/10 text-neon-purple">
                                <ClipboardCheck className="h-6 w-6" />
                            </div>
                        </div>

                        {error && (
                            <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="space-y-5">
                                <div>
                                    <h3 className={sectionTitleClassName}>1. Temel bilgiler</h3>
                                    <p className="mt-2 text-sm leading-7 text-white/46">Boy, kilo ve iletisim detaylariyla sporcunun temel profilini kuralim.</p>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Boy (cm)</label>
                                        <input type="number" name="heightCm" value={formData.heightCm} onChange={handleChange} required className={inputClassName} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Baslangic kilo (kg)</label>
                                        <input type="number" name="startingWeightKg" value={formData.startingWeightKg} onChange={handleChange} required className={inputClassName} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Dogum tarihi</label>
                                        <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} required className={inputClassName} />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Telefon numarasi</label>
                                        <input type="text" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required className={inputClassName} placeholder="+90..." />
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label className="text-sm text-white/68">Meslek / okul</label>
                                        <input type="text" name="occupation" value={formData.occupation} onChange={handleChange} required className={inputClassName} placeholder="Ogrenci, muhendis, tasarimci..." />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h3 className={sectionTitleClassName}>2. Hedefler ve beklentiler</h3>
                                    <p className="mt-2 text-sm leading-7 text-white/46">Kocun hangi yonde program kuracagini bu cevaplarla netlestirir.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/68">Ana hedef</label>
                                    <select name="mainReason" value={formData.mainReason} onChange={handleChange} className={inputClassName}>
                                        <option value={1}>Kas kazanimi</option>
                                        <option value={2}>Yag kaybi / kilo verme</option>
                                        <option value={3}>Guc artisi</option>
                                        <option value={4}>Dayaniklilik</option>
                                        <option value={5}>Genel fitness</option>
                                        <option value={6}>Rehabilitasyon</option>
                                    </select>
                                </div>

                                <div className="grid gap-5 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Kisa vade hedefi</label>
                                        <textarea name="shortTermGoal" value={formData.shortTermGoal} onChange={handleChange} required rows={4} className={inputClassName} placeholder="Orn: 3 ayda 4 kilo vermek" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-white/68">Uzun vade hedefi</label>
                                        <textarea name="longTermGoal" value={formData.longTermGoal} onChange={handleChange} required rows={4} className={inputClassName} placeholder="Orn: sezon sonuna kadar belirgin bir fizik" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/68">Koctan beklentin</label>
                                    <textarea name="expectations" value={formData.expectations} onChange={handleChange} required rows={3} className={inputClassName} placeholder="Takip sekli, iletisim beklentisi, disiplin duzeyi..." />
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <h3 className={sectionTitleClassName}>3. Antrenman gecmisi</h3>
                                    <p className="mt-2 text-sm leading-7 text-white/46">Mevcut seviyeni dogru okumak, fazla ya da eksik yukleme yapmamak icin gerekli.</p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/68">Antrenman gecmisin</label>
                                    <textarea name="trainingHistory" value={formData.trainingHistory} onChange={handleChange} required rows={3} className={inputClassName} placeholder="Kac yildir spor yapiyorsun, hangi branslarla ilgilendin?" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/68">Su anki rutin</label>
                                    <textarea name="currentTrainingRoutine" value={formData.currentTrainingRoutine} onChange={handleChange} required rows={3} className={inputClassName} placeholder="Haftada kac gun, nasil bir plan uyguluyorsun?" />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-white/68">Ek fiziksel aktivite</label>
                                    <textarea name="outsidePhysicalActivity" value={formData.outsidePhysicalActivity} onChange={handleChange} required rows={3} className={inputClassName} placeholder="Gunluk adim, yuruyus, futbol, bisiklet gibi ek aktiviteler..." />
                                </div>
                            </div>

                            <div className="flex flex-col gap-4 border-t border-white/8 pt-6 lg:flex-row lg:items-center lg:justify-between">
                                <p className="max-w-xl text-sm leading-7 text-white/46">
                                    Form tamamlandiginda seni direkt sporcu paneline yonlendirecegiz.
                                </p>
                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="inline-flex shrink-0 items-center justify-center self-start gap-2 rounded-2xl bg-gradient-to-r from-neon-cyan/85 to-neon-purple/85 px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:shadow-[0_14px_34px_rgba(0,240,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60 lg:self-center"
                                >
                                    {isLoading ? 'Profil gonderiliyor...' : 'Profili tamamla'}
                                    {!isLoading && <ArrowRight className="h-4 w-4" />}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            </div>
        </div>
    );
};
