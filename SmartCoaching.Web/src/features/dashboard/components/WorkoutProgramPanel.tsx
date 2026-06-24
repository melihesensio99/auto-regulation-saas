import React, { useState, useEffect, useMemo } from 'react';
import { useWorkoutProgram, useAssignWorkout } from '../hooks/useDashboard';
import type { WorkoutExercise } from '../types';

interface WorkoutProgramPanelProps {
    athleteId: string;
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

export const WorkoutProgramPanel = ({ athleteId }: WorkoutProgramPanelProps) => {
    const { data: program, isLoading } = useWorkoutProgram(athleteId);
    const { mutateAsync: assignWorkout, isPending } = useAssignWorkout();

    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [dayName, setDayName] = useState('Pazartesi');
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState('12');
    const [restTime, setRestTime] = useState(60);

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

    const resetForm = () => {
        setExerciseName('');
        setSets(3);
        setReps('12');
        setRestTime(60);
        setEditIndex(null);
    };

    const handleAddOrUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        const newEx: WorkoutExercise = { dayName, exerciseName, sets, reps, restTimeInSeconds: restTime, notes: null };
        if (editIndex !== null) {
            const updated = [...exercises];
            updated[editIndex] = newEx;
            setExercises(updated);
        } else {
            setExercises([...exercises, newEx]);
        }
        resetForm();
    };

    const handleAddOffDay = () => {
        const alreadyExists = exercises.some(ex => ex.dayName === dayName);
        if (alreadyExists) {
            alert(`${dayName} günü zaten tabloda mevcut.`);
            return;
        }
        setExercises([...exercises, {
            dayName,
            exerciseName: '__OFF_DAY__',
            sets: 1,
            reps: '1',
            restTimeInSeconds: 0,
            notes: null
        }]);
        resetForm();
    };

    const handleEdit = (flatIndex: number) => {
        const ex = exercises[flatIndex];
        setDayName(ex.dayName);
        setExerciseName(ex.exerciseName);
        setSets(ex.sets);
        setReps(ex.reps);
        setRestTime(ex.restTimeInSeconds);
        setEditIndex(flatIndex);
    };

    const handleRemove = (index: number) => {
        const updated = [...exercises];
        updated.splice(index, 1);
        setExercises(updated);
        if (editIndex === index) resetForm();
        else if (editIndex !== null && index < editIndex) setEditIndex(editIndex - 1);
    };

    const handleSave = async () => {
        try {
            await assignWorkout({ athleteId, data: { exercises } });
            alert('✅ Program başarıyla kaydedildi!');
        } catch {
            alert('❌ Program kaydedilirken bir hata oluştu.');
        }
    };

    const groupedByDay = useMemo(() => {
        const groups: Record<string, { ex: WorkoutExercise; flatIndex: number }[]> = {};
        exercises.forEach((ex, flatIndex) => {
            if (!groups[ex.dayName]) groups[ex.dayName] = [];
            groups[ex.dayName].push({ ex, flatIndex });
        });
        return groups;
    }, [exercises]);

    const maxRows = useMemo(() =>
        Math.max(0, ...DAYS.map(d => (groupedByDay[d] || []).length)),
        [groupedByDay]
    );

    // Only show days that have any entry (exercise or off day)
    const activeDays = DAYS.filter(d => (groupedByDay[d] || []).length > 0);

    if (isLoading) return (
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <p>Program yükleniyor...</p>
        </div>
    );

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', height: '100%' }}>

