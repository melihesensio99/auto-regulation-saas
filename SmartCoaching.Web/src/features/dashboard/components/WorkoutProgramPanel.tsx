import React, { useState, useEffect, useMemo } from 'react';
import { useWorkoutProgram, useAssignWorkout } from '../hooks/useDashboard';
import type { WorkoutExercise } from '../types';

interface WorkoutProgramPanelProps {
    athleteId: string;
}

export const WorkoutProgramPanel = ({ athleteId }: WorkoutProgramPanelProps) => {
    const { data: program, isLoading } = useWorkoutProgram(athleteId);
    const { mutateAsync: assignWorkout, isPending } = useAssignWorkout();

    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    useEffect(() => {
        if (program && program.days) {
            const flatExercises = program.days.flatMap(day => 
                day.exercises.map(ex => ({
                    dayName: day.dayName,
                    exerciseName: ex.exerciseName,
                    sets: ex.sets,
                    reps: ex.reps,
                    restTimeInSeconds: ex.restTimeInSeconds,
                    notes: ex.notes
                }))
            );
            setExercises(flatExercises);
        } else {
            setExercises([]);
        }
    }, [program]);

    const [dayName, setDayName] = useState('Pazartesi');
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState('12');
    const [restTime, setRestTime] = useState(60);

    const handleAddExercise = (e: React.FormEvent) => {
        e.preventDefault();
        const newExercise: WorkoutExercise = {
            dayName,
            exerciseName,
            sets,
            reps,
            restTimeInSeconds: restTime,
            notes: null
        };
        setExercises([...exercises, newExercise]);
        setExerciseName('');
    };

    const handleRemoveExercise = (index: number) => {
        const newEx = [...exercises];
        newEx.splice(index, 1);
        setExercises(newEx);
    };

    const handleSaveProgram = async () => {
        try {
            await assignWorkout({ athleteId, data: { exercises } });
            alert("✅ Program başarıyla kaydedildi!");
        } catch (err) {
            alert("❌ Program kaydedilirken bir hata oluştu.");
        }
    };

    const groupedExercises = useMemo(() => {
        const groups: Record<string, WorkoutExercise[]> = {};
        exercises.forEach(ex => {
            if (!groups[ex.dayName]) groups[ex.dayName] = [];
            groups[ex.dayName].push(ex);
        });
        return groups;
    }, [exercises]);

    if (isLoading) return (
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <p>Program yükleniyor...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
            {/* EGZERSİZ EKLEME FORMU */}
            <div className="glass-panel" style={{ padding: '20px' }}>
                <h4 style={{ marginTop: 0, marginBottom: '16px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    ➕ Yeni Egzersiz Ekle
                </h4>
                <form onSubmit={handleAddExercise} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group">
                        <label>Gün</label>
                        <select value={dayName} onChange={e => setDayName(e.target.value)} className="form-control" style={{ minWidth: '120px' }}>
                            <option value="Pazartesi">Pazartesi</option>
                            <option value="Salı">Salı</option>
                            <option value="Çarşamba">Çarşamba</option>
                            <option value="Perşembe">Perşembe</option>
                            <option value="Cuma">Cuma</option>
                            <option value="Cumartesi">Cumartesi</option>
                            <option value="Pazar">Pazar</option>
                        </select>
                    </div>
                    
                    <div className="form-group" style={{ flex: 1 }}>
                        <label>Egzersiz Adı</label>
                        <input required type="text" value={exerciseName} onChange={e => setExerciseName(e.target.value)} className="form-control" placeholder="Bench Press, Squat..." />
                    </div>

                    <div className="form-group" style={{ width: '75px' }}>
                        <label>Set</label>
                        <input required type="number" min="1" value={sets} onChange={e => setSets(parseInt(e.target.value))} className="form-control" />
                    </div>

                    <div className="form-group" style={{ width: '75px' }}>
                        <label>Tekrar</label>
                        <input required type="text" value={reps} onChange={e => setReps(e.target.value)} className="form-control" />
                    </div>

                    <div className="form-group" style={{ width: '90px' }}>
                        <label>Dinlenme</label>
                        <input required type="number" min="0" value={restTime} onChange={e => setRestTime(parseInt(e.target.value))} className="form-control" />
                    </div>

                    <button type="submit" style={{ 
                        padding: '10px 20px', 
                        background: 'rgba(255,255,255,0.08)', 
                        border: '1px solid var(--border-glass)',
                        color: 'var(--text-primary)',
                        fontWeight: 600
                    }}>
                        Ekle
                    </button>
                </form>
            </div>

            {/* MEVCUT PROGRAM */}
            <div className="glass-panel" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700 }}>Mevcut Program</h4>
                        {exercises.length > 0 && (
                            <span className="badge badge-info">{exercises.length} egzersiz</span>
                        )}
                    </div>
                    <button onClick={handleSaveProgram} disabled={isPending || exercises.length === 0} className="btn-save">
                        {isPending ? '⏳ Kaydediliyor...' : '💾 Tüm Programı Kaydet'}
                    </button>
                </div>

                {Object.keys(groupedExercises).length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state-icon">🏋️</span>
                        <p>Henüz hiç egzersiz eklenmemiş.</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Yukarıdaki formu kullanarak egzersiz ekleyin.</p>
                    </div>
                ) : (
                    Object.entries(groupedExercises).map(([day, dayExercises], idx) => (
                        <div key={day} className="day-card animate-fade-in" style={{ animationDelay: `${idx * 0.08}s` }}>
                            <h4>{day}</h4>
                            {dayExercises.map((ex, i) => (
                                <div key={i} className="exercise-row">
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <span style={{ 
                                            width: '28px', height: '28px', borderRadius: '8px', 
                                            background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent-primary)',
                                            flexShrink: 0
                                        }}>
                                            {i + 1}
                                        </span>
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ex.exerciseName}</span>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                                                <span className="badge badge-info">{ex.sets} Set</span>
                                                <span className="badge badge-info">{ex.reps} Tekrar</span>
                                                <span className="badge badge-info">{ex.restTimeInSeconds}s Dinlenme</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => {
                                            const flatIndex = exercises.findIndex(e => e.dayName === ex.dayName && e.exerciseName === ex.exerciseName);
                                            handleRemoveExercise(flatIndex);
                                        }}
                                        className="btn-delete"
                                    >
                                        ✕ Sil
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
