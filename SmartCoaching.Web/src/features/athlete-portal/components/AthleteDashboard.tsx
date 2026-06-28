import React, { useMemo, useState } from 'react';
import { useAthleteProfile, useLogProgress, useAthleteProgressLogs } from '../hooks/useAthletePortal';

export const AthleteDashboard = () => {
    const { data: profile, isLoading: isProfileLoading } = useAthleteProfile();
    const { mutate: logProgress, isPending: isLogging } = useLogProgress();

    const dateRange = useMemo(() => {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        return {
            startDate: startDate.toISOString(),
            endDate: new Date().toISOString(),
        };
    }, []);

    const { data: progressLogs } = useAthleteProgressLogs(dateRange.startDate, dateRange.endDate);

    const [calories, setCalories] = useState('');
    const [steps, setSteps] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [workoutCompleted, setWorkoutCompleted] = useState(false);
    const [frontPhotoUrl, setFrontPhotoUrl] = useState('');
    const [backPhotoUrl, setBackPhotoUrl] = useState('');
    const [sidePhotoUrl, setSidePhotoUrl] = useState('');

    const isSunday = new Date().getDay() === 0;

    if (isProfileLoading) {
        return (
            <div className="empty-state">
                <div className="loader" />
                <p>Profil yükleniyor...</p>
            </div>
        );
    }

    const handleLogProgress = (e: React.FormEvent) => {
        e.preventDefault();
        logProgress({
            date: new Date().toISOString(),
            consumedCalories: parseInt(calories) || 0,
            takenSteps: parseInt(steps) || 0,
            weightKg: weight ? parseFloat(weight) : null,
            notes,
            isWorkoutCompleted: workoutCompleted,
            frontPhotoUrl: frontPhotoUrl || null,
            backPhotoUrl: backPhotoUrl || null,
            sidePhotoUrl: sidePhotoUrl || null
        }, {
            onSuccess: () => {
                alert('Günlük gelişim kaydedildi!');
                setCalories('');
                setSteps('');
                setWeight('');
                setNotes('');
                setWorkoutCompleted(false);
                setFrontPhotoUrl('');
                setBackPhotoUrl('');
                setSidePhotoUrl('');
            }
        });
    };

    const latestLog = progressLogs?.[0];

    return (
        <div className="card-stack" style={{ gap: 24 }}>
            <section className="hero-panel surface">
                <div className="coach-hero__grid">
                    <div className="card-stack">
                        <span className="eyebrow">Daily check-in</span>
                        <div>
                            <h1 className="page-title" style={{ fontSize: '2.8rem' }}>
                                Hoş geldin, {profile?.firstName}
                            </h1>
                            <p className="page-subtitle" style={{ marginTop: 10 }}>
                                Bugünün verisini gir, sistem seni haftalık trend içinde takip etsin.
                            </p>
                        </div>
                        <div className="button-group">
                            <span className="chip chip--success">Takip açık</span>
                            <span className="chip">Son 7 gün görünümü</span>
                            <span className="chip">Kişisel koç alanı</span>
                        </div>
                        <div className="button-group">
                            <span className="chip">Hedef kcal: {profile?.targetCalories ?? '—'}</span>
                            <span className="chip">Hedef adım: {profile?.targetSteps ?? '—'}</span>
                        </div>
                    </div>

                    <div className="stats-grid">
                        <div className="metric-card">
                            <span className="metric-card__label">Son kilo</span>
                            <span className="metric-card__value">{latestLog?.weightKg ?? '—'}</span>
                            <div className="metric-card__hint">Güncel kayıtlar</div>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card__label">Son kalori</span>
                            <span className="metric-card__value">{latestLog?.consumedCalories ?? '—'}</span>
                            <div className="metric-card__hint">Kcal</div>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card__label">Son adım</span>
                            <span className="metric-card__value">{latestLog?.takenSteps ?? '—'}</span>
                            <div className="metric-card__hint">Günlük hareket</div>
                        </div>
                        <div className="metric-card">
                            <span className="metric-card__label">Antrenman</span>
                            <span className="metric-card__value">{latestLog?.isWorkoutCompleted ? '✓' : '—'}</span>
                            <div className="metric-card__hint">Bugün tamamlandı mı</div>
                        </div>
                    </div>
                </div>
            </section>

            <div className="coach-hero__grid">
                <section className="surface" style={{ padding: 24 }}>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Günlük kayıt</span>
                            <h2 style={{ marginTop: 8, fontSize: '1.7rem' }}>Bugünün verilerini ekle</h2>
                        </div>

                        <form onSubmit={handleLogProgress} className="card-stack">
                            <div className="split-grid">
                                <div className="field">
                                    <label className="field-label">Alınan kalori</label>
                                    <input className="field-input" type="number" value={calories} onChange={e => setCalories(e.target.value)} required />
                                </div>
                                <div className="field">
                                    <label className="field-label">Atılan adım</label>
                                    <input className="field-input" type="number" value={steps} onChange={e => setSteps(e.target.value)} required />
                                </div>
                            </div>

                            <div className="field">
                                <label className="field-label">Güncel kilo (opsiyonel)</label>
                                <input className="field-input" type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
                            </div>

                            <label className="chip" style={{ justifyContent: 'flex-start' }}>
                                <input
                                    type="checkbox"
                                    checked={workoutCompleted}
                                    onChange={e => setWorkoutCompleted(e.target.checked)}
                                    style={{ width: 18, height: 18 }}
                                />
                                Antrenmanımı tamamladım
                            </label>

                            <div className="field">
                                <label className="field-label">Günün notu</label>
                                <textarea className="field-textarea" value={notes} onChange={e => setNotes(e.target.value)} />
                            </div>

                            {isSunday && (
                                <div className="timeline-card" style={{ padding: 18 }}>
                                    <span className="section-label">Haftalık form</span>
                                    <p style={{ marginTop: 8 }}>Pazar kontrolü için önden, arkadan ve yandan fotoğraf bağlantısı ekleyebilirsin.</p>
                                    <div className="card-stack" style={{ marginTop: 14 }}>
                                        <input className="field-input" type="url" placeholder="Ön fotoğraf URL" value={frontPhotoUrl} onChange={e => setFrontPhotoUrl(e.target.value)} />
                                        <input className="field-input" type="url" placeholder="Arka fotoğraf URL" value={backPhotoUrl} onChange={e => setBackPhotoUrl(e.target.value)} />
                                        <input className="field-input" type="url" placeholder="Yan fotoğraf URL" value={sidePhotoUrl} onChange={e => setSidePhotoUrl(e.target.value)} />
                                    </div>
                                </div>
                            )}

                            <button type="submit" className="btn btn-primary" disabled={isLogging}>
                                {isLogging ? 'Kaydediliyor...' : 'Günlük veriyi kaydet'}
                            </button>
                        </form>
                    </div>
                </section>

                <section className="surface" style={{ padding: 24 }}>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Son 7 gün</span>
                            <h2 style={{ marginTop: 8, fontSize: '1.7rem' }}>Trend özeti</h2>
                        </div>

                        {(!progressLogs || progressLogs.length === 0) ? (
                            <div className="empty-state">
                                <span className="empty-state-icon">∅</span>
                                <p>Henüz kayıt yok.</p>
                            </div>
                        ) : (
                            <div className="card-stack">
                                {progressLogs.map(log => (
                                    <article key={log.id} className="timeline-card" style={{ padding: 18 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                                            <div>
                                                <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>
                                                    {new Date(log.date).toLocaleDateString('tr-TR', {
                                                        weekday: 'short',
                                                        month: 'short',
                                                        day: 'numeric'
                                                    })}
                                                </div>
                                                <p className="caption" style={{ marginTop: 4 }}>
                                                    {log.consumedCalories} kcal · {log.takenSteps} adım
                                                </p>
                                            </div>
                                            <span className={`chip ${log.isWorkoutCompleted ? 'chip--success' : 'chip--warning'}`}>
                                                {log.isWorkoutCompleted ? 'Antrenman var' : 'Dinlenme'}
                                            </span>
                                        </div>
                                        {log.notes && <p style={{ marginTop: 12 }}>{log.notes}</p>}
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
