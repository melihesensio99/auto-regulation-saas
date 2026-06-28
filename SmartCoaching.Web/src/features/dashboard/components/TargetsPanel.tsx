import { useEffect, useMemo, useState } from 'react';
import { useAthletes, useUpdateAthleteTargets } from '../hooks/useDashboard';

interface TargetsPanelProps {
    athleteId: string;
}

export const TargetsPanel = ({ athleteId }: TargetsPanelProps) => {
    const { data: athletes } = useAthletes();
    const updateTargets = useUpdateAthleteTargets();

    const athlete = athletes?.find(item => item.id === athleteId);

    const [targetCalories, setTargetCalories] = useState('');
    const [targetSteps, setTargetSteps] = useState('');

    useEffect(() => {
        setTargetCalories(athlete?.targetCalories && athlete.targetCalories > 0 ? String(athlete.targetCalories) : '');
        setTargetSteps(athlete?.targetSteps && athlete.targetSteps > 0 ? String(athlete.targetSteps) : '');
    }, [athlete?.targetCalories, athlete?.targetSteps, athleteId]);

    const currentSummary = useMemo(() => {
        return {
            calories: athlete?.targetCalories && athlete.targetCalories > 0 ? athlete.targetCalories : null,
            steps: athlete?.targetSteps && athlete.targetSteps > 0 ? athlete.targetSteps : null,
        };
    }, [athlete?.targetCalories, athlete?.targetSteps]);

    const handleSave = async () => {
        const calories = Number(targetCalories);
        const steps = Number(targetSteps);

        if (!Number.isFinite(calories) || calories <= 0) {
            alert("Hedef kalori 0'dan büyük olmalı.");
            return;
        }

        if (!Number.isFinite(steps) || steps <= 0) {
            alert("Hedef adım 0'dan büyük olmalı.");
            return;
        }

        try {
            await updateTargets.mutateAsync({ athleteId, data: { targetCalories: calories, targetSteps: steps } });
            alert('Hedefler güncellendi.');
        } catch {
            alert('Hedefler güncellenirken bir hata oluştu.');
        }
    };

    return (
        <div className="card-stack" style={{ gap: 16 }}>
            <div className="surface" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <span className="section-label">Hedefler</span>
                        <h3 style={{ marginTop: 8 }}>Kalori ve adım hedefini ayarla</h3>
                    </div>
                    <div className="pill-group">
                        <span className="chip">Kalori: {currentSummary.calories ?? '-'}</span>
                        <span className="chip">Adım: {currentSummary.steps ?? '-'}</span>
                    </div>
                </div>
            </div>

            <div className="surface" style={{ padding: 20 }}>
                <div style={{ display: 'grid', gap: 14, maxWidth: 520 }}>
                    <label style={{ display: 'grid', gap: 6 }}>
                        <span className="caption">Hedef kalori</span>
                        <input
                            className="field-input"
                            type="number"
                            min="1"
                            value={targetCalories}
                            onChange={e => setTargetCalories(e.target.value)}
                            placeholder="Örn: 2400"
                        />
                    </label>

                    <label style={{ display: 'grid', gap: 6 }}>
                        <span className="caption">Hedef adım</span>
                        <input
                            className="field-input"
                            type="number"
                            min="1"
                            value={targetSteps}
                            onChange={e => setTargetSteps(e.target.value)}
                            placeholder="Örn: 10000"
                        />
                    </label>

                    <div className="button-group" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <button type="button" className="btn btn-primary" onClick={handleSave} disabled={updateTargets.isPending}>
                            {updateTargets.isPending ? 'Kaydediliyor...' : 'Hedefleri kaydet'}
                        </button>
                        <span className="caption">Boş ya da sıfır değer kabul edilmez.</span>
                    </div>
                </div>
            </div>
        </div>
    );
};
