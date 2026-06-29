import { useEffect, useMemo, useState } from 'react';
import { useAssignWorkout, useWorkoutProgram } from '../hooks/useDashboard';
import type { WorkoutExercise } from '../types';
import { ExerciseAutocomplete } from './ExerciseAutocomplete';
import type { ExerciseLibraryDto } from '../services/exerciseService';

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
    const [activeTabDay, setActiveTabDay] = useState<string | null>(null);
    const [selectedPreview, setSelectedPreview] = useState<ExerciseLibraryDto | null>(null);

    useEffect(() => {
        if (!program?.exercises) {
            setExercises([]);
            return;
        }

        const flatExercises = program.exercises.map(ex => ({
            dayName: ex.dayName,
            exerciseName: ex.exerciseName,
            sets: ex.sets,
            reps: ex.reps,
            restTimeInSeconds: ex.restTimeInSeconds,
            notes: ex.notes ?? null,
            exerciseLibraryId: ex.exerciseLibraryId ?? undefined,
            gifUrl: ex.gifUrl ?? undefined,
            imageUrl: ex.imageUrl ?? undefined,
            targetMuscle: ex.targetMuscle ?? undefined,
            instructions: ex.instructions ?? undefined
        }));

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

    const activeDaysList = useMemo(() => DAYS.filter(day => groupedByDay[day]?.length > 0), [groupedByDay]);
    const currentTab = activeTabDay && activeDaysList.includes(activeTabDay) ? activeTabDay : (activeDaysList[0] ?? null);

    const resetForm = () => {
        setExerciseName('');
        setSets(3);
        setReps('8-12');
        setRestTime(60);
        setNotes('');
        setEditIndex(null);
        setDayName(DAYS[0]);
        setSelectedPreview(null);
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
            exerciseLibraryId: selectedPreview?.id,
            gifUrl: selectedPreview?.gifUrl,
            imageUrl: selectedPreview?.imageUrl,
            targetMuscle: selectedPreview?.targetMuscle,
            instructions: selectedPreview?.instructions
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
        
        if (selected.exerciseLibraryId) {
            setSelectedPreview({
                id: selected.exerciseLibraryId,
                name: selected.exerciseName,
                targetMuscle: selected.targetMuscle ?? '',
                imageUrl: selected.imageUrl ?? '',
                gifUrl: selected.gifUrl ?? ''
            });
        } else {
            setSelectedPreview(null);
        }

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
                    exerciseLibraryId: exercise.exerciseLibraryId
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
                        <label style={{ display: 'grid', gap: 6, position: 'relative' }}>
                            <span className="caption">Hareket</span>
                            <ExerciseAutocomplete 
                                value={exerciseName} 
                                onChange={setExerciseName} 
                                onSelectExercise={setSelectedPreview} 
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

                    {selectedPreview && (
                        <div className="exercise-preview-card" style={{ marginTop: 8 }}>
                            <img src={`https://res.cloudinary.com/dc2j01x6b/image/upload/v1/${selectedPreview.gifUrl?.split('/').pop() || selectedPreview.imageUrl?.split('/').pop()}`} alt={selectedPreview.name} />
                            <div>
                                <strong>{selectedPreview.name}</strong>
                                <span className="caption">Hedef: {selectedPreview.targetMuscle}</span>
                                {selectedPreview.instructions && (
                                    <details className="exercise-info-accordion exercise-info-accordion--compact" style={{ marginTop: 10 }}>
                                        <summary>
                                            <span>Hareket nasıl yapılır?</span>
                                            <span className="exercise-info-accordion__hint">Bilgi</span>
                                        </summary>
                                        <div className="exercise-info-accordion__body">
                                            <p>{selectedPreview.instructions}</p>
                                        </div>
                                    </details>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="button-group" style={{ justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 12 }}>
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
                    <div>
                        <div className="tab-bar" style={{ marginBottom: 20 }}>
                            {activeDaysList.map(day => (
                                <button
                                    key={day}
                                    type="button"
                                    className={`tab-btn ${currentTab === day ? 'active' : ''}`}
                                    onClick={() => setActiveTabDay(day)}
                                >
                                    {day}
                                </button>
                            ))}
                        </div>

                        {currentTab && (() => {
                            const dayExercises = groupedByDay[currentTab] ?? [];
                            const isOffDay = dayExercises.length === 1 && dayExercises[0].ex.exerciseName === OFF_DAY_MARKER;
                            const regularExercises = dayExercises.filter(item => item.ex.exerciseName !== OFF_DAY_MARKER);

                            return (
                                <article className="surface" style={{ padding: 20, border: '1px solid rgba(255,255,255,0.08)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
                                        <div>
                                            <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{currentTab} Programı</h4>
                                            <p className="caption" style={{ marginTop: 4 }}>
                                                {isOffDay ? 'Dinlenme günü' : `${regularExercises.length} egzersiz planlandı`}
                                            </p>
                                        </div>
                                    </div>

                                    {isOffDay ? (
                                        <div className="timeline-card" style={{ padding: 24, textAlign: 'center' }}>
                                            <div style={{ fontSize: '2.5rem' }}>😴</div>
                                            <p style={{ marginTop: 12, marginBottom: 0, fontSize: '1.1rem' }}>Bu gün dinlenme olarak işaretlenmiş.</p>
                                        </div>
                                    ) : (
                <div style={{ display: 'grid', gap: 12 }}>
                    {dayExercises.map(({ ex, flatIndex }) => (
                        <div
                            key={flatIndex}
                            className="timeline-card"
                            style={{ padding: 18, cursor: 'pointer' }}
                            onClick={() => handleEdit(flatIndex)}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
                                <div style={{ display: 'flex', gap: 16, alignItems: 'center', minWidth: 0 }}>
                                                            {ex.gifUrl || ex.imageUrl ? (
                                                                <img 
                                                                    src={`https://res.cloudinary.com/dc2j01x6b/image/upload/v1/${ex.gifUrl?.split('/').pop() || ex.imageUrl?.split('/').pop()}`} 
                                                                    alt={ex.exerciseName}
                                                                    style={{ width: 64, height: 64, borderRadius: 8, objectFit: 'cover', background: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}
                                                                />
                                                            ) : (
                                                                <div className="brand-mark" style={{ width: 64, height: 64, fontSize: '1.5rem', flexShrink: 0 }}>
                                                                    {getExerciseIcon(ex.exerciseName)}
                                                                </div>
                                                            )}
                                                            <div>
                                                                <div style={{ fontWeight: 700, color: '#fff', fontSize: '1.1rem' }}>{ex.exerciseName}</div>
                                                                <div className="caption" style={{ marginTop: 6, fontSize: '0.95rem' }}>
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
                                                    {ex.instructions && (
                                                        <details className="exercise-info-accordion" onClick={(e) => e.stopPropagation()}>
                                                            <summary>
                                                                <span>Hareket nasıl yapılır?</span>
                                                                <span className="exercise-info-accordion__hint">Aç</span>
                                                            </summary>
                                                            <div className="exercise-info-accordion__body">
                                                                <p>{ex.instructions}</p>
                                                            </div>
                                                        </details>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </article>
                            );
                        })()}
                    </div>
                )}
            </div>
        </div>
    );
};
