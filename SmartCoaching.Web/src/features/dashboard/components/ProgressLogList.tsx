import { useMemo, useState } from 'react';
import type { ProgressLog } from '@/features/dashboard/types';
import { EmptyPanel, ErrorPanel, LoadingPanel } from '@/shared/components/feedback/StatePanels';
import { useAddFeedback, useProgressLogs } from '@/features/dashboard/hooks/useDashboard';
import { createLast30DaysRange } from '@/features/dashboard/utils/progressDateRange';

interface ProgressLogListProps {
    athleteId: string | null;
}

const formatProgressDate = (date: string) =>
    new Date(date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' });

const renderProgressPhotos = (log: ProgressLog) => {
    const photos = [
        { url: log.frontPhotoUrl, alt: 'Front' },
        { url: log.backPhotoUrl, alt: 'Back' },
        { url: log.sidePhotoUrl, alt: 'Side' },
    ].filter((photo): photo is { url: string; alt: string } => Boolean(photo.url));

    if (photos.length === 0) {
        return <span className="caption" style={{ color: 'var(--text-muted)' }}>Fotograf eklenmemis</span>;
    }

    return photos.map((photo) => (
        <img
            key={photo.alt}
            src={photo.url}
            alt={photo.alt}
            style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }}
        />
    ));
};

export const ProgressLogList = ({ athleteId }: ProgressLogListProps) => {
    const [feedbackText, setFeedbackText] = useState('');

    const dateRange = useMemo(createLast30DaysRange, []);
    const { data: progressLogs, isLoading, isError } = useProgressLogs(athleteId, dateRange.startDate, dateRange.endDate);
    const addFeedbackMutation = useAddFeedback();

    const handleFeedbackSubmit = (progressLogId: string) => {
        if (!athleteId || !feedbackText.trim()) {
            return;
        }

        addFeedbackMutation.mutate(
            { athleteId, progressLogId, feedback: feedbackText },
            {
                onSuccess: () => {
                    setFeedbackText('');
                    alert('Geri bildirim basariyla gonderildi.');
                },
            }
        );
    };

    if (!athleteId) {
        return (
            <div className="glass-panel" style={{ flex: 1 }}>
                <EmptyPanel
                    icon=">"
                    message="Detaylarini gormek icin soldan bir sporcu sec."
                    minHeight={320}
                />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ flex: 1 }}>
                <LoadingPanel message="Gelisim kayitlari yukleniyor..." />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="glass-panel" style={{ flex: 1 }}>
                <ErrorPanel message="Gelisim kayitlari alinamadi." />
            </div>
        );
    }

    const visibleLogs = progressLogs ?? [];

    return (
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '0.95rem', fontWeight: 700 }}>Gelisim Gunlugu</h3>

            {visibleLogs.length === 0 ? (
                <EmptyPanel
                    icon="i"
                    message="Bu sporcu henuz gelisim kaydi gondermemis."
                    detail="Kalori, adim, kilo ve notlar geldikce burada listelenecek."
                    minHeight={320}
                />
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {visibleLogs.map((log, index) => (
                        <div
                            key={log.id}
                            className="animate-fade-in"
                            style={{
                                animationDelay: `${index * 0.08}s`,
                                background: 'rgba(0,0,0,0.25)',
                                padding: '20px',
                                borderRadius: '14px',
                                border: '1px solid var(--border-glass)',
                            }}
                        >
                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>Tarih</span>
                                    <h4 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                                        {formatProgressDate(log.date)}
                                    </h4>
                                </div>
                                <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                                    {log.weightKg ? `Kilo ${log.weightKg} KG` : 'Kilo -'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '16px' }}>
                                <span className="chip">Kalori {log.consumedCalories} kcal</span>
                                <span className="chip">Adim {log.takenSteps}</span>
                                <span className={`chip ${log.isWorkoutCompleted ? 'chip--success' : 'chip--warning'}`}>
                                    {log.isWorkoutCompleted ? 'Antrenman var' : 'Dinlenme'}
                                </span>
                            </div>

                            <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
                                {renderProgressPhotos(log)}
                            </div>

                            {log.aiAnalysis && (
                                <div
                                    style={{
                                        padding: '16px 20px',
                                        marginBottom: '16px',
                                        borderRadius: '12px',
                                        background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                        border: '1px solid rgba(139, 92, 246, 0.25)',
                                    }}
                                >
                                    <h5 style={{ color: '#a78bfa', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        AI Analizi
                                    </h5>
                                    <p style={{ color: '#d1d5db', lineHeight: '1.65', fontSize: '0.85rem', margin: 0 }}>
                                        {log.aiAnalysis}
                                    </p>
                                </div>
                            )}

                            {log.notes && (
                                <div
                                    style={{
                                        marginTop: '12px',
                                        padding: '12px 14px',
                                        borderRadius: '10px',
                                        background: 'rgba(255,255,255,0.04)',
                                        border: '1px solid rgba(255,255,255,0.08)',
                                    }}
                                >
                                    <h5
                                        style={{
                                            margin: '0 0 6px 0',
                                            fontSize: '0.78rem',
                                            color: 'var(--text-muted)',
                                            fontWeight: 700,
                                        }}
                                    >
                                        Gunluk not
                                    </h5>
                                    <p style={{ margin: 0, fontSize: '0.85rem', lineHeight: 1.55 }}>{log.notes}</p>
                                </div>
                            )}

                            {log.coachFeedback ? (
                                <div
                                    style={{
                                        background: 'rgba(16, 185, 129, 0.08)',
                                        padding: '14px 18px',
                                        borderRadius: '10px',
                                        border: '1px solid rgba(16, 185, 129, 0.2)',
                                    }}
                                >
                                    <h5 style={{ color: 'var(--success)', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700 }}>
                                        Sizin geri bildiriminiz
                                    </h5>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{log.coachFeedback}</p>
                                </div>
                            ) : (
                                <div style={{ marginTop: '12px' }}>
                                    <textarea
                                        placeholder="Sporcuya haftalik geri bildiriminizi yazin..."
                                        value={feedbackText}
                                        onChange={(event) => setFeedbackText(event.target.value)}
                                        className="form-control"
                                        style={{ width: '100%', minHeight: '70px', resize: 'vertical', marginBottom: '10px' }}
                                    />
                                    <button
                                        onClick={() => handleFeedbackSubmit(log.id)}
                                        disabled={addFeedbackMutation.isPending}
                                        className="btn-save"
                                    >
                                        {addFeedbackMutation.isPending ? 'Gonderiliyor...' : 'Geri bildirim gonder'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
