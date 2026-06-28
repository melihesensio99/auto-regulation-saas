import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useCreateAthlete } from '../hooks/useDashboard';

interface AddAthleteModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export const AddAthleteModal = ({ isOpen, onClose }: AddAthleteModalProps) => {
    const { mutateAsync: createAthlete, isPending, error } = useCreateAthlete();

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [subscriptionEndDate, setSubscriptionEndDate] = useState(() => {
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
                subscriptionEndDate: new Date(subscriptionEndDate).toISOString()
            });
            setFirstName('');
            setLastName('');
            setEmail('');
            onClose();
        } catch (err) {
            console.error('Sporcu eklenirken hata oluştu:', err);
        }
    };

    return createPortal(
        <div className="modal-overlay">
            <div className="modal-card">
                <div className="card-stack">
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                        <div>
                            <span className="eyebrow">New athlete</span>
                            <h2 style={{ marginTop: 10 }}>Yeni sporcu ekle</h2>
                        </div>
                        <button type="button" className="btn btn-secondary" onClick={onClose}>Kapat</button>
                    </div>

                    {error && (
                        <div className="chip chip--danger" style={{ width: '100%', justifyContent: 'flex-start' }}>
                            Sporcu eklenirken bir hata oluştu.
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="card-stack">
                        <div className="split-grid">
                            <div className="field">
                                <label className="field-label">Ad</label>
                                <input className="field-input" type="text" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                            </div>
                            <div className="field">
                                <label className="field-label">Soyad</label>
                                <input className="field-input" type="text" required value={lastName} onChange={e => setLastName(e.target.value)} />
                            </div>
                        </div>

                        <div className="field">
                            <label className="field-label">E-posta</label>
                            <input className="field-input" type="email" required value={email} onChange={e => setEmail(e.target.value)} />
                        </div>

                        <div className="field">
                            <label className="field-label">Abonelik bitiş tarihi</label>
                            <input className="field-input" type="date" required value={subscriptionEndDate} onChange={e => setSubscriptionEndDate(e.target.value)} />
                        </div>

                        <div className="form-actions">
                            <button type="button" className="btn btn-secondary" onClick={onClose}>
                                İptal
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isPending}>
                                {isPending ? 'Ekleniyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>,
        document.body
    );
};
