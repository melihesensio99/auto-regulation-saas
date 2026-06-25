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
    const [modalDay, setModalDay] = useState<string | null>(null);

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

    // Exercise icons based on name
    const getExerciseIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('squat') || n.includes('leg') || n.includes('bacak')) return '🦵';
        if (n.includes('bench') || n.includes('press') || n.includes('göğüs')) return '💪';
        if (n.includes('curl') || n.includes('bicep')) return '💪';
        if (n.includes('deadlift') || n.includes('sırt')) return '🏋️';
        if (n.includes('shoulder') || n.includes('omuz')) return '🤸';
        if (n.includes('tricep') || n.includes('pushdown')) return '💪';
        if (n.includes('calf') || n.includes('baldır')) return '🦶';
        if (n.includes('cable') || n.includes('pull')) return '🔗';
        return '🏋️';
    };

    if (isLoading) return (
        <div className="glass-panel" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <p>Program yükleniyor...</p>
        </div>
    );

    const inputStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        color: 'white',
        padding: '10px 12px',
        fontSize: '0.85rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box' as const,
    };

    const labelStyle: React.CSSProperties = {
        fontSize: '0.7rem',
        fontWeight: 600,
        color: 'rgba(255,255,255,0.5)',
        textTransform: 'uppercase' as const,
        letterSpacing: '0.5px',
        marginBottom: '4px',
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

            {/* ADD EXERCISE FORM */}
            <div className="glass-panel" style={{
                padding: '16px 20px',
                border: editIndex !== null ? '1px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.08)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.85rem', fontWeight: 700, color: editIndex !== null ? 'var(--accent-primary)' : 'rgba(255,255,255,0.9)' }}>
                        {editIndex !== null ? '✏️ Egzersizi Düzenle' : '+ Yeni Egzersiz Ekle'}
                    </span>
                    {editIndex !== null && (
                        <button onClick={resetForm} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '0.78rem', cursor: 'pointer' }}>
                            İptal
                        </button>
                    )}
                </div>
                <form onSubmit={handleAddOrUpdate} style={{ display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '110px' }}>
                        <div style={labelStyle}>GÜN</div>
                        <select value={dayName} onChange={e => setDayName(e.target.value)} style={{ ...inputStyle, cursor: 'pointer' }}>
                            {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                    <div style={{ minWidth: '180px', maxWidth: '300px', flex: '0 1 300px' }}>
                        <div style={labelStyle}>HAREKET</div>
                        <input required type="text" value={exerciseName} onChange={e => setExerciseName(e.target.value)} style={inputStyle} placeholder="Bench Press, Squat..." />
                    </div>
                    <div style={{ width: '65px' }}>
                        <div style={labelStyle}>SET</div>
                        <input required type="number" min="1" value={sets} onChange={e => setSets(parseInt(e.target.value))} style={{ ...inputStyle, textAlign: 'center' }} />
                    </div>
                    <div style={{ width: '75px' }}>
                        <div style={labelStyle}>TEKRAR</div>
                        <input required type="text" value={reps} onChange={e => setReps(e.target.value)} style={{ ...inputStyle, textAlign: 'center' }} placeholder="8-12" />
                    </div>
                    <div style={{ width: '80px' }}>
                        <div style={labelStyle}>DİNLENME</div>
                        <input required type="number" min="0" value={restTime} onChange={e => setRestTime(parseInt(e.target.value))} style={{ ...inputStyle, textAlign: 'center' }} />
                    </div>
                    <button type="submit" style={{
                        padding: '10px 20px',
                        background: editIndex !== null ? 'var(--accent-primary)' : 'rgba(99,102,241,0.8)',
                        border: 'none',
                        color: 'white',
                        fontWeight: 600,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        fontSize: '0.85rem',
                        height: '40px',
                    }}>
                        {editIndex !== null ? 'Güncelle' : 'Ekle'}
                    </button>
                    {editIndex !== null && (
                        <button type="button" onClick={() => handleRemove(editIndex)} style={{
                            padding: '10px 16px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            fontWeight: 600,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>🗑️ Sil</button>
                    )}
                    {editIndex === null && (
                        <button type="button" onClick={handleAddOffDay} style={{
                            padding: '10px 16px',
                            background: 'rgba(239,68,68,0.15)',
                            border: '1px solid rgba(239,68,68,0.3)',
                            color: '#f87171',
                            fontWeight: 600,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                            fontSize: '0.85rem',
                            height: '40px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                        }}>🔴 Off Day</button>
                    )}
                </form>
            </div>

            {/* PROGRAM HEADER */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 4px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fff' }}>Mevcut Program</span>
                    {exercises.length > 0 && (
                        <span style={{
                            fontSize: '0.75rem',
                            color: 'var(--primary-color)',
                            background: 'rgba(99,102,241,0.15)',
                            padding: '3px 10px',
                            borderRadius: '12px',
                            fontWeight: 600,
                        }}>{exercises.filter(e => e.exerciseName !== '__OFF_DAY__').length} Egzersiz</span>
                    )}
                </div>
                <button onClick={handleSave} disabled={isPending} style={{
                    padding: '8px 20px',
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none',
                    color: '#fff',
                    fontWeight: 700,
                    borderRadius: '8px',
                    cursor: isPending ? 'not-allowed' : 'pointer',
                    fontSize: '0.85rem',
                    opacity: isPending ? 0.7 : 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                }}>
                    {isPending ? '⏳ Kaydediliyor...' : '💾 Kaydet'}
                </button>
            </div>

            {/* DAY CARDS GRID */}
            {exercises.length === 0 ? (
                <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 20px', flex: 1 }}>
                    <div style={{ fontSize: '3rem', marginBottom: '16px', opacity: 0.4 }}>🏋️</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Henüz hiç egzersiz eklenmemiş.</p>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Yukarıdaki formu kullanarak egzersiz ekleyin.</p>
                </div>
            ) : (
                <div>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(4, minmax(220px, 1fr))',
                        gap: '16px',
                        paddingBottom: '8px',
                    }}>
                        {DAYS.filter(d => (groupedByDay[d] || []).length > 0).map(day => {
                            const dayExercises = groupedByDay[day] || [];
                            const isOffDay = dayExercises.length === 1 && dayExercises[0].ex.exerciseName === '__OFF_DAY__';
                            const exerciseCount = dayExercises.filter(e => e.ex.exerciseName !== '__OFF_DAY__').length;

                            return (
                                <div key={day} style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    height: '100%',
                                }}>
                                    {/* Off Day Card */}
                                    {isOffDay ? (
                                        <div className="glass-panel" style={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: 0,
                                            border: '1px solid rgba(16, 185, 129, 0.3)',
                                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.05), rgba(6, 95, 70, 0.08))',
                                            height: '100%',
                                            position: 'relative',
                                        }}>
                                            {/* Off Day Header Inside Card */}
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'rgba(16, 185, 129, 0.12)',
                                                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}>
                                                <h3 style={{
                                                    margin: 0,
                                                    fontSize: '1rem',
                                                    fontWeight: 800,
                                                    color: '#10b981',
                                                }}>{day}</h3>
                                            </div>

                                            {/* Off Day Row */}
                                            <div style={{
                                                padding: '14px 16px',
                                                display: 'flex',
                                                gap: '12px',
                                                alignItems: 'center',
                                                flex: 1,
                                            }}>
                                                <div style={{
                                                    width: '38px',
                                                    height: '38px',
                                                    borderRadius: '10px',
                                                    background: 'rgba(16, 185, 129, 0.15)',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '1.2rem',
                                                    flexShrink: 0,
                                                }}>😴</div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{
                                                        fontSize: '0.95rem',
                                                        fontWeight: 800,
                                                        color: '#10b981',
                                                        letterSpacing: '1px',
                                                    }}>
                                                        DİNLENME GÜNÜ
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => handleRemove(dayExercises[0].flatIndex)}
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    background: 'rgba(239,68,68,0.15)',
                                                    border: 'none',
                                                    color: '#f87171',
                                                    width: '26px',
                                                    height: '26px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.75rem',
                                                }}
                                            >🗑️</button>
                                        </div>
                                    ) : (
                                        /* Single unified card with header inside */
                                        <div className="glass-panel" style={{
                                            borderRadius: '12px',
                                            overflow: 'hidden',
                                            display: 'flex',
                                            flexDirection: 'column',
                                            padding: 0,
                                            border: '1px solid rgba(99, 102, 241, 0.25)',
                                            height: '100%',
                                        }}>
                                            {/* Day Header Inside Card */}
                                            <div style={{
                                                padding: '12px 16px',
                                                background: 'rgba(99, 102, 241, 0.12)',
                                                borderBottom: '1px solid rgba(99,102,241,0.2)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '8px',
                                            }}>
                                                <h3 style={{
                                                    margin: 0,
                                                    fontSize: '1rem',
                                                    fontWeight: 800,
                                                    color: '#fff',
                                                }}>{day}</h3>
                                                <span style={{
                                                    fontSize: '0.85rem',
                                                    color: 'rgba(255,255,255,0.5)',
                                                    fontWeight: 500,
                                                }}>| {exerciseCount} Egzersiz</span>
                                            </div>
                                            {/* Exercises List (Max 2) */}
                                            {dayExercises.slice(0, 2).map(({ ex, flatIndex }, exIdx, arr) => (
                                                <div
                                                    key={flatIndex}
                                                    style={{
                                                        padding: '14px 16px',
                                                        cursor: 'pointer',
                                                        transition: 'background 0.15s ease',
                                                        display: 'flex',
                                                        gap: '12px',
                                                        alignItems: 'flex-start',
                                                        borderBottom: (exIdx < arr.length - 1 || dayExercises.length > 2) ? '1px solid rgba(255,255,255,0.06)' : 'none',
                                                    }}
                                                    onClick={() => handleEdit(flatIndex)}
                                                    onMouseEnter={e => {
                                                        (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)';
                                                    }}
                                                    onMouseLeave={e => {
                                                        (e.currentTarget as HTMLDivElement).style.background = '';
                                                    }}
                                                >
                                                    {/* Exercise Icon */}
                                                    <div style={{
                                                        width: '38px',
                                                        height: '38px',
                                                        borderRadius: '10px',
                                                        background: 'rgba(99,102,241,0.15)',
                                                        display: 'flex',
                                                        alignItems: 'center',
                                                        justifyContent: 'center',
                                                        fontSize: '1.1rem',
                                                        flexShrink: 0,
                                                    }}>
                                                        {getExerciseIcon(ex.exerciseName)}
                                                    </div>

                                                    {/* Exercise Info */}
                                                    <div style={{ flex: 1, minWidth: 0 }}>
                                                        <div style={{
                                                            fontSize: '0.95rem',
                                                            fontWeight: 600,
                                                            color: '#fff',
                                                            marginBottom: '5px',
                                                        }}>
                                                            {ex.exerciseName}
                                                        </div>
                                                        <div style={{
                                                            display: 'flex',
                                                            flexWrap: 'wrap',
                                                            gap: '10px',
                                                            fontSize: '0.8rem',
                                                            color: 'rgba(255,255,255,0.5)',
                                                        }}>
                                                            <span>🏋️ {ex.sets} Sets x {ex.reps} Reps</span>
                                                            <span>⏱ Dinlenme: {ex.restTimeInSeconds}s</span>
                                                        </div>
                                                    </div>


                                                </div>
                                            ))}

                                            {/* Expand/Collapse Button */}
                                            {dayExercises.length > 2 && (
                                                <div 
                                                    onClick={() => setModalDay(day)}
                                                    style={{
                                                        padding: '12px 16px',
                                                        textAlign: 'center',
                                                        cursor: 'pointer',
                                                        background: 'rgba(99, 102, 241, 0.08)',
                                                        color: '#818cf8',
                                                        fontSize: '0.85rem',
                                                        fontWeight: 700,
                                                        transition: 'background 0.2s',
                                                    }}
                                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.15)')}
                                                    onMouseLeave={e => (e.currentTarget.style.background = 'rgba(99, 102, 241, 0.08)')}
                                                >
                                                    Hepsini Görmek İçin Tıkla (+{dayExercises.length - 2})
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Modal for All Exercises */}
            {modalDay && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(5px)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px',
                }} onClick={() => setModalDay(null)}>
                    <div 
                        className="glass-panel animate-fade-in" 
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            maxHeight: '80vh',
                            display: 'flex',
                            flexDirection: 'column',
                            borderRadius: '16px',
                            border: '1px solid rgba(99, 102, 241, 0.3)',
                            background: 'linear-gradient(145deg, rgba(30,30,40,0.9), rgba(20,20,30,0.95))',
                            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                            overflow: 'hidden',
                        }}
                        onClick={e => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{
                            padding: '16px 24px',
                            background: 'rgba(99, 102, 241, 0.15)',
                            borderBottom: '1px solid rgba(99,102,241,0.2)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#fff' }}>
                                {modalDay} <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.6)', fontWeight: 500 }}>| Tüm Egzersizler</span>
                            </h2>
                            <button 
                                onClick={() => setModalDay(null)}
                                style={{
                                    background: 'transparent',
                                    border: 'none',
                                    color: 'rgba(255,255,255,0.6)',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '0',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    transition: 'background 0.2s',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = '#fff';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = 'rgba(255,255,255,0.6)';
                                }}
                            >×</button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ overflowY: 'auto', padding: '8px 0' }}>
                            {groupedByDay[modalDay]?.map(({ ex, flatIndex }, exIdx) => (
                                <div
                                    key={flatIndex}
                                    style={{
                                        padding: '16px 24px',
                                        cursor: 'pointer',
                                        transition: 'background 0.15s ease',
                                        display: 'flex',
                                        gap: '16px',
                                        alignItems: 'center',
                                        borderBottom: exIdx < groupedByDay[modalDay].length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                                    }}
                                    onClick={() => {
                                        setModalDay(null);
                                        handleEdit(flatIndex);
                                    }}
                                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
                                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                                >
                                    <div style={{
                                        width: '46px',
                                        height: '46px',
                                        borderRadius: '12px',
                                        background: 'rgba(99,102,241,0.2)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '1.4rem',
                                        flexShrink: 0,
                                    }}>
                                        {getExerciseIcon(ex.exerciseName)}
                                    </div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{
                                            fontSize: '1.05rem',
                                            fontWeight: 700,
                                            color: '#fff',
                                            marginBottom: '6px',
                                        }}>
                                            {ex.exerciseName}
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            flexWrap: 'wrap',
                                            gap: '12px',
                                            fontSize: '0.85rem',
                                            color: 'rgba(255,255,255,0.6)',
                                        }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>🏋️ {ex.sets} Sets x {ex.reps} Reps</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>⏱ {ex.restTimeInSeconds}s Dinlenme</span>
                                        </div>
                                    </div>
                                    <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>›</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
