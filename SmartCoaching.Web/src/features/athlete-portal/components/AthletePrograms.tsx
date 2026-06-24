import { useAthleteWorkoutProgram, useAthleteDietProgram } from '../hooks/useAthletePortal';

export const AthletePrograms = () => {
    const { data: workoutProgram, isLoading: workoutLoading } = useAthleteWorkoutProgram();
    const { data: dietProgram, isLoading: dietLoading } = useAthleteDietProgram();

    if (workoutLoading || dietLoading) {
        return <div style={{ color: 'white', padding: '20px' }}>Programlarınız yükleniyor...</div>;
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            <h1 style={{ color: 'white', margin: 0 }}>📋 Programlarım</h1>
            
            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>🏋️ Antrenman Programı</h2>
                {!workoutProgram || workoutProgram.days.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Koçunuz henüz bir antrenman programı atamamış.</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                        {workoutProgram.days.map((day, idx) => (
                            <div key={idx} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px' }}>
                                <h4 style={{ color: 'white', margin: '0 0 15px 0' }}>{day.dayName}</h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {day.exercises.map(ex => (
                                        <div key={ex.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                                            <div style={{ color: 'white' }}>
                                                <div style={{ fontWeight: 'bold' }}>{ex.exerciseName}</div>
                                                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{ex.notes || '-'}</div>
                                            </div>
                                            <div style={{ color: 'var(--accent-secondary)', textAlign: 'right' }}>
                                                <div>{ex.sets} Set x {ex.reps} Tekrar</div>
                                                <div style={{ fontSize: '12px' }}>{ex.restTimeInSeconds}s Dinlenme</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="glass-panel" style={{ padding: '30px', borderRadius: '20px' }}>
                <h2 style={{ color: 'var(--success)', marginTop: 0 }}>🥗 Beslenme Programı</h2>
                {!dietProgram || dietProgram.meals.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Koçunuz henüz bir beslenme programı atamamış.</p>
                ) : (
                    <div>
                        <div style={{ padding: '15px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.2)', borderRadius: '10px', color: 'white', marginBottom: '20px' }}>
                            <h4 style={{ margin: '0 0 5px 0', color: 'var(--success)' }}>Genel Notlar</h4>
                            <p style={{ margin: 0, fontSize: '14px' }}>{dietProgram.generalDietNotes || 'Belirtilmemiş.'}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                            {dietProgram.meals.map(meal => (
                                <div key={meal.id} style={{ background: 'rgba(0,0,0,0.3)', padding: '20px', borderRadius: '15px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                        <h4 style={{ color: 'white', margin: 0 }}>{meal.order}. {meal.mealName}</h4>
                                        <span className="badge badge-info">{meal.calories} kcal</span>
                                    </div>
                                    <div style={{ color: 'white', marginBottom: '15px', fontSize: '14px' }}>
                                        {meal.foods}
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', fontSize: '12px' }}>
                                        <span style={{ color: 'var(--accent-primary)' }}>P: {meal.protein}g</span>
                                        <span style={{ color: 'var(--accent-secondary)' }}>K: {meal.carbs}g</span>
                                        <span style={{ color: 'var(--warning)' }}>Y: {meal.fats}g</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
