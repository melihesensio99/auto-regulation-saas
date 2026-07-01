import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LockKeyhole, ShieldCheck } from 'lucide-react';
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
            setError('Yeni sifre en az 6 karakter olmali.');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Yeni sifreler eslesmiyor.');
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
            const errorMsg = err.response?.data?.message || 'Sifre degistirilemedi.';
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,rgba(0,240,255,0.16),transparent_30%),radial-gradient(circle_at_bottom_right,rgba(138,43,226,0.18),transparent_34%),linear-gradient(135deg,#08111b_0%,#0b1220_42%,#071824_100%)] text-white">
            <div className="mx-auto grid min-h-screen w-full max-w-[1480px] items-center gap-10 px-6 py-8 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
                <section className="hidden lg:flex lg:flex-col lg:justify-center">
                    <div className="max-w-xl space-y-8">
                        <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 px-4 py-2">
                            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-neon-cyan/15 text-neon-cyan">
                                <ShieldCheck className="h-5 w-5" />
                            </span>
                            <div>
                                <p className="text-sm uppercase tracking-[0.28em] text-white/40">Security first</p>
                                <p className="text-sm text-white/70">Athlete account setup</p>
                            </div>
                        </div>

                        <div>
                            <h1 className="text-[clamp(3rem,5vw,5.4rem)] font-semibold leading-[0.92] tracking-[-0.07em] text-white">
                                Ilk giriste
                                <br />
                                <span className="bg-gradient-to-r from-neon-cyan to-neon-purple bg-clip-text text-transparent">
                                    sifreni guncelle.
                                </span>
                            </h1>
                            <p className="mt-6 max-w-lg text-lg leading-8 text-white/58">
                                Gecici sifreyi bir kez degistiriyoruz. Sonrasinda onboarding ekranina gececeksin ve hesabin hazir olacak.
                            </p>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Step 01</p>
                                <h3 className="mt-3 text-xl font-semibold">Sifreyi yenile</h3>
                                <p className="mt-2 text-sm leading-7 text-white/52">Gecici sifren yerine sana ait guclu bir sifre belirle.</p>
                            </div>
                            <div className="rounded-[28px] border border-white/10 bg-black/20 p-5">
                                <p className="text-[11px] uppercase tracking-[0.28em] text-white/35">Step 02</p>
                                <h3 className="mt-3 text-xl font-semibold">Profili tamamla</h3>
                                <p className="mt-2 text-sm leading-7 text-white/52">Ardindan onboarding formu acilacak ve kendi alanina gecis yapacaksin.</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-[560px] rounded-[32px] border border-white/10 bg-[#0d1522]/88 p-7 shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-9">
                    <div className="mb-8 flex items-start justify-between gap-4">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-neon-cyan/80">Security first</span>
                            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-white">Ilk giriste sifreni degistir</h2>
                            <p className="mt-3 max-w-md text-sm leading-7 text-white/52">
                                Hesabi kullanmaya devam etmeden once gecici sifreni yeni bir sifreyle guncelle.
                            </p>
                        </div>
                        <div className="grid h-14 w-14 place-items-center rounded-2xl border border-neon-purple/25 bg-neon-purple/10 text-neon-purple">
                            <LockKeyhole className="h-6 w-6" />
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/70">Mevcut sifre</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition focus:border-neon-cyan/60 focus:bg-black/40"
                                type="password"
                                required
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                placeholder="Gecici sifre"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/70">Yeni sifre</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition focus:border-neon-purple/60 focus:bg-black/40"
                                type="password"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Yeni sifre"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-medium text-white/70">Yeni sifre tekrar</label>
                            <input
                                className="w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3.5 text-white outline-none transition focus:border-neon-purple/60 focus:bg-black/40"
                                type="password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Yeni sifre tekrar"
                            />
                        </div>

                        <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-3 text-sm text-white/48">
                            Bu adimdan sonra sistem seni otomatik olarak onboarding ekranina veya kendi paneline yonlendirecek.
                        </div>

                        <button type="submit" className="w-full rounded-2xl bg-gradient-to-r from-neon-cyan/85 to-neon-purple/85 px-4 py-3.5 text-sm font-semibold text-slate-950 transition hover:shadow-[0_14px_34px_rgba(0,240,255,0.18)] disabled:cursor-not-allowed disabled:opacity-60" disabled={isLoading}>
                            {isLoading ? 'Sifre guncelleniyor...' : 'Sifreyi degistir'}
                        </button>
                    </form>
                </section>
            </div>
        </div>
    );
};
