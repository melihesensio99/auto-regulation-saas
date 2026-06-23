import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateAthlete } from '../hooks/useDashboard';

interface AddAthleteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddAthleteModal = ({ isOpen, onClose }: AddAthleteModalProps) => {
    const { mutateAsync: createAthlete, isPending, error } = useCreateAthlete();

    // Form State
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState('');
    const [heightCm, setHeightCm] = useState('');
    const [startingWeightKg, setStartingWeightKg] = useState('');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(() => {
        // Default to 1 month from today
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split('T')[0];
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await createAthlete({
                firstName,
                lastName,
                email,
                dateOfBirth: new Date(dateOfBirth).toISOString(),
                heightCm: parseFloat(heightCm),
                startingWeightKg: parseFloat(startingWeightKg),
                subscriptionEndDate: new Date(subscriptionEndDate).toISOString()
            });
            // Success! Reset form and close
            setFirstName('');
            setLastName('');
            setEmail('');
            setDateOfBirth('');
            setHeightCm('');
            setStartingWeightKg('');
            onClose();
        } catch (err) {
            console.error('Sporcu eklenirken hata oluştu:', err);
        }
    };

    const modalContent = (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 9999,
            backdropFilter: 'blur(5px)'
        }}>
            <div className="glass-panel" style={{ width: '450px', maxHeight: '90vh', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Yeni Sporcu Ekle</h2>
                    <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#fff', fontSize: '20px', cursor: 'pointer' }}>×</button>
                </div>

                {error && (
                    <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
                        Sporcu eklenirken bir hata oluştu. Lütfen bilgileri kontrol edin.
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    
                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Ad</label>
                            <input type="text" required value={firstName} onChange={e => setFirstName(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Soyad</label>
                            <input type="text" required value={lastName} onChange={e => setLastName(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>E-Posta</label>
                        <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                            style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Doğum Tarihi</label>
                            <input type="date" required value={dateOfBirth} onChange={e => setDateOfBirth(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Abonelik Bitiş</label>
                            <input type="date" required value={subscriptionEndDate} onChange={e => setSubscriptionEndDate(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '15px' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Boy (cm)</label>
                            <input type="number" required value={heightCm} onChange={e => setHeightCm(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Başlangıç Kilo (kg)</label>
                            <input type="number" step="0.1" required value={startingWeightKg} onChange={e => setStartingWeightKg(e.target.value)}
                                style={{ padding: '10px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border-glass)', color: 'white' }} />
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                        <button type="button" onClick={onClose} style={{ background: 'transparent', border: '1px solid var(--text-secondary)', padding: '10px 20px', borderRadius: '8px', color: '#fff', cursor: 'pointer' }}>
                            İptal
                        </button>
                        <button type="submit" disabled={isPending} style={{ opacity: isPending ? 0.7 : 1 }}>
                            {isPending ? 'Ekleniyor...' : 'Kaydet'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};
