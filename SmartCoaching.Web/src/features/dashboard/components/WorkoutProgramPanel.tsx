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
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

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
    const [dayLabel, setDayLabel] = useState('');
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState('12');
    const [restTime, setRestTime] = useState(60);

    const resetForm = () => {
        setExerciseName('');
        setSets(3);
        setReps('12');
        setRestTime(60);
        setDayLabel('');
        setEditIndex(null);
    };

    const handleAddOrUpdateExercise = (e: React.FormEvent) => {
        e.preventDefault();
        const combinedDay = dayLabel.trim() ? `${dayName} - ${dayLabel.trim()}` : dayName;
        const newExercise: WorkoutExercise = {
            dayName: combinedDay,
            exerciseName,
            sets,
            reps,
            restTimeInSeconds: restTime,
            notes: null
        };

        if (editIndex !== null) {
            const newEx = [...exercises];
            newEx[editIndex] = newExercise;
            setExercises(newEx);
        } else {
            setExercises([...exercises, newExercise]);
        }
        resetForm();
    };

    const handleEditExercise = (flatIndex: number) => {
        const ex = exercises[flatIndex];
        // Parse "Pazartesi - Push Day" back into day + label
        const dashIdx = ex.dayName.indexOf(' - ');
        if (dashIdx !== -1) {
            setDayName(ex.dayName.substring(0, dashIdx));
            setDayLabel(ex.dayName.substring(dashIdx + 3));
        } else {
            setDayName(ex.dayName);
            setDayLabel('');
        }
        setExerciseName(ex.exerciseName);
        setSets(ex.sets);
        setReps(ex.reps);
        setRestTime(ex.restTimeInSeconds);
        setEditIndex(flatIndex);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sürükle-bırak (Drag & Drop) işlemleri satırın (div) üzerinde inline olarak yönetilmektedir.

    const handleRemoveExercise = (index: number) => {
        const newEx = [...exercises];
        newEx.splice(index, 1);
        setExercises(newEx);
        // If deleting the currently edited exercise, reset form
        if (editIndex === index) {
            resetForm();
        } else if (editIndex !== null && index < editIndex) {
            // Adjust edit index if we deleted an item before it
            setEditIndex(editIndex - 1);
        }
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
            <div className="glass-panel" style={{ padding: '20px', border: editIndex !== null ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 700, color: editIndex !== null ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {editIndex !== null ? '✏️ Egzersizi Düzenle' : '➕ Yeni Egzersiz Ekle'}
                    </h4>
                    {editIndex !== null && (
                        <button onClick={resetForm} style={{ background: 'transparent', color: 'var(--text-muted)', fontSize: '0.8rem', padding: '4px 8px' }}>
                            İptal Et
                        </button>
                    )}
                </div>
                <form onSubmit={handleAddOrUpdateExercise} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    {/* GÜN SELECT */}
                    <div className="form-group">
                        <label>Gün</label>
                        <select value={dayName} onChange={e => setDayName(e.target.value)} className="form-control" style={{ minWidth: '130px' }}>
                            <option value="Pazartesi">Pazartesi</option>
                            <option value="Salı">Salı</option>
                            <option value="Çarşamba">Çarşamba</option>
                            <option value="Perşembe">Perşembe</option>
                            <option value="Cuma">Cuma</option>
                            <option value="Cumartesi">Cumartesi</option>
                            <option value="Pazar">Pazar</option>
                        </select>
                    </div>

                    {/* PROGRAM ETİKETİ (isteğe bağlı) */}
                    <div className="form-group" style={{ width: '140px' }}>
                        <label>Program Adı <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(isteğe bağlı)</span></label>
                        <input
                            type="text"
                            value={dayLabel}
                            onChange={e => setDayLabel(e.target.value)}
                            className="form-control"
                            placeholder="Push Day..."
                        />
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
                        background: editIndex !== null ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)', 
                        border: editIndex !== null ? 'none' : '1px solid var(--border-glass)',
                        color: 'white',
                        fontWeight: 600
                    }}>
                        {editIndex !== null ? 'Güncelle' : 'Ekle'}
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
                    <button onClick={handleSaveProgram} disabled={isPending} className="btn-save">
                        {isPending ? '⏳ Kaydediliyor...' : '💾 Değişiklikleri Kaydet'}
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
                            {dayExercises.map((ex, i) => {
                                const flatIndex = exercises.findIndex(e => e.dayName === ex.dayName && e.exerciseName === ex.exerciseName);
                                return (
                                <div 
                                    key={i} 
                                    className="exercise-row"
                                    draggable
                                    onDragStart={(e) => {
                                        setDraggedIndex(flatIndex);
                                        e.dataTransfer.setData('text/plain', flatIndex.toString());
                                    }}
                                    onDragOver={(e) => {
                                        e.preventDefault();
                                        e.dataTransfer.dropEffect = 'move';
                                    }}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        if (draggedIndex === null || draggedIndex === flatIndex) return;

                                        const newEx = [...exercises];
                                        const draggedItem = {...newEx[draggedIndex]};
                                        draggedItem.dayName = ex.dayName; // Günü değiştiyse güncelle

                                        newEx.splice(draggedIndex, 1);
                                        newEx.splice(flatIndex, 0, draggedItem);
                                        
                                        setExercises(newEx);
                                        setDraggedIndex(null);
                                    }}
                                    onDragEnd={() => setDraggedIndex(null)}
                                    style={{ 
                                        opacity: draggedIndex === flatIndex ? 0.4 : 1,
                                        cursor: 'grab',
                                        border: draggedIndex === flatIndex ? '1px dashed var(--accent-primary)' : ''
                                    }}
                                >
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{ex.exerciseName}</span>
                                            <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                                                <span className="badge badge-info">{ex.sets} Set</span>
                                                <span className="badge badge-info">{ex.reps} Tekrar</span>
                                                <span className="badge badge-info">{ex.restTimeInSeconds}s Dinlenme</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button 
                                            onClick={() => handleEditExercise(flatIndex)}
                                            className="btn-delete"
                                            style={{ color: 'var(--text-primary)', borderColor: 'var(--border-glass)', padding: '6px 8px', fontSize: '1.1rem' }}
                                            title="Düzenle"
                                        >
                                            ✏️
                                        </button>
                                        <button 
                                            onClick={() => handleRemoveExercise(flatIndex)}
                                            className="btn-delete"
                                            style={{ padding: '6px 8px', fontSize: '1.1rem' }}
                                            title="Sil"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                                );
                            })}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
