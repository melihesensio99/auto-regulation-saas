import React, { useState, useEffect } from 'react';
import { X, Plus, Utensils, Save, Edit2, Trash2 } from 'lucide-react';
import { coachService, type DietMealDto } from '../services/coachService';

interface DietProgramModalProps {
    athleteId: string;
    onClose: () => void;
    onSaved: () => void;
}

export const DietProgramModal: React.FC<DietProgramModalProps> = ({ athleteId, onClose, onSaved }) => {
    const [meals, setMeals] = useState<DietMealDto[]>([]);
    const [generalNotes, setGeneralNotes] = useState('');
    
    const [mealName, setMealName] = useState('Breakfast');
    const [foods, setFoods] = useState('');
    const [notes, setNotes] = useState('');
    
    const [isSaving, setIsSaving] = useState(false);

    const splitMealItems = (value: string) =>
        value
            .split(/\r?\n|,/)
            .map(item => item.trim())
            .filter(Boolean);

    const splitMealNotes = (value?: string) =>
        (value ?? '')
            .split('|')
            .map(item => item.trim())
            .filter(Boolean);

    const getMealAccent = (value: string) => {
        switch (value.trim().toLowerCase()) {
            case 'breakfast':
                return 'from-amber-400/20 to-orange-400/10 border-amber-400/20 text-amber-300';
            case 'morning snack':
                return 'from-sky-400/20 to-cyan-400/10 border-sky-400/20 text-sky-300';
            case 'lunch':
                return 'from-emerald-400/20 to-green-400/10 border-emerald-400/20 text-emerald-300';
            case 'afternoon snack':
                return 'from-pink-400/20 to-fuchsia-400/10 border-pink-400/20 text-pink-300';
            case 'dinner':
                return 'from-violet-400/20 to-purple-400/10 border-violet-400/20 text-violet-300';
            case 'evening snack':
                return 'from-indigo-400/20 to-blue-400/10 border-indigo-400/20 text-indigo-300';
            default:
                return 'from-white/10 to-white/5 border-white/10 text-neon-purple';
        }
    };

    const normalizeMeals = (incomingMeals: DietMealDto[]) => {
        const groupedMeals = new Map<string, DietMealDto>();

        incomingMeals.forEach((meal) => {
            const key = meal.mealName.trim().toLowerCase();
            const existingMeal = groupedMeals.get(key);

            if (!existingMeal) {
                groupedMeals.set(key, {
                    ...meal,
                    mealName: meal.mealName.trim(),
                    foods: meal.foods.trim(),
                    notes: meal.notes?.trim() ?? '',
                });
                return;
            }

            const mergedFoods = [existingMeal.foods, meal.foods]
                .map(value => value?.trim())
                .filter(Boolean)
                .join('\n');

            const mergedNotes = [existingMeal.notes, meal.notes]
                .map(value => value?.trim())
                .filter(Boolean)
                .join(' | ');

            groupedMeals.set(key, {
                ...existingMeal,
                foods: mergedFoods,
                notes: mergedNotes,
            });
        });

        return Array.from(groupedMeals.values()).map((meal, index) => ({
            ...meal,
            order: index + 1,
        }));
    };

    useEffect(() => {
        let isMounted = true;
        const fetchExisting = async () => {
            try {
                const program = await coachService.getAthleteDietProgram(athleteId);
                if (isMounted && program && Array.isArray(program.meals)) {
                    setMeals(normalizeMeals(program.meals));
                    setGeneralNotes(program.generalDietNotes || '');
                }
            } catch (error) {
                console.error("Failed to load existing program", error);
            }
        };
        fetchExisting();
        return () => { isMounted = false; };
    }, [athleteId]);

    const handleAddMeal = () => {
        if (!foods) return;

        const updatedMeals = normalizeMeals([
            ...meals,
            {
                order: meals.length + 1,
                mealName,
                foods,
                notes
            }
        ]);

        setMeals(updatedMeals);
        
        // Reset form
        setFoods('');
        setNotes('');
    };

    const handleEditMeal = (index: number) => {
        const meal = meals[index];
        setMealName(meal.mealName);
        setFoods(meal.foods);
        setNotes(meal.notes || '');
        setMeals(meals.filter((_, i) => i !== index));
    };

    const handleDeleteMeal = (index: number) => {
        const remainingMeals = meals.filter((_, i) => i !== index).map((meal, mealIndex) => ({
            ...meal,
            order: mealIndex + 1,
        }));
        setMeals(remainingMeals);
    };

    const handleSaveProgram = async () => {
        if (meals.length === 0) return;
        setIsSaving(true);
        try {
            await coachService.assignDietProgram(athleteId, normalizeMeals(meals), generalNotes);
            onSaved();
        } catch (error) {
            console.error("Failed to save program", error);
            alert("Failed to save program");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-4xl max-h-[90vh] flex flex-col border border-neon-purple/30 shadow-[0_0_30px_rgba(157,0,255,0.15)] rounded-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                    <div className="flex items-center gap-3">
                        <Utensils className="w-6 h-6 text-neon-purple" />
                        <h2 className="text-2xl font-bold text-white">Create Diet Program</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                        <X className="w-5 h-5 text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex-1 space-y-6">
                        <h3 className="text-lg font-semibold text-neon-purple border-b border-white/10 pb-2">Add Meal</h3>
                        
                        <div className="grid grid-cols-1 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Meal Name</label>
                                <select 
                                    value={mealName} 
                                    onChange={e => setMealName(e.target.value)} 
                                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-purple appearance-none"
                                >
                                    <option value="Breakfast">Breakfast</option>
                                    <option value="Morning Snack">Morning Snack</option>
                                    <option value="Lunch">Lunch</option>
                                    <option value="Afternoon Snack">Afternoon Snack</option>
                                    <option value="Dinner">Dinner</option>
                                    <option value="Evening Snack">Evening Snack</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Foods (comma separated)</label>
                            <textarea 
                                value={foods} 
                                onChange={e => setFoods(e.target.value)} 
                                placeholder="e.g. 100g Oats, 2 Eggs, 1 Banana"
                                rows={2}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-purple resize-none" 
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Notes (Optional)</label>
                            <input 
                                type="text" 
                                value={notes} 
                                onChange={e => setNotes(e.target.value)} 
                                placeholder="e.g. Drink 1 glass of water before meal"
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white outline-none focus:border-neon-purple" 
                            />
                        </div>

                        <button 
                            onClick={handleAddMeal}
                            disabled={!foods}
                            className={`w-full py-3 rounded-lg flex items-center justify-center gap-2 transition-all ${
                                foods 
                                ? 'bg-white/10 hover:bg-neon-purple/20 text-white hover:text-neon-purple border border-white/10 hover:border-neon-purple' 
                                : 'bg-white/5 text-gray-500 cursor-not-allowed'
                            }`}
                        >
                            <Plus className="w-4 h-4" />
                            Add Meal
                        </button>
                    </div>

                    <div className="flex-1 bg-black/20 rounded-xl p-4 border border-white/5 flex flex-col">
                        <h3 className="text-lg font-semibold text-gray-300 mb-4">Meal Plan Preview</h3>
                        <div className="flex-1 overflow-y-auto space-y-3">
                            {meals.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-gray-500">
                                    <p>No meals added yet.</p>
                                </div>
                            ) : (
                                meals.map((m, i) => (
                                    <div key={i} className={`bg-gradient-to-br ${getMealAccent(m.mealName)} p-3 rounded-lg border group`}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-bold text-neon-purple">{m.mealName}</span>
                                            <div className="flex items-center gap-2">
                                                <span className="text-[11px] text-gray-400 bg-black/30 px-2 py-1 rounded-full">
                                                    {splitMealItems(m.foods).length} {splitMealItems(m.foods).length === 1 ? 'item' : 'items'}
                                                </span>
                                                <span className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded-full">Meal {m.order || i + 1}</span>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            {splitMealItems(m.foods).map((food, foodIndex) => (
                                                <div key={`${m.mealName}-${foodIndex}`} className="flex items-start gap-2 text-sm text-gray-300">
                                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neon-cyan shrink-0" />
                                                    <span>{food}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity mt-3">
                                            <button onClick={() => handleEditMeal(i)} className="p-1 hover:bg-white/10 rounded text-gray-400 hover:text-white" title="Edit">
                                                <Edit2 className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => handleDeleteMeal(i)} className="p-1 hover:bg-red-500/20 rounded text-gray-400 hover:text-red-400" title="Delete">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        {splitMealNotes(m.notes).length > 0 && (
                                            <div className="mt-4 pt-4 border-t border-white/5 space-y-1.5">
                                                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Notes</p>
                                                {splitMealNotes(m.notes).map((note, noteIndex) => (
                                                    <p key={`${m.mealName}-note-${noteIndex}`} className="text-xs text-gray-400 italic">
                                                        {note}
                                                    </p>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-white/10 bg-black/40 flex justify-end gap-3">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors">
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveProgram}
                        disabled={meals.length === 0 || isSaving}
                        className={`glow-btn flex items-center gap-2 px-8 py-2 ${meals.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {isSaving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Program</>}
                    </button>
                </div>
            </div>
        </div>
    );
};
