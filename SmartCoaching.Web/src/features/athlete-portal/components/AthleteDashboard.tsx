import React, { useState } from 'react';
import { useAthleteProfile, useLogProgress, useAthleteProgressLogs } from '../hooks/useAthletePortal';

export const AthleteDashboard = () => {
    const { data: profile, isLoading: isProfileLoading } = useAthleteProfile();
    const { mutate: logProgress, isPending: isLogging } = useLogProgress();
    
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    const { data: progressLogs } = useAthleteProgressLogs(startDate.toISOString(), new Date().toISOString());

    const [calories, setCalories] = useState('');
    const [steps, setSteps] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [workoutCompleted, setWorkoutCompleted] = useState(false);
    
    // Photo states
    const [frontPhotoUrl, setFrontPhotoUrl] = useState('');
    const [backPhotoUrl, setBackPhotoUrl] = useState('');
    const [sidePhotoUrl, setSidePhotoUrl] = useState('');

    const isSunday = new Date().getDay() === 0;

    if (isProfileLoading) {
        return <div style={{ color: 'white', padding: '20px' }}>Yükleniyor...</div>;
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

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
            <div style={{ padding: '30px', background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(139, 92, 246, 0.1))', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <h1 style={{ margin: '0 0 10px 0', color: 'white' }}>Hoş Geldin, {profile?.firstName}! ⚡</h1>
                <p style={{ margin: 0, color: 'var(--text-secondary)' }}>Bugün hedeflerine ulaşmak için harika bir gün. Günlük verilerini girmeyi unutma!</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
                <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'white' }}>📝 Günlük Veri Girişi</h3>
                    <form onSubmit={handleLogProgress} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Alınan Kalori</label>
                                <input type="number" value={calories} onChange={e => setCalories(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Atılan Adım</label>
                                <input type="number" value={steps} onChange={e => setSteps(e.target.value)} required style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Güncel Kilo (Opsiyonel)</label>
                            <input type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                        </div>

                        <div>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', color: 'white' }}>
                                <input type="checkbox" checked={workoutCompleted} onChange={e => setWorkoutCompleted(e.target.checked)} style={{ width: '20px', height: '20px' }} />
                                Antrenmanımı Tamamladım 💪
                            </label>
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: '8px', fontSize: '14px', color: 'var(--text-secondary)' }}>Günün Notu (Opsiyonel)</label>
                            <textarea value={notes} onChange={e => setNotes(e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', minHeight: '80px' }} />
                        </div>

                        {isSunday && (
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '15px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.2)' }}>
                                <h4 style={{ margin: '0 0 10px 0', color: 'var(--accent-primary)' }}>📸 Haftalık Form Kontrolü (Pazar)</h4>
                                <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                    Lütfen haftalık değerlendirme için güncel form fotoğraflarınızı (URL) ekleyin.
                                </p>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    <input type="url" placeholder="Ön Fotoğraf URL" value={frontPhotoUrl} onChange={e => setFrontPhotoUrl(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    <input type="url" placeholder="Arka Fotoğraf URL" value={backPhotoUrl} onChange={e => setBackPhotoUrl(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                    <input type="url" placeholder="Yan Fotoğraf URL" value={sidePhotoUrl} onChange={e => setSidePhotoUrl(e.target.value)} style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={isLogging} style={{ padding: '15px', background: 'var(--accent-primary)', color: 'white', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer', marginTop: '10px' }}>
                            {isLogging ? 'Kaydediliyor...' : 'Günlük Veriyi Kaydet'}
                        </button>
                    </form>
                </div>

                <div className="glass-panel" style={{ padding: '25px', borderRadius: '20px' }}>
                    <h3 style={{ marginTop: 0, marginBottom: '20px', color: 'white' }}>📈 Son 7 Gün</h3>
                    {(!progressLogs || progressLogs.length === 0) ? (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>Henüz kayıt yok.</div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                            {progressLogs.map(log => (
                                <div key={log.id} style={{ background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <div style={{ fontWeight: 'bold', color: 'white', marginBottom: '4px' }}>
                                            {new Date(log.date).toLocaleDateString('tr-TR', { weekday: 'short', month: 'short', day: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
                                            {log.consumedCalories} kcal • {log.takenSteps} adım
                                        </div>
                                    </div>
                                    <div style={{ fontSize: '20px' }}>
                                        {log.isWorkoutCompleted ? '🏋️' : '🛋️'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
