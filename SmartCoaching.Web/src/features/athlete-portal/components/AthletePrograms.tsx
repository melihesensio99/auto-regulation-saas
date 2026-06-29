import { useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAthleteWorkoutProgram, useAthleteDietProgram } from '../hooks/useAthletePortal';
import type { WorkoutExerciseResponse } from '../../dashboard/types';

type WorkoutDayGroup = {
    dayName: string;
    exercises: WorkoutExerciseResponse[];
};

type ViewMode = 'workout' | 'diet';

const DAYS = ['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'];

const dayOrder = (dayName: string) => {
    const index = DAYS.indexOf(dayName);
    return index === -1 ? 99 : index;
};

const toCloudinaryUrl = (url?: string | null) => {
    if (!url) {
        return null;
    }

    const fileName = url.split('/').pop();
    return fileName ? `https://res.cloudinary.com/dc2j01x6b/image/upload/v1/${fileName}` : null;
};

export const AthletePrograms = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const view = (searchParams.get('view') === 'diet' ? 'diet' : 'workout') as ViewMode;

    const { data: workoutProgram, isLoading: workoutLoading } = useAthleteWorkoutProgram();
    const { data: dietProgram, isLoading: dietLoading } = useAthleteDietProgram();
    const workoutLoadingOrDietLoading = workoutLoading || dietLoading;

    const workoutDays = useMemo(() => {
        return (workoutProgram?.exercises ?? [])
            .reduce<WorkoutDayGroup[]>((groups, exercise) => {
                const existing = groups.find(group => group.dayName === exercise.dayName);

                if (existing) {
                    existing.exercises.push(exercise);
                    return groups;
                }

                groups.push({
                    dayName: exercise.dayName,
                    exercises: [exercise],
                });

                return groups;
            }, [])
            .sort((left, right) => dayOrder(left.dayName) - dayOrder(right.dayName));
    }, [workoutProgram]);

    if (workoutLoadingOrDietLoading) {
        return (
            <div className="empty-state">
                <div className="loader" />
                <p>Programlar hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="card-stack" style={{ gap: 24 }}>
            <section className="surface" style={{ padding: '12px 16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
                        <span className="brand-mark" style={{ width: 34, height: 34, borderRadius: 12, fontSize: '0.8rem' }}>SC</span>
                        <div>
                            <div style={{ fontSize: '0.98rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                                {view === 'workout' ? 'Antrenman' : 'Beslenme'}
                            </div>
                        </div>
                    </div>

                    <button type="button" className="btn btn-secondary" style={{ minHeight: 38, padding: '8px 12px', borderRadius: 12 }} onClick={() => navigate('/athlete/dashboard')}>
                        Ana sayfaya dön
                    </button>
                </div>
            </section>

            {view === 'workout' ? (
                <section className="program-card surface" style={{ padding: 24 }}>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Antrenman</span>
                            <h2 style={{ marginTop: 8, color: 'var(--text-primary)' }}>Gün bazlı antrenman</h2>
                        </div>

                        {!workoutProgram || workoutDays.length === 0 ? (
                            <div className="empty-state">
                                <p>Koçun henüz bir antrenman programı atamamış.</p>
                            </div>
                        ) : (
                            <div className="card-stack">
                                {workoutDays.map(day => (
                                    <article key={day.dayName} className="timeline-card workout-day-card">
                                        <div className="workout-day-card__header">
                                            <div>
                                                <h3>{day.dayName}</h3>
                                                <p className="caption">
                                                    {day.exercises.length} hareket · O güne ait tüm plan
                                                </p>
                                            </div>
                                            <span className="chip chip--success">Günlük görünüm</span>
                                        </div>

                                        <div className="workout-exercise-list">
                                            {day.exercises.map(ex => {
                                                const mediaUrl = toCloudinaryUrl(ex.gifUrl ?? ex.imageUrl);

                                                return (
                                                    <article key={ex.id} className="workout-exercise-card">
                                                        <div className="workout-exercise-card__media">
                                                            {mediaUrl ? (
                                                                <img src={mediaUrl} alt={ex.exerciseName} />
                                                            ) : (
                                                                <div className="brand-mark workout-exercise-card__fallback">🏋️</div>
                                                            )}
                                                        </div>

                                                        <div className="workout-exercise-card__content">
                                                            <div className="workout-exercise-card__topline">
                                                                <div>
                                                                    <div className="workout-exercise-card__title">{ex.exerciseName}</div>
                                                                    {ex.targetMuscle && (
                                                                        <div className="caption workout-exercise-card__muscle">{ex.targetMuscle}</div>
                                                                    )}
                                                                </div>

                                                                <div className="workout-exercise-card__stats">
                                                                    <span>{ex.sets} set</span>
                                                                    <span>{ex.reps} tekrar</span>
                                                                    <span>{ex.restTimeInSeconds}s dinlenme</span>
                                                                </div>
                                                            </div>

                                                            <div className="caption workout-exercise-card__notes">
                                                                {ex.notes || 'Not eklenmemiş'}
                                                            </div>

                                                            {ex.instructions && (
                                                                <details className="exercise-info-accordion workout-exercise-card__accordion">
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
                                                    </article>
                                                );
                                            })}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            ) : (
                <section className="program-card surface" style={{ padding: 24 }}>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Beslenme</span>
                            <h2 style={{ marginTop: 8, color: 'var(--text-primary)' }}>Beslenme Programı</h2>
                        </div>

                        {!dietProgram || dietProgram.meals.length === 0 ? (
                            <div className="empty-state">
                                <p>Koçun henüz bir beslenme programı atamamış.</p>
                            </div>
                        ) : (
                            <>
                                <div className="timeline-card" style={{ padding: 20 }}>
                                    <span className="section-label">Genel not</span>
                                    <p style={{ marginTop: 8 }}>{dietProgram.generalDietNotes || 'Belirtilmemiş.'}</p>
                                </div>

                                <div className="stats-grid">
                                    <div className="metric-card">
                                        <span className="metric-card__label">Toplam kalori</span>
                                        <span className="metric-card__value">{dietProgram.totalCalories}</span>
                                        <div className="metric-card__hint">Program bütünü</div>
                                    </div>
                                    <div className="metric-card">
                                        <span className="metric-card__label">Toplam protein</span>
                                        <span className="metric-card__value">{dietProgram.totalProtein}g</span>
                                        <div className="metric-card__hint">Günlük toplam</div>
                                    </div>
                                    <div className="metric-card">
                                        <span className="metric-card__label">Toplam karb</span>
                                        <span className="metric-card__value">{dietProgram.totalCarbs}g</span>
                                        <div className="metric-card__hint">Günlük toplam</div>
                                    </div>
                                    <div className="metric-card">
                                        <span className="metric-card__label">Toplam yağ</span>
                                        <span className="metric-card__value">{dietProgram.totalFats}g</span>
                                        <div className="metric-card__hint">Günlük toplam</div>
                                    </div>
                                </div>

                                <div className="summary-grid">
                                    {dietProgram.meals.map(meal => (
                                        <article key={meal.id} className="surface" style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{meal.order}. {meal.mealName}</div>
                                                    <p className="caption" style={{ marginTop: 8, whiteSpace: 'pre-wrap' }}>
                                                        {meal.foods}
                                                    </p>
                                                    {meal.notes && (
                                                        <p className="caption" style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>
                                                            {meal.notes}
                                                        </p>
                                                    )}
                                                </div>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
};
