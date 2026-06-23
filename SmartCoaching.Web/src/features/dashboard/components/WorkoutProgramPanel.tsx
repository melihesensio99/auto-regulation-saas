import React, { useState, useEffect, useMemo } from 'react';
import { useWorkoutProgram, useAssignWorkout } from '../hooks/useDashboard';
import type { WorkoutExercise } from '../types';

interface WorkoutProgramPanelProps {
    athleteId: string;
}

export const WorkoutProgramPanel = ({ athleteId }: WorkoutProgramPanelProps) => {
    const { data: program, isLoading } = useWorkoutProgram(athleteId);
    const { mutateAsync: assignWorkout, isPending } = useAssignWorkout();

    // Düzleştirilmiş (Flat) egzersiz listesini tutan state
    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);

    // Backend'den veri geldiğinde state'i güncelle
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

    // Yeni egzersiz ekleme formu için state
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
        setExerciseName(''); // Formu temizle
    };

    const handleRemoveExercise = (index: number) => {
        const newEx = [...exercises];
        newEx.splice(index, 1);
        setExercises(newEx);
    };

    const handleSaveProgram = async () => {
        try {
            await assignWorkout({ athleteId, data: { exercises } });
            alert("Program başarıyla kaydedildi!");
        } catch (err) {
            alert("Program kaydedilirken bir hata oluştu.");
        }
    };

    // Egzersizleri günlere göre gruplayarak ekranda göstermek için
    const groupedExercises = useMemo(() => {
        const groups: Record<string, WorkoutExercise[]> = {};
        exercises.forEach(ex => {
            if (!groups[ex.dayName]) groups[ex.dayName] = [];
            groups[ex.dayName].push(ex);
        });
        return groups;
    }, [exercises]);

    if (isLoading) return <div>Program yükleniyor...</div>;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
            <div className="glass-panel" style={{ padding: '20px' }}>
                <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Yeni Egzersiz Ekle</h3>
                <form onSubmit={handleAddExercise} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        <label style={{ fontSize: '12px' }}>Gün</label>
                        <select value={dayName} onChange={e => setDayName(e.target.value)} style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '5px' }}>
                            <option value="Pazartesi">Pazartesi</option>
                            <option value="Salı">Salı</option>
                            <option value="Çarşamba">Çarşamba</option>
                            <option value="Perşembe">Perşembe</option>
                            <option value="Cuma">Cuma</option>
                            <option value="Cumartesi">Cumartesi</option>
                            <option value="Pazar">Pazar</option>
                        </select>
                    </div>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1 }}>
                        <label style={{ fontSize: '12px' }}>Egzersiz Adı</label>
                        <input required type="text" value={exerciseName} onChange={e => setExerciseName(e.target.value)} style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '5px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '70px' }}>
                        <label style={{ fontSize: '12px' }}>Set</label>
                        <input required type="number" min="1" value={sets} onChange={e => setSets(parseInt(e.target.value))} style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '5px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '70px' }}>
                        <label style={{ fontSize: '12px' }}>Tekrar</label>
                        <input required type="text" value={reps} onChange={e => setReps(e.target.value)} style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '5px' }} />
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', width: '90px' }}>
                        <label style={{ fontSize: '12px' }}>Dinlenme (sn)</label>
                        <input required type="number" min="0" value={restTime} onChange={e => setRestTime(parseInt(e.target.value))} style={{ padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border-glass)', color: 'white', borderRadius: '5px' }} />
                    </div>

                    <button type="submit" style={{ padding: '8px 16px', background: 'rgba(255,255,255,0.1)' }}>Ekle</button>
                </form>
            </div>

            <div className="glass-panel" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                    <h3 style={{ margin: 0 }}>Mevcut Program</h3>
                    <button onClick={handleSaveProgram} disabled={isPending} style={{ background: 'var(--primary)', color: 'black' }}>
                        {isPending ? 'Kaydediliyor...' : 'Tüm Programı Kaydet'}
                    </button>
                </div>

                {Object.keys(groupedExercises).length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Henüz hiç egzersiz eklenmemiş.</p>
                ) : (
                    Object.entries(groupedExercises).map(([day, dayExercises]) => (
                        <div key={day} style={{ marginBottom: '20px', background: 'rgba(0,0,0,0.2)', padding: '15px', borderRadius: '8px' }}>
                            <h4 style={{ margin: '0 0 10px 0', color: 'var(--primary)' }}>{day}</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {dayExercises.map((ex, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div>
                                            <span style={{ fontWeight: 'bold' }}>{ex.exerciseName}</span>
                                            <span style={{ color: 'var(--text-secondary)', marginLeft: '10px', fontSize: '14px' }}>
                                                {ex.sets} Set x {ex.reps} Tekrar | {ex.restTimeInSeconds} sn dinlenme
                                            </span>
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const flatIndex = exercises.findIndex(e => e.dayName === ex.dayName && e.exerciseName === ex.exerciseName);
                                                handleRemoveExercise(flatIndex);
                                            }}
                                            style={{ background: 'transparent', border: '1px solid var(--danger)', color: 'var(--danger)', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}
                                        >
                                            Sil
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
