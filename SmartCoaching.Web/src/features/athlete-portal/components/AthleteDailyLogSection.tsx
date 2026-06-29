import type { FormEvent } from 'react';

interface AthleteDailyLogSectionProps {
    calories: string;
    steps: string;
    weight: string;
    notes: string;
    workoutCompleted: boolean;
    frontPhotoUrl: string;
    backPhotoUrl: string;
    sidePhotoUrl: string;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
    isLogging: boolean;
    onSubmit: (event: FormEvent) => void;
    onCaloriesChange: (value: string) => void;
    onStepsChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onWorkoutCompletedChange: (value: boolean) => void;
    onFrontPhotoUrlChange: (value: string) => void;
    onBackPhotoUrlChange: (value: string) => void;
    onSidePhotoUrlChange: (value: string) => void;
}

export const AthleteDailyLogSection = ({
    calories,
    steps,
    weight,
    notes,
    workoutCompleted,
    frontPhotoUrl,
    backPhotoUrl,
    sidePhotoUrl,
    calorieProgress,
    stepProgress,
    dailyCompletion,
    isLogging,
    onSubmit,
    onCaloriesChange,
    onStepsChange,
    onWeightChange,
    onNotesChange,
    onWorkoutCompletedChange,
    onFrontPhotoUrlChange,
    onBackPhotoUrlChange,
    onSidePhotoUrlChange,
}: AthleteDailyLogSectionProps) => {
    return (
        <section className="surface" style={{ padding: 24 }}>
            <div className="card-stack">
                <div style={{ display: 'flex', alignItems: 'end', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <span className="section-label">Günlük kayıt</span>
                        <h2 style={{ marginTop: 8, fontSize: '1.7rem' }}>Bugünün verilerini ekle</h2>
                        <p className="caption" style={{ marginTop: 8 }}>
                            Günlük hedeflerinle uyumu tek formda takip et.
                        </p>
                    </div>

                    <div className="button-group">
                        <span className="chip chip--success">{Math.round(calorieProgress)}% kalori</span>
                        <span className="chip chip--success">{Math.round(stepProgress)}% adım</span>
                        <span className="chip">{Math.round(dailyCompletion)}% genel uyum</span>
                    </div>
                </div>

                <form onSubmit={onSubmit} className="card-stack" style={{ marginTop: 18 }}>
                    <div className="split-grid">
                        <div className="field">
                            <label className="field-label">Alınan kalori</label>
                            <input className="field-input" type="number" value={calories} onChange={e => onCaloriesChange(e.target.value)} required />
                        </div>
                        <div className="field">
                            <label className="field-label">Atılan adım</label>
                            <input className="field-input" type="number" value={steps} onChange={e => onStepsChange(e.target.value)} required />
                        </div>
                    </div>

                    <div className="field">
                        <label className="field-label">Güncel kilo (opsiyonel)</label>
                        <input className="field-input" type="number" step="0.1" value={weight} onChange={e => onWeightChange(e.target.value)} />
                    </div>

                    <label className="chip" style={{ justifyContent: 'flex-start' }}>
                        <input
                            type="checkbox"
                            checked={workoutCompleted}
                            onChange={e => onWorkoutCompletedChange(e.target.checked)}
                            style={{ width: 18, height: 18 }}
                        />
                        Antrenmanımı tamamladım
                    </label>

                    <div className="field">
                        <label className="field-label">Günün notu</label>
                        <textarea className="field-textarea" value={notes} onChange={e => onNotesChange(e.target.value)} />
                    </div>

                    {new Date().getDay() === 0 && (
                        <div className="timeline-card" style={{ padding: 18 }}>
                            <span className="section-label">Haftalık form</span>
                            <p style={{ marginTop: 8 }}>Pazar kontrolü için önden, arkadan ve yandan fotoğraf bağlantısı ekleyebilirsin.</p>
                            <div className="card-stack" style={{ marginTop: 14 }}>
                                <input className="field-input" type="url" placeholder="Ön fotoğraf URL" value={frontPhotoUrl} onChange={e => onFrontPhotoUrlChange(e.target.value)} />
                                <input className="field-input" type="url" placeholder="Arka fotoğraf URL" value={backPhotoUrl} onChange={e => onBackPhotoUrlChange(e.target.value)} />
                                <input className="field-input" type="url" placeholder="Yan fotoğraf URL" value={sidePhotoUrl} onChange={e => onSidePhotoUrlChange(e.target.value)} />
                            </div>
                        </div>
                    )}

                    <button type="submit" className="btn btn-primary" disabled={isLogging}>
                        {isLogging ? 'Kaydediliyor...' : 'Günlük veriyi kaydet'}
                    </button>
                </form>
            </div>
        </section>
    );
};
