import { useEffect, useMemo, useState } from 'react';
import { useAssignWorkout, useWorkoutProgram } from '../hooks/useDashboard';
import type { WorkoutExercise } from '../types';

interface WorkoutProgramPanelProps {
    athleteId: string;
}

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];
const OFF_DAY_MARKER = '__OFF_DAY__';

export const WorkoutProgramPanel = ({ athleteId }: WorkoutProgramPanelProps) => {
    const { data: program, isLoading } = useWorkoutProgram(athleteId);
    const { mutateAsync: assignWorkout, isPending } = useAssignWorkout();

    const [exercises, setExercises] = useState<WorkoutExercise[]>([]);
    const [editIndex, setEditIndex] = useState<number | null>(null);
    const [dayName, setDayName] = useState(DAYS[0]);
    const [exerciseName, setExerciseName] = useState('');
    const [sets, setSets] = useState(3);
    const [reps, setReps] = useState('8-12');
    const [restTime, setRestTime] = useState(60);
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (!program?.days) {
            setExercises([]);
            return;
        }

        const flatExercises = program.days.flatMap(day =>
            day.exercises.map(ex => ({
                dayName: day.dayName,
                exerciseName: ex.exerciseName,
                sets: ex.sets,
                reps: ex.reps,
                restTimeInSeconds: ex.restTimeInSeconds,
                notes: ex.notes ?? null
            }))
        );

        setExercises(flatExercises);
    }, [program]);

    const groupedByDay = useMemo(() => {
        const groups: Record<string, { ex: WorkoutExercise; flatIndex: number }[]> = {};

        exercises.forEach((ex, flatIndex) => {
            if (!groups[ex.dayName]) {
                groups[ex.dayName] = [];
            }
            groups[ex.dayName].push({ ex, flatIndex });
        });

        return groups;
    }, [exercises]);

    const stats = useMemo(() => {
        const activeExercises = exercises.filter(ex => ex.exerciseName !== OFF_DAY_MARKER);
        const activeDays = DAYS.filter(day => (groupedByDay[day] ?? []).some(x => x.ex.exerciseName !== OFF_DAY_MARKER));
        const restDays = DAYS.filter(day => groupedByDay[day]?.some(x => x.ex.exerciseName === OFF_DAY_MARKER));

        return {
            totalExercises: activeExercises.length,
            activeDays: activeDays.length,
            restDays: restDays.length,
        };
    }, [exercises, groupedByDay]);

    const resetForm = () => {
        setExerciseName('');
        setSets(3);
        setReps('8-12');
        setRestTime(60);
        setNotes('');
        setEditIndex(null);
        setDayName(DAYS[0]);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const trimmedExerciseName = exerciseName.trim();
        const trimmedReps = reps.trim();
        const trimmedNotes = notes.trim();

        if (!trimmedExerciseName) {
            alert('Egzersiz adı boş olamaz.');
            return;
        }

        const nextExercise: WorkoutExercise = {
            dayName,
            exerciseName: trimmedExerciseName,
            sets,
            reps: trimmedReps,
            restTimeInSeconds: restTime,
            notes: trimmedNotes ? trimmedNotes : null,
        };

        if (editIndex !== null) {
            const updated = [...exercises];
            updated[editIndex] = nextExercise;
            setExercises(updated);
        } else {
            setExercises([...exercises, nextExercise]);
        }

        resetForm();
    };

    const handleAddOffDay = () => {
        if ((groupedByDay[dayName] ?? []).length > 0) {
            alert(`${dayName} zaten dolu. Önce o günü temizle.`);
            return;
        }

        setExercises([
            ...exercises,
            {
                dayName,
                exerciseName: OFF_DAY_MARKER,
                sets: 0,
                reps: '-',
                restTimeInSeconds: 0,
                notes: null,
            },
        ]);
        resetForm();
    };

    const handleEdit = (flatIndex: number) => {
        const selected = exercises[flatIndex];
        setDayName(selected.dayName);
        setExerciseName(selected.exerciseName);
        setSets(selected.sets);
        setReps(selected.reps);
        setRestTime(selected.restTimeInSeconds);
        setNotes(selected.notes ?? '');
        setEditIndex(flatIndex);
    };

    const handleRemove = (index: number) => {
        const updated = [...exercises];
        updated.splice(index, 1);
        setExercises(updated);

        if (editIndex === index) {
            resetForm();
            return;
        }

        if (editIndex !== null && index < editIndex) {
            setEditIndex(editIndex - 1);
        }
    };

    const handleSave = async () => {
        try {
            const exercisesToSave = exercises
                .map(exercise => ({
                    ...exercise,
                    dayName: exercise.dayName.trim(),
                    exerciseName: exercise.exerciseName.trim(),
                    reps: exercise.reps.trim(),
                    notes: exercise.notes?.trim() ? exercise.notes.trim() : null,
                }))
                .filter(exercise => exercise.dayName.length > 0 && exercise.exerciseName.length > 0 && exercise.reps.length > 0);

            if (!exercisesToSave.length) {
                alert('En az bir egzersiz girmen gerekiyor.');
                return;
            }

            await assignWorkout({ athleteId, data: { exercises: exercisesToSave } });
            alert('Program kaydedildi.');
        } catch {
            alert('Program kaydedilirken bir hata oluştu.');
        }
    };

    const getExerciseIcon = (name: string) => {
        const n = name.toLowerCase();
        if (n.includes('squat') || n.includes('leg') || n.includes('bacak')) return '🦵';
        if (n.includes('bench') || n.includes('press') || n.includes('göğüs')) return '💪';
        if (n.includes('deadlift') || n.includes('sırt')) return '🏋️';
        if (n.includes('shoulder') || n.includes('omuz')) return '🤸';
        if (n.includes('pull') || n.includes('row')) return '🔗';
        if (n.includes('curl') || n.includes('bicep')) return '💪';
        return '🏋️';
    };

    if (isLoading) {
        return (
            <div className="surface" style={{ padding: 24, minHeight: 240, display: 'grid', placeItems: 'center' }}>
                <div className="empty-state">
                    <div className="loader" />
                    <p>Workout programı yükleniyor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card-stack" style={{ gap: 16 }}>
            <div className="surface" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <span className="section-label">Antrenman özeti</span>
                        <h3 style={{ marginTop: 8 }}>Programı yönet</h3>
                    </div>
                    <div className="pill-group">
                        <span className="chip">{stats.activeDays} aktif gün</span>
                        <span className="chip">{stats.totalExercises} egzersiz</span>
                        <span className="chip">{stats.restDays} dinlenme günü</span>
                    </div>
                </div>
            </div>

            <div className="surface" style={{ padding: 20 }}>
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '160px 1.6fr 90px 120px 90px', gap: 12, alignItems: 'end' }}>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="caption">Gün</span>
                            <select className="field-input" value={dayName} onChange={e => setDayName(e.target.value)}>
                                {DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                            </select>
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="caption">Hareket</span>
                            <input
                                className="field-input"
                                required
                                value={exerciseName}
                                onChange={e => setExerciseName(e.target.value)}
                                placeholder="Bench Press, Squat..."
                            />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="caption">Set</span>
                            <input className="field-input" type="number" min="1" value={sets} onChange={e => setSets(Number(e.target.value))} />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="caption">Tekrar</span>
                            <input className="field-input" value={reps} onChange={e => setReps(e.target.value)} placeholder="8-12" />
                        </label>
                        <label style={{ display: 'grid', gap: 6 }}>
                            <span className="caption">Dinlenme</span>
                            <input className="field-input" type="number" min="0" value={restTime} onChange={e => setRestTime(Number(e.target.value))} />
                        </label>
                    </div>

                    <label style={{ display: 'grid', gap: 6 }}>
                        <span className="caption">Not</span>
                        <input
                            className="field-input"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            placeholder="Opsiyonel kısa not"
                        />
                    </label>

                    <div className="button-group" style={{ justifyContent: 'space-between', flexWrap: 'wrap' }}>
                        <div className="button-group">
                            <button type="submit" className="btn btn-primary">
                                {editIndex !== null ? 'Güncelle' : 'Ekle'}
                            </button>
                            {editIndex !== null && (
                                <button type="button" className="btn btn-secondary" onClick={resetForm}>
                                    İptal
                                </button>
                            )}
                        </div>

                        <div className="button-group">
                            {editIndex === null && (
                                <button type="button" className="btn btn-secondary" onClick={handleAddOffDay}>
                                    Dinlenme Günü
                                </button>
                            )}
                            <button type="button" className="btn btn-primary" onClick={handleSave} disabled={isPending}>
                                {isPending ? 'Kaydediliyor...' : 'Kaydet'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <div className="surface" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                        <span className="section-label">Mevcut program</span>
                        <h3 style={{ marginTop: 8 }}>Gün bazında düzen</h3>
                    </div>
                    <span className="chip chip--success">Tıkla, düzenle</span>
                </div>

                {exercises.length === 0 ? (
                    <div className="empty-state" style={{ padding: '48px 0' }}>
                        <div className="empty-state-icon">🏋️</div>
                        <p>Henüz egzersiz eklenmedi.</p>
                        <p className="caption">Üstteki formdan yeni hareketler ekleyebilirsin.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
                        {DAYS.filter(day => groupedByDay[day]?.length).map(day => {
                            const dayExercises = groupedByDay[day] ?? [];
                            const isOffDay = dayExercises.length === 1 && dayExercises[0].ex.exerciseName === OFF_DAY_MARKER;
                            const regularExercises = dayExercises.filter(item => item.ex.exerciseName !== OFF_DAY_MARKER);

                            return (
                                <article key={day} className="surface" style={{ padding: 16, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{day}</h4>
                                            <p className="caption" style={{ marginTop: 4 }}>
                                                {isOffDay ? 'Dinlenme günü' : `${regularExercises.length} egzersiz`}
                                            </p>
                                        </div>
                                        <button type="button" className="btn btn-secondary" onClick={() => setDayName(day)}>
                                            Gün seç
                                        </button>
                                    </div>

                                    {isOffDay ? (
                                        <div className="timeline-card" style={{ padding: 16, textAlign: 'center' }}>
                                            <div style={{ fontSize: '2rem' }}>😴</div>
                                            <p style={{ marginTop: 8, marginBottom: 0 }}>Bu gün dinlenme olarak işaretlenmiş.</p>
                                        </div>
                                    ) : (
                                        <div style={{ display: 'grid', gap: 10 }}>
                                            {dayExercises.map(({ ex, flatIndex }) => (
                                                <div
                                                    key={flatIndex}
                                                    className="timeline-card"
                                                    style={{ padding: 14, cursor: 'pointer' }}
                                                    onClick={() => handleEdit(flatIndex)}
                                                >
                                                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
                                                        <div style={{ display: 'flex', gap: 12, minWidth: 0 }}>
                                                            <div className="brand-mark" style={{ width: 38, height: 38, fontSize: '1rem', flexShrink: 0 }}>
                                                                {getExerciseIcon(ex.exerciseName)}
                                                            </div>
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: '#fff' }}>{ex.exerciseName}</div>
                                                                <div className="caption" style={{ marginTop: 4 }}>
                                                                    {ex.sets} set · {ex.reps} tekrar · {ex.restTimeInSeconds}s dinlenme
                                                                </div>
                                                                {ex.notes && <div className="caption" style={{ marginTop: 6 }}>{ex.notes}</div>}
                                                            </div>
                                                        </div>
                                                        <button
                                                            type="button"
                                                            className="btn btn-secondary"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleRemove(flatIndex);
                                                            }}
                                                        >
                                                            Sil
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};
