import { useAthleteWorkoutProgram, useAthleteDietProgram } from '../hooks/useAthletePortal';

export const AthletePrograms = () => {
    const { data: workoutProgram, isLoading: workoutLoading } = useAthleteWorkoutProgram();
    const { data: dietProgram, isLoading: dietLoading } = useAthleteDietProgram();

    if (workoutLoading || dietLoading) {
        return (
            <div className="empty-state">
                <div className="loader" />
                <p>Programların hazırlanıyor...</p>
            </div>
        );
    }

    return (
        <div className="card-stack" style={{ gap: 24 }}>
            <section className="hero-panel surface">
                <span className="eyebrow">Your plan</span>
                <h1 className="page-title" style={{ fontSize: '2.8rem', marginTop: 10 }}>
                    Programlarım
                </h1>
                <p className="page-subtitle" style={{ marginTop: 12 }}>
                    Haftalık antrenman ve beslenme düzenini tek bakışta gör.
                </p>
            </section>

            <div className="program-grid">
                <section className="program-card surface" style={{ padding: 24 }}>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Antrenman</span>
                            <h2 style={{ marginTop: 8, color: 'var(--text-primary)' }}>Antrenman Programı</h2>
                        </div>

                        {!workoutProgram || workoutProgram.days.length === 0 ? (
                            <div className="empty-state">
                                <p>Koçun henüz bir antrenman programı atamamış.</p>
                            </div>
                        ) : (
                            <div className="card-stack">
                                {workoutProgram.days.map((day, idx) => (
                                    <article key={idx} className="surface" style={{ padding: 0, overflow: 'hidden' }}>
                                        <div className="day-card-header">
                                            <div className="day-badge">{idx + 1}</div>
                                            <div>
                                                <h3 style={{ fontSize: '1.05rem' }}>{day.dayName}</h3>
                                                <p className="caption">Günün odak çalışması</p>
                                            </div>
                                        </div>

                                        <div>
                                            {day.exercises.map(ex => (
                                                <div key={ex.id} className="exercise-row">
                                                    <div>
                                                        <div style={{ fontWeight: 700 }}>{ex.exerciseName}</div>
                                                        <div className="caption" style={{ marginTop: 4 }}>{ex.notes || 'Not eklenmemiş'}</div>
                                                    </div>
                                                    <div style={{ textAlign: 'right' }}>
                                                        <div style={{ fontWeight: 700 }}>{ex.sets} x {ex.reps}</div>
                                                        <div className="caption">{ex.restTimeInSeconds}s dinlenme</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

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
                                <div className="timeline-card" style={{ padding: 18 }}>
                                    <span className="section-label">Genel not</span>
                                    <p style={{ marginTop: 8 }}>{dietProgram.generalDietNotes || 'Belirtilmemiş.'}</p>
                                </div>

                                <div className="summary-grid">
                                    {dietProgram.meals.map(meal => (
                                        <article key={meal.id} className="surface" style={{ padding: 18 }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, alignItems: 'flex-start' }}>
                                                <div>
                                                    <div style={{ fontWeight: 700 }}>{meal.order}. {meal.mealName}</div>
                                                    <p className="caption" style={{ marginTop: 8 }}>{meal.foods}</p>
                                                </div>
                                                <span className="badge badge-info">{meal.calories} kcal</span>
                                            </div>

                                            <div className="pill-group" style={{ marginTop: 16 }}>
                                                <span className="chip">P: {meal.protein}g</span>
                                                <span className="chip">K: {meal.carbs}g</span>
                                                <span className="chip">Y: {meal.fats}g</span>
                                            </div>
                                        </article>
                                    ))}
                                </div>
                            </>
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
};