            {/* FORM */}
            <div className="glass-panel" style={{
                padding: '14px 18px',
                border: editIndex !== null ? '1px solid var(--accent-primary)' : '1px solid var(--border-glass)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '0.82rem', fontWeight: 700, color: editIndex !== null ? 'var(--accent-primary)' : 'var(--text-secondary)' }}>
                        {editIndex !== null ? '✏️ Egzersizi Düzenle' : '➕ Yeni Egzersiz Ekle'}
                    </span>
                    {editIndex !== null && (
                        <button onClick={resetForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                            İptal
                        </button>
                    )}
                </div>
                <form onSubmit={handleAddOrUpdate} style={{ display: 'flex', gap: '8px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.72rem' }}>Gün</label>
                        <select value={dayName} onChange={e => setDayName(e.target.value)} className="form-control" style={{ minWidth: '120px' }}>
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div className="form-group" style={{ flex: 1, minWidth: '150px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.72rem' }}>Hareket</label>
                        <input required type="text" value={exerciseName} onChange={e => setExerciseName(e.target.value)} className="form-control" placeholder="Bench Press, Squat..." />
                    </div>
                    <div className="form-group" style={{ width: '64px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.72rem' }}>Set</label>
                        <input required type="number" min="1" value={sets} onChange={e => setSets(parseInt(e.target.value))} className="form-control" />
                    </div>
                    <div className="form-group" style={{ width: '75px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.72rem' }}>Tekrar</label>
                        <input required type="text" value={reps} onChange={e => setReps(e.target.value)} className="form-control" placeholder="8-12" />
                    </div>
                    <div className="form-group" style={{ width: '75px', marginBottom: 0 }}>
                        <label style={{ fontSize: '0.72rem' }}>Dinlenme</label>
                        <input required type="number" min="0" value={restTime} onChange={e => setRestTime(parseInt(e.target.value))} className="form-control" />
                    </div>
                    <button type="submit" style={{
                        padding: '9px 18px', background: editIndex !== null ? 'var(--accent-primary)' : 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.12)', color: 'white', fontWeight: 600,
                        borderRadius: '8px', cursor: 'pointer', whiteSpace: 'nowrap', fontSize: '0.85rem'
                    }}>
                        {editIndex !== null ? 'Güncelle' : 'Ekle'}
                    </button>
                    {editIndex !== null && (
                        <button type="button" onClick={() => handleRemove(editIndex)} style={{
                            padding: '9px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            fontWeight: 600,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem'
                        }}>Sil 🗑️</button>
                    )}
                    {editIndex === null && (
                        <button type="button" onClick={handleAddOffDay} style={{
                            padding: '9px 14px',
                            background: 'rgba(239,68,68,0.1)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            fontWeight: 600,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem'
                        }}>🛑 Off Day</button>
                    )}
                </form>
            </div>

            {/* TABLE */}
            <div className="glass-panel" style={{ padding: '16px 18px', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Mevcut Program</span>
                        {exercises.length > 0 && (
                            <span className="badge badge-info">{exercises.filter(e => e.exerciseName !== '__OFF_DAY__').length} egzersiz</span>
                        )}
                    </div>
                    <button onClick={handleSave} disabled={isPending} className="btn-save">
                        {isPending ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
                    </button>
                </div>

                {exercises.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state-icon">🏋️</span>
                        <p>Henüz hiç egzersiz eklenmemiş.</p>
                    </div>
                ) : (
                    <div style={{ overflowY: 'auto', flex: 1 }}>
                        {/* Her gün 1 sütun — genişlik eşit bölüşülür, scroll yok */}
                        <table style={{
                            borderCollapse: 'collapse',
                            width: '100%',
                            tableLayout: 'fixed',
                        }}>
                            <colgroup>
                                {activeDays.map(day => (
                                    <React.Fragment key={day}>
                                        <col style={{ width: `${(100 / activeDays.length) * 0.65}%` }} />
                                        <col style={{ width: `${(100 / activeDays.length) * 0.35}%` }} />
                                    </React.Fragment>
                                ))}
                            </colgroup>
                            <thead>
                                {/* Gün başlıkları */}
                                <tr>
                                    {activeDays.map(day => (
                                        <th key={day} colSpan={2} style={{
                                            background: 'rgba(255,255,255,0.1)',
                                            color: '#ffffff',
                                            fontWeight: 800,
                                            fontSize: '1rem',
                                            padding: '12px 14px',
                                            textAlign: 'center',
                                            borderBottom: '2px solid rgba(99,102,241,0.6)',
                                            borderRight: '1px solid rgba(255,255,255,0.25)',
                                            letterSpacing: '1px',
                                            textTransform: 'uppercase',
                                        }}>
                                            {day}
                                        </th>
                                    ))}
                                </tr>
                                {/* Alt başlık */}
                                <tr>
                                    {activeDays.map(day => (
                                        <React.Fragment key={day}>
                                            <th style={{
                                                background: 'rgba(99,102,241,0.2)',
                                                color: 'rgba(255,255,255,0.75)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                padding: '6px 14px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                borderRight: '1px solid rgba(255,255,255,0.15)',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                            }}>Hareket</th>
                                            <th style={{
                                                background: 'rgba(99,102,241,0.2)',
                                                color: 'rgba(255,255,255,0.75)',
                                                fontSize: '0.75rem',
                                                fontWeight: 700,
                                                padding: '6px 14px',
                                                textAlign: 'left',
                                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                                borderRight: '1px solid rgba(255,255,255,0.25)',
                                                letterSpacing: '0.5px',
                                                textTransform: 'uppercase',
                                            }}>Set</th>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {Array.from({ length: Math.max(maxRows, 1) }).map((_, rowIdx) => (
                                    <tr key={rowIdx} style={{
                                        background: rowIdx % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.022)',
                                    }}>
                                        {activeDays.map(day => {
                                            const item = (groupedByDay[day] || [])[rowIdx];
                                            const isOffDay = item?.ex.exerciseName === '__OFF_DAY__';
                                            return (
                                            <React.Fragment key={day}>
                                                    {/* Hareket Sütunu */}
                                                    <td
                                                        onClick={() => item && !isOffDay && handleEdit(item.flatIndex)}
                                                        style={{
                                                            padding: '12px 14px',
                                                            borderBottom: '1px solid rgba(255,255,255,0.07)',
                                                            borderRight: '1px solid rgba(255,255,255,0.15)',
                                                            verticalAlign: 'middle',
                                                            cursor: item && !isOffDay ? 'pointer' : 'default',
                                                            overflow: 'hidden',
                                                        }}
                                                        title={item && !isOffDay ? 'Düzenlemek için tıkla' : ''}
                                                    >
                                                        {item && (
                                                            <div style={{
                                                                fontSize: '0.95rem',
                                                                color: isOffDay ? '#f87171' : '#f1f5f9',
                                                                fontWeight: isOffDay ? 700 : 500,
                                                                lineHeight: 1.4,
                                                                whiteSpace: 'nowrap',
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}>
                                                                {isOffDay ? '🛑 Off Day' : item.ex.exerciseName}
                                                            </div>
                                                        )}
                                                    </td>
                                                    {/* Set Sütunu */}
                                                    <td style={{
                                                        padding: '12px 14px',
                                                        borderBottom: '1px solid rgba(255,255,255,0.07)',
                                                        borderRight: '1px solid rgba(255,255,255,0.25)',
                                                        verticalAlign: 'middle',
                                                        overflow: 'hidden',
                                                    }}>
                                                        {item && (
                                                            <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                                                                <span style={{
                                                                    fontSize: '0.9rem',
                                                                    color: '#94a3b8',
                                                                    fontWeight: 500,
                                                                    whiteSpace: 'nowrap',
                                                                }}>
                                                                    {!isOffDay ? `${item.ex.sets}×${item.ex.reps}` : ''}
                                                                </span>
                                                            </div>
                                                        )}
                                                    </td>
                                                </React.Fragment>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};
