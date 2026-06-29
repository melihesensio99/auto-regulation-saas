import { useEffect, useMemo, useState } from 'react';
import { useAssignDietProgram, useDietProgram } from '../hooks/useDashboard';
import type { DietMealDto } from '../types';

type EditableDietMealField = 'mealName' | 'foods' | 'notes';

export const DietProgramPanel = ({ athleteId }: { athleteId: string }) => {
    const { data: program, isLoading } = useDietProgram(athleteId);
    const assignDiet = useAssignDietProgram();

    const [generalNotes, setGeneralNotes] = useState('');
    const [meals, setMeals] = useState<DietMealDto[]>([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!program) {
            return;
        }

        setGeneralNotes(program.generalDietNotes || '');
        setMeals(program.meals.map(meal => ({
            order: meal.order,
            mealName: meal.mealName,
            foods: meal.foods,
            notes: meal.notes,
        })));
    }, [program]);

    const activeMeals = isEditing ? meals : (program?.meals ?? []);

    const summary = useMemo(() => {
        return {
            meals: activeMeals.length,
            calories: program?.totalCalories ?? 0,
            protein: program?.totalProtein ?? 0,
            carbs: program?.totalCarbs ?? 0,
            fats: program?.totalFats ?? 0,
        };
    }, [activeMeals, program]);

    const startEditing = () => {
        if (program?.meals?.length) {
            setGeneralNotes(program.generalDietNotes || '');
            setMeals(program.meals.map(meal => ({
                order: meal.order,
                mealName: meal.mealName,
                foods: meal.foods,
                notes: meal.notes,
            })));
        } else {
            setGeneralNotes('');
            setMeals([
                {
                    order: 1,
                    mealName: '1. Öğün',
                    foods: '',
                    notes: '',
                },
            ]);
        }

        setIsEditing(true);
    };

    const handleAddMeal = () => {
        const nextOrder = meals.length + 1;
        setMeals([
            ...meals,
            {
                order: nextOrder,
                mealName: `${nextOrder}. Öğün`,
                foods: '',
                notes: '',
            },
        ]);
    };

    const handleRemoveMeal = (index: number) => {
        const updated = [...meals];
        updated.splice(index, 1);
        updated.forEach((meal, mealIndex) => {
            meal.order = mealIndex + 1;
        });
        setMeals(updated);
    };

    const handleChangeMeal = (index: number, field: EditableDietMealField, value: string) => {
        setMeals(current =>
            current.map((meal, mealIndex) => {
                if (mealIndex !== index) {
                    return meal;
                }

                return { ...meal, [field]: value };
            })
        );
    };

    const handleSave = () => {
        const mealsToSave = meals
            .map(meal => ({
                ...meal,
                mealName: meal.mealName.trim(),
                foods: meal.foods.trim(),
                notes: meal.notes.trim(),
            }))
            .filter(meal => meal.mealName.length > 0 && meal.foods.length > 0);

        if (!mealsToSave.length) {
            alert('En az bir öğün için ad ve yiyecekler alanını doldurmalısın.');
            return;
        }

        assignDiet.mutate(
            {
                athleteId,
                data: {
                    generalDietNotes: generalNotes.trim(),
                    meals: mealsToSave,
                },
            },
            {
                onSuccess: () => setIsEditing(false),
            }
        );
    };

    if (isLoading) {
        return (
            <div className="surface" style={{ padding: 24, minHeight: 240, display: 'grid', placeItems: 'center' }}>
                <div className="empty-state">
                    <div className="loader" />
                    <p>Beslenme programı yükleniyor...</p>
                </div>
            </div>
        );
    }

    const hasProgram = (program?.meals?.length ?? 0) > 0;

    return (
        <div className="card-stack" style={{ gap: 16 }}>
            <div className="surface" style={{ padding: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
                    <div>
                        <span className="section-label">Beslenme özeti</span>
                        <h3 style={{ marginTop: 8 }}>Programı yönet</h3>
                    </div>

                    {!isEditing && hasProgram && (
                        <button type="button" className="btn btn-secondary" onClick={startEditing}>
                            Düzenle
                        </button>
                    )}
                </div>

                <div className="stats-grid" style={{ marginTop: 16 }}>
                    <div className="metric-card">
                        <span className="metric-card__label">Öğün</span>
                        <span className="metric-card__value">{summary.meals}</span>
                        <div className="metric-card__hint">Planlanan öğün sayısı</div>
                    </div>
                    <div className="metric-card">
                        <span className="metric-card__label">Kalori</span>
                        <span className="metric-card__value">{summary.calories}</span>
                        <div className="metric-card__hint">Toplam enerji</div>
                    </div>
                    <div className="metric-card">
                        <span className="metric-card__label">Protein</span>
                        <span className="metric-card__value">{summary.protein}g</span>
                        <div className="metric-card__hint">Günlük toplam</div>
                    </div>
                    <div className="metric-card">
                        <span className="metric-card__label">Karb</span>
                        <span className="metric-card__value">{summary.carbs}g</span>
                        <div className="metric-card__hint">Karbonhidrat</div>
                    </div>
                    <div className="metric-card">
                        <span className="metric-card__label">Yağ</span>
                        <span className="metric-card__value">{summary.fats}g</span>
                        <div className="metric-card__hint">Günlük toplam</div>
                    </div>
                </div>
            </div>

            {isEditing ? (
                <>
                    <div className="surface" style={{ padding: 20 }}>
                        <div style={{ display: 'grid', gap: 12 }}>
                            <div>
                                <span className="section-label">Genel not</span>
                                <textarea
                                    className="field-input"
                                    style={{ minHeight: 120, resize: 'vertical', marginTop: 8, lineHeight: 1.6 }}
                                    value={generalNotes}
                                    onChange={e => setGeneralNotes(e.target.value)}
                                    placeholder="Planın genel mantığı, zamanlama, öncelikler..."
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                <div>
                                    <span className="section-label">Öğün listesi</span>
                                    <h4 style={{ marginTop: 8 }}>Yemekleri düzenle</h4>
                                </div>
                                <button type="button" className="btn btn-secondary" onClick={handleAddMeal}>
                                    + Öğün ekle
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: 14 }}>
                                {meals.map((meal, index) => (
                                    <article key={`${meal.order}-${index}`} className="timeline-card" style={{ padding: 16 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                                            <strong>{meal.order}. öğün</strong>
                                            <button type="button" className="btn btn-secondary" onClick={() => handleRemoveMeal(index)}>
                                                Sil
                                            </button>
                                        </div>

                                        <div style={{ display: 'grid', gap: 12 }}>
                                            <input
                                                className="field-input"
                                                value={meal.mealName}
                                                onChange={e => handleChangeMeal(index, 'mealName', e.target.value)}
                                                placeholder="Öğün adı"
                                            />
                                            <textarea
                                                className="field-input"
                                                style={{ minHeight: 96, resize: 'vertical', lineHeight: 1.6 }}
                                                value={meal.foods}
                                                onChange={e => handleChangeMeal(index, 'foods', e.target.value)}
                                                placeholder="Yiyecekleri satır satır yaz"
                                            />
                                            <input
                                                className="field-input"
                                                value={meal.notes}
                                                onChange={e => handleChangeMeal(index, 'notes', e.target.value)}
                                                placeholder="Öğün notu"
                                            />
                                        </div>
                                    </article>
                                ))}
                            </div>

                            <div className="button-group" style={{ justifyContent: 'space-between', flexWrap: 'wrap', marginTop: 8 }}>
                                <div className="button-group">
                                    <button type="button" className="btn btn-primary" onClick={handleSave} disabled={assignDiet.isPending}>
                                        {assignDiet.isPending ? 'Kaydediliyor...' : 'Kaydet'}
                                    </button>
                                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                                        İptal
                                    </button>
                                </div>
                                <span className="caption">Kaydettiğinde program otomatik güncellenir.</span>
                            </div>
                        </div>
                    </div>
                </>
            ) : !hasProgram ? (
                <div className="surface" style={{ padding: 24, minHeight: 280, display: 'grid', placeItems: 'center' }}>
                    <div className="empty-state">
                        <div className="empty-state-icon">🍽️</div>
                        <p>Henüz beslenme programı yok.</p>
                        <button type="button" className="btn btn-primary" onClick={startEditing}>
                            İlk planı oluştur
                        </button>
                    </div>
                </div>
            ) : (
                <div className="surface" style={{ padding: 20 }}>
                    <div style={{ display: 'grid', gap: 18 }}>
                        {program?.generalDietNotes && (
                                    <div className="timeline-card" style={{ padding: 18 }}>
                                        <span className="section-label">Genel not</span>
                                        <p style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{program.generalDietNotes}</p>
                                    </div>
                        )}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 14 }}>
                                    {program?.meals.map(meal => (
                                        <article key={meal.id} className="timeline-card" style={{ padding: 16 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 12 }}>
                                                <strong>{meal.order}. {meal.mealName}</strong>
                                            </div>

                                            <div style={{ display: 'grid', gap: 10 }}>
                                                {meal.foods.split('\n').filter(Boolean).map((food, idx) => (
                                                    <div key={idx} className="pill-group" style={{ justifyContent: 'space-between' }}>
                                                        <span>{food}</span>
                                                    </div>
                                                ))}
                                            </div>

                                            {meal.notes && <p className="caption" style={{ marginTop: 10, whiteSpace: 'pre-wrap' }}>{meal.notes}</p>}
                                        </article>
                                    ))}
                                </div>
                    </div>
                </div>
            )}
        </div>
    );
};
