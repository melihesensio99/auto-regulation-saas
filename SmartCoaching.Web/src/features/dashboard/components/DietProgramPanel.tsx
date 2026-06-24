import { useState } from 'react';
import { useDietProgram, useAssignDietProgram } from '../hooks/useDashboard';
import type { DietMealDto } from '../types';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

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

    if (isLoading) return <div style={{ color: 'white', padding: '20px' }}>Beslenme programı yükleniyor...</div>;

    const hasProgram = program && program.meals.length > 0;

    const COLORS = ['#6366f1', '#10b981', '#f59e0b']; // Protein, Carbs, Fats

    return (
        <div className="glass-panel" style={{ padding: '30px', display: 'flex', flexDirection: 'column', gap: '25px', overflowY: 'auto', maxHeight: '100%' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ margin: 0, color: 'white', fontSize: '1.5rem' }}>🥗 Beslenme Programı</h2>
                {!isEditing && (
                    <button onClick={startEditing} className="btn-primary">
                        {hasProgram ? '✏️ Programı Düzenle' : '➕ Yeni Program Ata'}
                    </button>
                )}
            </div>

            {isEditing ? (
                // EDIT MODE
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <div className="glass-panel" style={{ padding: '20px', background: 'rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 15px 0', color: 'var(--primary-color)' }}>Genel Notlar / Antrenman Öncesi-Sonrası</h3>
                        <textarea 
                            value={generalNotes}
                            onChange={(e) => setGeneralNotes(e.target.value)}
                            placeholder="Öğünler arası ortalama 2-3 saat. Antrenmandan 1.5 saat önce..."
                            style={{
                                width: '100%',
                                minHeight: '80px',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '8px',
                                color: 'white',
                                padding: '12px'
                            }}
                        />
                    </div>

                    {meals.map((meal, index) => (
                        <div key={index} className="glass-panel" style={{ padding: '20px', position: 'relative' }}>
                            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
                                <input 
                                    type="text" 
                                    value={meal.mealName}
                                    onChange={(e) => handleChangeMeal(index, 'mealName', e.target.value)}
                                    placeholder="Örn: Kahvaltı veya 1. Öğün"
                                    style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'white', fontWeight: 'bold' }}
                                />
                                <button onClick={() => handleRemoveMeal(index)} style={{ background: 'var(--danger-color)', color: 'white', border: 'none', padding: '10px 15px', borderRadius: '8px', cursor: 'pointer' }}>
                                    Sil
                                </button>
                            </div>
                            
                            <textarea 
                                value={meal.foods}
                                onChange={(e) => handleChangeMeal(index, 'foods', e.target.value)}
                                placeholder="150 Gr Pirinç Unu&#10;8 Yumurta Beyazı&#10;50 Gr Muz"
                                style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '12px', borderRadius: '8px', color: 'white', marginBottom: '10px' }}
                            />
                            
                            <input 
                                type="text" 
                                value={meal.notes}
                                onChange={(e) => handleChangeMeal(index, 'notes', e.target.value)}
                                placeholder="Öğün için ekstra not (Opsiyonel)"
                                style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px', borderRadius: '8px', color: 'var(--text-secondary)' }}
                            />
                        </div>
                    ))}

                    <button onClick={handleAddMeal} className="btn-secondary" style={{ padding: '15px', borderStyle: 'dashed' }}>
                        ➕ Yeni Öğün Ekle
                    </button>

                    <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
                        <button onClick={handleSave} className="btn-primary" style={{ flex: 1, padding: '15px', fontSize: '1.1rem' }} disabled={assignDiet.isPending}>
                            {assignDiet.isPending ? 'Kaydediliyor...' : '💾 Programı Kaydet (AI Makro Analizi Başlat)'}
                        </button>
                        <button onClick={() => setIsEditing(false)} className="btn-secondary" style={{ padding: '15px' }}>
                            İptal
                        </button>
                    </div>
                </div>
            ) : !hasProgram ? (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
                    Bu sporcuya henüz bir beslenme programı atanmamış.
                </div>
            ) : (
                // VIEW MODE
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    
                    {/* TOP STATS & PIE CHART */}
                    <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
                        {/* Daily Total Summary */}
                        <div className="glass-panel" style={{ flex: 1, padding: '20px', minWidth: '300px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                            <h3 style={{ margin: '0 0 15px 0', color: 'var(--text-secondary)' }}>Günlük Toplam Hedef</h3>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>Protein:</span>
                                <span>{program.meals.reduce((acc, m) => acc + m.protein, 0)} gr</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: 'var(--success-color)', fontWeight: 'bold' }}>Karbonhidrat:</span>
                                <span>{program.meals.reduce((acc, m) => acc + m.carbs, 0)} gr</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ color: 'var(--warning-color)', fontWeight: 'bold' }}>Yağ:</span>
                                <span>{program.meals.reduce((acc, m) => acc + m.fats, 0)} gr</span>
                            </div>
                            <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.1)', margin: '10px 0' }} />
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                <span>Toplam Kalori:</span>
                                <span>{program.meals.reduce((acc, m) => acc + m.calories, 0)} kcal</span>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '10px', fontStyle: 'italic' }}>* Makro değerleri Mistral AI tarafından otomatik tahmin edilmektedir.</p>
                        </div>

                        {/* Pie Chart */}
                        <div className="glass-panel" style={{ flex: 1, padding: '20px', minWidth: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--text-secondary)' }}>Makro Dağılımı</h3>
                            <div style={{ width: '100%', height: '200px' }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={[
                                                { name: 'Protein', value: program.meals.reduce((acc, m) => acc + m.protein, 0) },
                                                { name: 'Karbonhidrat', value: program.meals.reduce((acc, m) => acc + m.carbs, 0) },
                                                { name: 'Yağ', value: program.meals.reduce((acc, m) => acc + m.fats, 0) }
                                            ]}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {COLORS.map((color, index) => (
                                                <Cell key={`cell-${index}`} fill={color} />
                                            ))}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                            itemStyle={{ color: 'white' }}
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* GENERAL NOTES */}
                    {program.generalDietNotes && (
                        <div className="glass-panel" style={{ padding: '20px', background: 'rgba(99, 102, 241, 0.05)', borderLeft: '4px solid var(--primary-color)' }}>
                            <h3 style={{ margin: '0 0 10px 0', color: 'var(--primary-color)', fontSize: '1.1rem' }}>Genel Notlar</h3>
                            <div style={{ whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.9)', lineHeight: '1.6' }}>
                                {program.generalDietNotes}
                            </div>
                        </div>
                    )}

                    {/* MEALS LIST */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
                        {program.meals.map(meal => (
                            <div key={meal.id} className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ margin: '0 0 15px 0', color: 'white', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '10px' }}>
                                    {meal.mealName}
                                </h3>
                                
                                <div style={{ flex: 1, whiteSpace: 'pre-wrap', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', marginBottom: '15px' }}>
                                    {meal.foods}
                                </div>

                                {meal.notes && (
                                    <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '15px' }}>
                                        {meal.notes}
                                    </div>
                                )}

                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-secondary)', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '10px' }}>
                                    <span>P: {meal.protein}g</span>
                                    <span>K: {meal.carbs}g</span>
                                    <span>Y: {meal.fats}g</span>
                                    <span style={{ color: 'white', fontWeight: 'bold' }}>{meal.calories} kcal</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </div>
    );
};
