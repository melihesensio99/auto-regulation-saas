import { useState } from 'react';
import { useCheckIns, useAddFeedback } from '../hooks/useDashboard';
import type { CheckIn } from '../types';

interface CheckInListProps {
    athleteId: string | null;
}

export const CheckInList = ({ athleteId }: CheckInListProps) => {
    const [feedbackText, setFeedbackText] = useState('');
    
    const { data: checkIns, isLoading } = useCheckIns(athleteId);
    const addFeedbackMutation = useAddFeedback();

    const handleFeedbackSubmit = (checkInId: string) => {
        if (!athleteId || !feedbackText.trim()) return;
        
        addFeedbackMutation.mutate(
            { athleteId, checkInId, feedback: feedbackText },
            {
                onSuccess: () => {
                    setFeedbackText('');
                    alert("✅ Feedback başarıyla gönderildi!");
                }
            }
        );
    };

    if (!athleteId) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="empty-state">
                    <span className="empty-state-icon">👈</span>
                    <p>Detaylarını görmek için sol taraftan bir sporcu seçin.</p>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p>Check-In raporları yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '20px', fontSize: '0.95rem', fontWeight: 700 }}>📊 Haftalık Raporlar</h3>
            
            {checkIns?.length === 0 ? (
                <div className="empty-state">
                    <span className="empty-state-icon">📭</span>
                    <p>Bu sporcu henüz hiç rapor göndermemiş.</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Sporcu haftalık check-in gönderdiğinde burada listelenecek.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {checkIns?.map((checkIn: CheckIn, index: number) => (
                        <div key={checkIn.id} className="animate-fade-in" style={{ 
                            animationDelay: `${index * 0.08}s`,
                            background: 'rgba(0,0,0,0.25)', 
                            padding: '20px', 
                            borderRadius: '14px', 
                            border: '1px solid var(--border-glass)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ fontSize: '1.1rem' }}>📅</span>
                                    <h4 style={{ margin: 0, color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                                        {new Date(checkIn.date).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </h4>
                                </div>
                                <span className="badge badge-info" style={{ fontSize: '0.8rem', padding: '5px 12px' }}>
                                    ⚖️ {checkIn.weightKg} KG
                                </span>
                            </div>

                            {/* AI ANALİZ KARTI */}
                            {checkIn.aiAnalysis && (
                                <div style={{
                                    padding: '16px 20px', marginBottom: '16px', borderRadius: '12px',
                                    background: 'linear-gradient(145deg, rgba(139, 92, 246, 0.08) 0%, rgba(59, 130, 246, 0.05) 100%)',
                                    border: '1px solid rgba(139, 92, 246, 0.25)'
                                }}>
                                    <h5 style={{ color: '#a78bfa', marginBottom: '8px', fontSize: '0.8rem', fontWeight: 700 }}>✨ Mistral AI Analizi</h5>
                                    <p style={{ color: '#d1d5db', lineHeight: '1.65', fontSize: '0.85rem', margin: 0 }}>{checkIn.aiAnalysis}</p>
                                </div>
                            )}

                            {/* KOÇ GERİ BİLDİRİMİ */}
                            {checkIn.coachFeedback ? (
                                <div style={{ 
                                    background: 'rgba(16, 185, 129, 0.08)', padding: '14px 18px', borderRadius: '10px', 
                                    border: '1px solid rgba(16, 185, 129, 0.2)' 
                                }}>
                                    <h5 style={{ color: 'var(--success)', marginBottom: '6px', fontSize: '0.8rem', fontWeight: 700 }}>✅ Sizin Geri Bildiriminiz</h5>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{checkIn.coachFeedback}</p>
                                </div>
                            ) : (
                                <div style={{ marginTop: '12px' }}>
                                    <textarea 
                                        placeholder="Sporcuya haftalık geri bildiriminizi yazın..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        className="form-control"
                                        style={{ width: '100%', minHeight: '70px', resize: 'vertical', marginBottom: '10px' }}
                                    />
                                    <button 
                                        onClick={() => handleFeedbackSubmit(checkIn.id)}
                                        disabled={addFeedbackMutation.isPending}
                                        className="btn-save"
                                    >
                                        {addFeedbackMutation.isPending ? '⏳ Gönderiliyor...' : '📨 Geri Bildirim Gönder'}
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
