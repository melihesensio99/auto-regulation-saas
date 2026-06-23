import { useState } from 'react';
import { useCheckIns, useAddFeedback } from '../hooks/useDashboard';
import type { CheckIn } from '../types';

interface CheckInListProps {
    athleteId: string | null;
}

export const CheckInList = ({ athleteId }: CheckInListProps) => {
    const [feedbackText, setFeedbackText] = useState('');
    
    // Beyin (Hook) bağlantıları
    const { data: checkIns, isLoading } = useCheckIns(athleteId);
    const addFeedbackMutation = useAddFeedback();

    const handleFeedbackSubmit = (checkInId: string) => {
        if (!athleteId || !feedbackText.trim()) return;
        
        addFeedbackMutation.mutate(
            { athleteId, checkInId, feedback: feedbackText },
            {
                onSuccess: () => {
                    setFeedbackText(''); // Formu temizle
                    alert("Feedback başarıyla gönderildi!");
                }
            }
        );
    };

    if (!athleteId) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}>
                Detaylarını görmek için sol taraftan bir sporcu seçin.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ flex: 1 }}>
                <p>Check-In raporları yükleniyor...</p>
            </div>
        );
    }

    return (
        <div className="glass-panel" style={{ flex: 1, overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Haftalık Raporlar</h2>
            
            {checkIns?.length === 0 ? (
                <p>Bu sporcu henüz hiç rapor göndermemiş.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {checkIns?.map((checkIn: CheckIn) => (
                        <div key={checkIn.id} style={{ 
                            backgroundColor: 'rgba(0,0,0,0.3)', padding: '20px', 
                            borderRadius: '12px', border: '1px solid var(--border-glass)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
                                <h3 style={{ color: 'var(--primary)' }}>Tarih: {new Date(checkIn.date).toLocaleDateString()}</h3>
                                <span style={{ fontSize: '18px', fontWeight: 'bold' }}>{checkIn.weightKg} KG</span>
                            </div>

                            {/* AI ANALİZ KARTI */}
                            {checkIn.aiAnalysis && (
                                <div style={{
                                    padding: '20px', marginBottom: '20px', borderRadius: '12px',
                                    background: 'linear-gradient(145deg, rgba(147, 51, 234, 0.1) 0%, rgba(79, 70, 229, 0.1) 100%)',
                                    border: '1px solid rgba(147, 51, 234, 0.5)', boxShadow: '0 0 15px rgba(147, 51, 234, 0.2)'
                                }}>
                                    <h4 style={{ color: '#a855f7', marginBottom: '10px' }}>✨ Mistral AI Analizi</h4>
                                    <p style={{ color: '#e5e7eb', lineHeight: '1.6' }}>{checkIn.aiAnalysis}</p>
                                </div>
                            )}

                            {/* KOÇ GERİ BİLDİRİMİ */}
                            {checkIn.coachFeedback ? (
                                <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '15px', borderRadius: '8px', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                                    <h4 style={{ color: '#10b981', marginBottom: '5px' }}>Sizin Geri Bildiriminiz:</h4>
                                    <p>{checkIn.coachFeedback}</p>
                                </div>
                            ) : (
                                <div style={{ marginTop: '20px' }}>
                                    <textarea 
                                        placeholder="Sporcuya haftalık geri bildiriminizi yazın..."
                                        value={feedbackText}
                                        onChange={(e) => setFeedbackText(e.target.value)}
                                        style={{ width: '100%', minHeight: '80px', padding: '12px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-glass)', color: 'white', marginBottom: '10px' }}
                                    />
                                    <button 
                                        onClick={() => handleFeedbackSubmit(checkIn.id)}
                                        disabled={addFeedbackMutation.isPending}
                                        style={{ backgroundColor: 'var(--primary)', color: 'black' }}
                                    >
                                        {addFeedbackMutation.isPending ? 'Gönderiliyor...' : 'Geri Bildirim Gönder'}
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
