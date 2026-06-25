import { useState, useMemo } from 'react';
import { useDietProgram, useAssignDietProgram } from '../hooks/useDashboard';
import type { DietMealDto } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

export const DietProgramPanel = ({ athleteId }: { athleteId: string }) => {
    const { data: program, isLoading } = useDietProgram(athleteId);
    const assignDiet = useAssignDietProgram();

    const [generalNotes, setGeneralNotes] = useState('');
    const [meals, setMeals] = useState<DietMealDto[]>([
        { order: 1, mealName: '1. Öğün (Kahvaltı)', foods: '', notes: '', protein: 0, carbs: 0, fats: 0, calories: 0 }
    ]);
    const [isEditing, setIsEditing] = useState(false);

    // Initialize form when data loads
    const startEditing = () => {
        if (program && program.meals.length > 0) {
            setGeneralNotes(program.generalDietNotes || '');
            setMeals(program.meals.map(m => ({
                order: m.order,
                mealName: m.mealName,
                foods: m.foods,
                notes: m.notes,
                protein: m.protein,
                carbs: m.carbs,
                fats: m.fats,
                calories: m.calories
            })));
        } else {
            setGeneralNotes('');
            setMeals([{ order: 1, mealName: '1. Öğün', foods: '', notes: '', protein: 0, carbs: 0, fats: 0, calories: 0 }]);
        }
        setIsEditing(true);
    };

    const handleAddMeal = () => {
        const nextOrder = meals.length + 1;
        setMeals([...meals, { order: nextOrder, mealName: `${nextOrder}. Öğün`, foods: '', notes: '', protein: 0, carbs: 0, fats: 0, calories: 0 }]);
    };

    const handleRemoveMeal = (index: number) => {
        const newMeals = [...meals];
        newMeals.splice(index, 1);
        newMeals.forEach((m, i) => m.order = i + 1);
        setMeals(newMeals);
    };

    const handleChangeMeal = (index: number, field: keyof DietMealDto, value: string) => {
        const newMeals = [...meals];
        (newMeals[index] as any)[field] = value;
        setMeals(newMeals);
    };

    const handleSave = () => {
        assignDiet.mutate({
            athleteId,
            data: { generalDietNotes: generalNotes, meals }
        }, {
            onSuccess: () => {
                setIsEditing(false);
            }
        });
    };

    // Macro calculations
    const macros = useMemo(() => {
        if (!program || !program.meals.length) return { protein: 0, carbs: 0, fats: 0, calories: 0 };
        return {
            protein: program.meals.reduce((acc, m) => acc + m.protein, 0),
            carbs: program.meals.reduce((acc, m) => acc + m.carbs, 0),
            fats: program.meals.reduce((acc, m) => acc + m.fats, 0),
            calories: program.meals.reduce((acc, m) => acc + m.calories, 0),
        };
    }, [program]);

    // Food item icon
    const getFoodIcon = (food: string) => {
        const f = food.toLowerCase();
        if (f.includes('yumurta')) return '🥚';
        if (f.includes('pirinç') || f.includes('pilav')) return '🍚';
        if (f.includes('tavuk') || f.includes('göğüs')) return '🍗';
        if (f.includes('muz')) return '🍌';
        if (f.includes('yulaf')) return '🥣';
        if (f.includes('süt')) return '🥛';
        if (f.includes('bal')) return '🍯';
        if (f.includes('balık') || f.includes('somon')) return '🐟';
        if (f.includes('et') || f.includes('biftek')) return '🥩';
        if (f.includes('salata') || f.includes('sebze')) return '🥗';
        if (f.includes('ekmek') || f.includes('makarna')) return '🍞';
        if (f.includes('peynir')) return '🧀';
        if (f.includes('fındık') || f.includes('badem') || f.includes('ceviz')) return '🥜';
        if (f.includes('protein')) return '💪';
        return '🍽️';
    };

    if (isLoading) return <div style={{ color: 'white', padding: '20px' }}>Beslenme programı yükleniyor...</div>;

    const hasProgram = program && program.meals.length > 0;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b'];

    const inputStyle: React.CSSProperties = {
        background: 'rgba(255,255,255,0.06)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: '8px',
        color: 'white',
        padding: '12px',
        fontSize: '0.9rem',
        outline: 'none',
        width: '100%',
        boxSizing: 'border-box' as const,
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0', height: '100%', minHeight: 0 }}>

            {isEditing ? (
                /* ======================= EDIT MODE ======================= */
                <div style={{ flex: 1, overflowY: 'auto', padding: '4px', display: 'flex', flexDirection: 'column', gap: '16px' }}>

                    {/* 3-Column Layout: Notes | Meals | Macro Summary */}
                    <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0, flexWrap: 'wrap' }}>

                        {/* LEFT: General Notes */}
                        <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>Genel Tavsiyeler & Strateji</h3>
                            <div className="glass-panel" style={{ padding: '16px', flex: 1 }}>
                                <textarea
                                    value={generalNotes}
                                    onChange={(e) => setGeneralNotes(e.target.value)}
                                    placeholder={"Genel Tavsiyeler & Strateji:\n\n• Antrenman Öncesi Strateji:\n  1.5 saat önce sindirimi kolay karbo (bknz. Pirinç Unu) ve protein.\n\n• Öğün Aralığı: Kas protein sentezi için öğünler arası min. 2.5 saat, max 3.5 saat idealdir."}
                                    style={{
                                        ...inputStyle,
                                        minHeight: '200px',
                                        height: '100%',
                                        resize: 'vertical',
                                        lineHeight: '1.6',
                                    }}
                                />
                            </div>
                        </div>

                        {/* CENTER: Meal Cards */}
                        <div style={{ flex: 1, minWidth: '300px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {meals.map((meal, index) => (
                                <div key={index} className="glass-panel" style={{
                                    padding: '20px',
                                    borderRadius: '14px',
                                    position: 'relative',
                                }}>
                                    {/* Meal Header */}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                                        <div style={{
                                            width: '36px', height: '36px', borderRadius: '10px',
                                            background: 'rgba(99,102,241,0.2)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '1.1rem',
                                        }}>🍽️</div>
                                        <input
                                            type="text"
                                            value={meal.mealName}
                                            onChange={(e) => handleChangeMeal(index, 'mealName', e.target.value)}
                                            placeholder="Örn: Kahvaltı veya 1. Öğün"
                                            style={{
                                                ...inputStyle,
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                padding: '8px 12px',
                                                border: 'none',
                                                background: 'transparent',
                                            }}
                                        />
                                    </div>

                                    {/* Foods (each line becomes a food item) */}
                                    <textarea
                                        value={meal.foods}
                                        onChange={(e) => handleChangeMeal(index, 'foods', e.target.value)}
                                        placeholder={"150 Gr Pirinç Unu\n8 Yumurta Beyazı\n50 Gr Muz"}
                                        style={{
                                            ...inputStyle,
                                            minHeight: '100px',
                                            resize: 'vertical',
                                            lineHeight: '1.8',
                                            marginBottom: '10px',
                                        }}
                                    />

                                    {/* Meal Notes */}
                                    <input
                                        type="text"
                                        value={meal.notes}
                                        onChange={(e) => handleChangeMeal(index, 'notes', e.target.value)}
                                        placeholder="Öğün notu (opsiyonel)"
                                        style={{
                                            ...inputStyle,
                                            fontSize: '0.85rem',
                                            color: 'var(--text-secondary)',
                                        }}
                                    />

                                    {/* Actions */}
                                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '12px' }}>
                                        <button onClick={() => handleRemoveMeal(index)} style={{
                                            background: 'rgba(239,68,68,0.15)',
                                            border: 'none',
                                            color: '#f87171',
                                            padding: '6px 12px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            fontSize: '0.8rem',
                                        }}>🗑️</button>
                                    </div>
                                </div>
                            ))}

                            {/* Add Meal Button */}
                            <button onClick={handleAddMeal} style={{
                                padding: '16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '2px dashed rgba(255,255,255,0.1)',
                                borderRadius: '14px',
                                color: 'rgba(255,255,255,0.5)',
                                fontSize: '0.9rem',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.borderColor = 'rgba(99,102,241,0.4)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
                                e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                            }}>
                                + Yeni Öğün Ekle
                            </button>
                        </div>

                        {/* RIGHT: Macro Summary (sticky) */}
                        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>Makro Dağılım Özeti</h3>
                            <div className="glass-panel" style={{ padding: '20px', textAlign: 'center' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '0 0 8px 0' }}>
                                    Makro değerleri kaydettiğinizde AI tarafından otomatik hesaplanacaktır.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Save / Cancel Bar */}
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                        <button onClick={handleSave} disabled={assignDiet.isPending} style={{
                            flex: 1,
                            padding: '14px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '10px',
                            cursor: assignDiet.isPending ? 'not-allowed' : 'pointer',
                            fontSize: '1rem',
                            opacity: assignDiet.isPending ? 0.7 : 1,
                        }}>
                            {assignDiet.isPending ? '⏳ Kaydediliyor...' : '💾 Programı Kaydet (AI Makro Analizi Başlat)'}
                        </button>
                        <button onClick={() => setIsEditing(false)} style={{
                            padding: '14px 24px',
                            background: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.12)',
                            color: 'var(--text-secondary)',
                            fontWeight: 600,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                        }}>İptal</button>
                    </div>
                </div>
            ) : !hasProgram ? (
                /* ======================= EMPTY STATE ======================= */
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '16px',
                }}>
                    <div className="glass-panel" style={{
                        padding: '80px 40px',
                        textAlign: 'center',
                        width: '100%',
                        borderRadius: '14px',
                        border: '1px dashed rgba(255,255,255,0.1)',
                    }}>
                        <div style={{ fontSize: '3.5rem', marginBottom: '16px', opacity: 0.4 }}>🍽️</div>
                        <h3 style={{ margin: '0 0 8px 0', color: 'rgba(255,255,255,0.8)', fontSize: '1.15rem' }}>Henüz beslenme programı yok.</h3>
                        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 24px 0', fontSize: '0.9rem' }}>Yukarıdan yeni plan ekleyebilirsiniz.</p>
                        <button onClick={startEditing} style={{
                            padding: '12px 28px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            border: 'none',
                            color: '#fff',
                            fontWeight: 700,
                            borderRadius: '10px',
                            cursor: 'pointer',
                            fontSize: '0.95rem',
                        }}>+ Yeni Plan Ekle</button>
                    </div>
                </div>
            ) : (
                /* ======================= VIEW MODE ======================= */
                <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0', minHeight: 0 }}>

                    {/* Header Bar */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '12px 4px',
                        marginBottom: '16px',
                    }}>
                        <h3 style={{ margin: 0, color: '#fff', fontSize: '1rem', fontWeight: 700 }}>
                            Beslenme Programları <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: 400 }}>({program.meals.length} öğün)</span>
                        </h3>
                        <button onClick={startEditing} style={{
                            padding: '8px 16px',
                            background: 'rgba(99,102,241,0.15)',
                            border: '1px solid rgba(99,102,241,0.3)',
                            color: '#a5b4fc',
                            fontWeight: 600,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                        }}>✏️ Düzenle</button>
                    </div>

                    {/* 3-Column Layout: Notes | Meals | Macro */}
                    <div style={{ display: 'flex', gap: '20px', flex: 1, minHeight: 0 }}>

                        {/* LEFT: General Notes */}
                        {program.generalDietNotes && (
                            <div style={{ width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Genel Tavsiyeler & Strateji</h4>
                                <div className="glass-panel" style={{
                                    padding: '20px',
                                    flex: 1,
                                    borderLeft: '3px solid rgba(99,102,241,0.5)',
                                }}>
                                    <div style={{
                                        whiteSpace: 'pre-wrap',
                                        color: 'rgba(255,255,255,0.85)',
                                        lineHeight: '1.7',
                                        fontSize: '0.88rem',
                                    }}>
                                        {program.generalDietNotes}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* CENTER: Meal Cards */}
                        <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            {program.meals.map((meal) => {
                                const foodLines = meal.foods.split('\n').filter(f => f.trim());

                                return (
                                    <div key={meal.id} className="glass-panel" style={{
                                        padding: '20px',
                                        borderRadius: '14px',
                                    }}>
                                        {/* Meal Title */}
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '12px',
                                            marginBottom: '16px',
                                            paddingBottom: '12px',
                                            borderBottom: '1px solid rgba(255,255,255,0.08)',
                                        }}>
                                            <div style={{
                                                width: '38px', height: '38px', borderRadius: '10px',
                                                background: 'linear-gradient(135deg, rgba(99,102,241,0.25), rgba(139,92,246,0.2))',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                fontSize: '1.1rem',
                                            }}>🍽️</div>
                                            <h3 style={{
                                                margin: 0,
                                                color: '#fff',
                                                fontSize: '1.05rem',
                                                fontWeight: 700,
                                            }}>{meal.mealName}</h3>
                                        </div>

                                        {/* Food Items List */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: meal.notes ? '12px' : '0' }}>
                                            {foodLines.map((food, i) => (
                                                <div key={i} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    gap: '12px',
                                                    padding: '8px 12px',
                                                    borderRadius: '10px',
                                                    background: 'rgba(255,255,255,0.03)',
                                                }}>
                                                    <div style={{
                                                        width: '32px', height: '32px', borderRadius: '50%',
                                                        background: 'rgba(245,158,11,0.15)',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        fontSize: '0.9rem', flexShrink: 0,
                                                    }}>{getFoodIcon(food)}</div>
                                                    <div style={{ flex: 1 }}>
                                                        <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 500 }}>{food}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Notes */}
                                        {meal.notes && (
                                            <div style={{
                                                padding: '10px 14px',
                                                borderRadius: '8px',
                                                background: 'rgba(255,255,255,0.03)',
                                                fontSize: '0.85rem',
                                                color: 'var(--text-secondary)',
                                                fontStyle: 'italic',
                                                marginBottom: '12px',
                                            }}>
                                                💡 {meal.notes}
                                            </div>
                                        )}

                                        {/* Macro Footer */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '16px',
                                            fontSize: '0.78rem',
                                            color: 'rgba(255,255,255,0.5)',
                                            borderTop: '1px solid rgba(255,255,255,0.06)',
                                            paddingTop: '12px',
                                            flexWrap: 'wrap',
                                        }}>
                                            <span>E: <b style={{ color: '#f59e0b' }}>{meal.calories}</b> Cal</span>
                                            <span>P: <b style={{ color: '#6366f1' }}>{meal.protein}</b>g</span>
                                            <span>K: <b style={{ color: '#10b981' }}>{meal.carbs}</b>g</span>
                                            <span>Y: <b style={{ color: '#ef4444' }}>{meal.fats}</b>g</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* RIGHT: Macro Summary */}
                        <div style={{ width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <h4 style={{ margin: 0, color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>Makro Dağılım Özeti</h4>

                            {/* Pie Chart */}
                            <div className="glass-panel" style={{ padding: '16px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '100%', height: '160px' }}>
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Protein', value: macros.protein || 1 },
                                                    { name: 'Karbonhidrat', value: macros.carbs || 1 },
                                                    { name: 'Yağ', value: macros.fats || 1 },
                                                ]}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={45}
                                                outerRadius={65}
                                                paddingAngle={4}
                                                dataKey="value"
                                            >
                                                {COLORS.map((color, index) => (
                                                    <Cell key={`cell-${index}`} fill={color} />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                {/* Legend */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%', marginTop: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#6366f1' }}></div>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Protein</span>
                                        <span style={{ marginLeft: 'auto', color: '#fff', fontWeight: 600 }}>{macros.protein}g</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }}></div>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Karbonhidrat</span>
                                        <span style={{ marginLeft: 'auto', color: '#fff', fontWeight: 600 }}>{macros.carbs}g</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.78rem' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f59e0b' }}></div>
                                        <span style={{ color: 'rgba(255,255,255,0.7)' }}>Yağ</span>
                                        <span style={{ marginLeft: 'auto', color: '#fff', fontWeight: 600 }}>{macros.fats}g</span>
                                    </div>
                                </div>

                                <div style={{
                                    marginTop: '12px',
                                    paddingTop: '12px',
                                    borderTop: '1px solid rgba(255,255,255,0.08)',
                                    width: '100%',
                                    textAlign: 'center',
                                }}>
                                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '4px' }}>Günlük Hedef</div>
                                    <div style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 800 }}>{macros.calories} <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'rgba(255,255,255,0.5)' }}>Cal</span></div>
                                </div>
                            </div>

                            {/* AI Note */}
                            <div style={{
                                padding: '12px',
                                background: 'rgba(99,102,241,0.08)',
                                borderRadius: '10px',
                                border: '1px solid rgba(99,102,241,0.15)',
                            }}>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', lineHeight: '1.5' }}>
                                    * Makro değerleri Mistral AI tarafından otomatik tahmin edilmektedir.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
