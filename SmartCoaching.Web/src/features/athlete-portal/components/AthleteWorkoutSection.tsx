import { useMemo, useState } from 'react';
import type { WorkoutExerciseResponse } from '@/features/dashboard/types';

interface AthleteWorkoutSectionProps {
    exercises: WorkoutExerciseResponse[] | undefined;
}

type WorkoutDayGroup = {
    dayName: string;
    exercises: WorkoutExerciseResponse[];
};

const DAYS = ['Pazartesi', 'Sali', 'Carsamba', 'Persembe', 'Cuma', 'Cumartesi', 'Pazar'];

const normalizeDay = (dayName: string) =>
    dayName
        .replace('Salı', 'Sali')
        .replace('Çarşamba', 'Carsamba')
        .replace('Perşembe', 'Persembe');

const dayOrder = (dayName: string) => {
    const index = DAYS.indexOf(normalizeDay(dayName));
    return index === -1 ? 99 : index;
};

const toCloudinaryUrl = (url?: string | null) => {
    if (!url) {
        return null;
    }

    const fileName = url.split('/').pop();
    return fileName ? `https://res.cloudinary.com/dc2j01x6b/image/upload/v1/${fileName}` : null;
};

export const AthleteWorkoutSection = ({ exercises }: AthleteWorkoutSectionProps) => {
    const workoutDays = useMemo(() => {
        return (exercises ?? [])
            .reduce<WorkoutDayGroup[]>((groups, exercise) => {
                const existing = groups.find((group) => group.dayName === exercise.dayName);

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
    }, [exercises]);

    const [activeDay, setActiveDay] = useState<string | null>(workoutDays[0]?.dayName ?? null);

    const selectedDay = workoutDays.find((day) => day.dayName === activeDay) ?? workoutDays[0];

    if (!workoutDays.length) {
        return (
            <div className="empty-state athlete-section-empty">
                <p>Kocun henuz bir antrenman programi atamamis.</p>
            </div>
        );
    }

    return (
        <div className="card-stack">
            <section className="surface athlete-section-card">
                <div className="section-header">
                    <div>
                        <span className="section-label">Antrenman</span>
                        <h3>Gun bazli plan</h3>
                    </div>

                    <div className="button-group">
                        <span className="chip">{workoutDays.length} aktif gun</span>
                        <span className="chip">{exercises?.length ?? 0} egzersiz</span>
                    </div>
                </div>

                <div className="athlete-workout-days">
                    {workoutDays.map((day) => (
                        <button
                            key={day.dayName}
                            type="button"
                            className={`athlete-workout-days__button ${selectedDay?.dayName === day.dayName ? 'is-active' : ''}`}
                            onClick={() => setActiveDay(day.dayName)}
                        >
                            {day.dayName}
                        </button>
                    ))}
                </div>
            </section>

            {selectedDay && (
                <section className="surface athlete-section-card">
                    <div className="section-header">
                        <div>
                            <span className="section-label">Secili gun</span>
                            <h3>{selectedDay.dayName}</h3>
                        </div>
                        <span className="chip chip--success">{selectedDay.exercises.length} hareket</span>
                    </div>

                    <div className="workout-exercise-list">
                        {selectedDay.exercises.map((exercise) => {
                            const mediaUrl = toCloudinaryUrl(exercise.gifUrl ?? exercise.imageUrl);

                            return (
                                <article key={exercise.id} className="workout-exercise-card">
                                    <div className="workout-exercise-card__media">
                                        {mediaUrl ? (
                                            <img src={mediaUrl} alt={exercise.exerciseName} />
                                        ) : (
                                            <div className="brand-mark workout-exercise-card__fallback">W</div>
                                        )}
                                    </div>

                                    <div className="workout-exercise-card__content">
                                        <div className="workout-exercise-card__topline">
                                            <div>
                                                <div className="workout-exercise-card__title">{exercise.exerciseName}</div>
                                                {exercise.targetMuscle && (
                                                    <div className="caption workout-exercise-card__muscle">{exercise.targetMuscle}</div>
                                                )}
                                            </div>

                                            <div className="workout-exercise-card__stats">
                                                <span>{exercise.sets} set</span>
                                                <span>{exercise.reps} tekrar</span>
                                                <span>{exercise.restTimeInSeconds}s dinlenme</span>
                                            </div>
                                        </div>

                                        <div className="caption workout-exercise-card__notes">
                                            {exercise.notes || 'Not eklenmemis'}
                                        </div>

                                        {exercise.instructions && (
                                            <details className="exercise-info-accordion workout-exercise-card__accordion">
                                                <summary>
                                                    <span>Hareket nasil yapilir?</span>
                                                    <span className="exercise-info-accordion__hint">Ac</span>
                                                </summary>
                                                <div className="exercise-info-accordion__body">
                                                    <p>{exercise.instructions}</p>
                                                </div>
                                            </details>
                                        )}
                                    </div>
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};
