import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';

const featureItems = [
    {
        title: 'Günlük koç görünümü',
        description: 'Sporcuların, programların ve haftalık trendlerin tek ekranda.'
    },
    {
        title: 'Kaynaklı kararlar',
        description: 'Program ve öneriler, veri + spor bilimi temelli ilerler.'
    },
    {
        title: 'Hızlı aksiyon',
        description: 'Yeni sporcu, onboarding ve progress kayıtlarına tek akıştan ulaş.'
    }
];

export const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'coach' | 'athlete'>('coach');
    const { login, isLoading, error } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await login({ email, password, role });
    };

    return (
        <div className="auth-shell page-shell">
            <div className="auth-grid" style={{ width: 'min(1240px, 100%)' }}>
                <section className="auth-visual surface">
                    <div className="card-stack">
                        <span className="kicker">SmartCoaching OS</span>
                        <div>
                            <h1 className="hero-title">Sporcu takibini tek akışa toplayan çalışma alanı.</h1>
                            <p className="hero-copy" style={{ marginTop: 16 }}>
                                Koç ve sporcu tarafında aynı dili konuşan, veri odaklı ve temiz bir deneyim.
                            </p>
                        </div>
                    </div>

                    <div className="auth-metrics" style={{ marginTop: 24 }}>
                        <div className="metric-card">
                            <span className="metric-card__label">Takım takibi</span>
                            <span className="metric-card__value">Live</span>
                            <div className="metric-card__hint">Günlük aktif sporcu görünümü</div>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card__label">Planlar</span>
                            <span className="metric-card__value">RAG</span>
                            <div className="metric-card__hint">Kaynaklı bilgi akışı için hazır</div>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card__label">Odak</span>
                            <span className="metric-card__value">Daily</span>
                            <div className="metric-card__hint">Günlük takip ve karar destek</div>
                        </div>
                    </div>

                    <div className="card-stack" style={{ marginTop: 8 }}>
                        {featureItems.map(item => (
                            <article key={item.title} className="auth-feature">
                                <h4>{item.title}</h4>
                                <p>{item.description}</p>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="auth-panel surface">
                    <div className="card-stack">
                        <div>
                            <span className="eyebrow">Welcome back</span>
                            <h2 style={{ marginTop: 12, fontSize: '2rem' }}>Hesabına giriş yap</h2>
                            <p style={{ marginTop: 8 }}>
                                Koç ya da sporcu olarak devam et. Sistem seni doğru alana yönlendirecek.
                            </p>
                        </div>

                        <div className="tab-bar" role="tablist" aria-label="Giriş tipi">
                            <button
                                type="button"
                                className={`tab-btn ${role === 'coach' ? 'active' : ''}`}
                                onClick={() => setRole('coach')}
                            >
                                Koç
                            </button>
                            <button
                                type="button"
                                className={`tab-btn ${role === 'athlete' ? 'active' : ''}`}
                                onClick={() => setRole('athlete')}
                            >
                                Sporcu
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="card-stack">
                            {error && (
                                <div className="chip chip--danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
                                    {error}
                                </div>
                            )}

                            <div className="field">
                                <label className="field-label">E-posta adresi</label>
                                <input
                                    className="field-input"
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ornek@mail.com"
                                />
                            </div>

                            <div className="field">
                                <label className="field-label">Şifre</label>
                                <input
                                    className="field-input"
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>

                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? 'Giriş hazırlanıyor...' : 'Giriş yap'}
                            </button>
                        </form>

                        <div className="soft-divider" />

                        <div className="card-stack" style={{ gap: 8 }}>
                            <div className="caption">Örnek akış</div>
                            <p>
                                Koç hesabı ile takım paneline, sporcu hesabı ile kişisel takip alanına geçersin.
                            </p>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};
