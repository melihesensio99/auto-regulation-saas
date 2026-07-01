import React, { useMemo } from 'react';
import type { AthleteDietProgram } from '@/features/dashboard/types';
import { AthleteNutritionTrackerSection } from './AthleteNutritionTrackerSection';
import { Sunrise, Coffee, Sun, Apple, Moon, UtensilsCrossed, Utensils } from 'lucide-react';

interface AthleteDietSectionProps {
    program: AthleteDietProgram | undefined;
    targetCalories: number;
    calories: string;
    onCaloriesChange: (value: string) => void;
    notes: string;
    onNotesChange: (value: string) => void;
}

const getMealAccent = (value: string) => {
    switch (value.trim().toLowerCase()) {
        case 'breakfast': return 'from-amber-400/15 to-orange-400/5 border-amber-400/20 text-amber-300';
        case 'morning snack': return 'from-sky-400/15 to-cyan-400/5 border-sky-400/20 text-sky-300';
        case 'lunch': return 'from-emerald-400/15 to-green-400/5 border-emerald-400/20 text-emerald-300';
        case 'afternoon snack': return 'from-pink-400/15 to-fuchsia-400/5 border-pink-400/20 text-pink-300';
        case 'dinner': return 'from-violet-400/15 to-purple-400/5 border-violet-400/20 text-violet-300';
        case 'evening snack': return 'from-indigo-400/15 to-blue-400/5 border-indigo-400/20 text-indigo-300';
        default: return 'from-white/10 to-white/5 border-white/10 text-neon-purple';
    }
};

const getMealIcon = (value: string) => {
    switch (value.trim().toLowerCase()) {
        case 'breakfast': return Sunrise;
        case 'morning snack': return Apple;
        case 'lunch': return Sun;
        case 'afternoon snack': return Coffee;
        case 'dinner': return UtensilsCrossed;
        case 'evening snack': return Moon;
        default: return Utensils;
    }
};

const splitMealItems = (value: string) => value.split(/\r?\n|,/).map(item => item.trim()).filter(Boolean);
const splitMealNotes = (value?: string) => (value ?? '').split('|').map(item => item.trim()).filter(Boolean);

export const AthleteDietSection = ({ 
    program,
    targetCalories,
    calories,
    onCaloriesChange,
    notes,
    onNotesChange
}: AthleteDietSectionProps) => {

    const handleAddCalories = (addedCals: number, addedFoods: string[]) => {
        const currentCals = Number(calories) || 0;
        onCaloriesChange((currentCals + addedCals).toString());
    };

    const groupedMeals = useMemo(() => {
        if (!program?.meals || !Array.isArray(program.meals)) {
            return [];
        }

        const groups = new Map<string, { mealName: string; order: number; foods: string[]; notes: string[]; }>();

        program.meals.forEach((meal: any, index: number) => {
            const normalizedName = (meal?.mealName || 'Unknown Meal').trim();
            const key = normalizedName.toLowerCase();
            const existing = groups.get(key);

            if (!existing) {
                groups.set(key, {
                    mealName: normalizedName,
                    order: meal?.order || index + 1,
                    foods: splitMealItems(meal?.foods || ''),
                    notes: splitMealNotes(meal?.notes),
                });
                return;
            }

            groups.set(key, {
                ...existing,
                foods: [...existing.foods, ...splitMealItems(meal?.foods || '')],
                notes: [...existing.notes, ...splitMealNotes(meal?.notes)],
            });
        });

        return Array.from(groups.values()).sort((left, right) => left.order - right.order);
    }, [program]);

    if (!program || program.meals.length === 0) {
        return (
            <div className="grid min-h-[280px] place-items-center glass-panel p-8 text-center text-white/52">
                <div>
                    <div className="text-4xl text-neon-purple/50">∅</div>
                    <p className="mt-4 text-base">Koçun henüz bir beslenme programı atamamış.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <AthleteNutritionTrackerSection 
                targetCalories={targetCalories}
                currentCalories={Number(calories) || 0}
                onAddCalories={handleAddCalories}
            />

            <div className="glass-panel p-6 flex items-center justify-between border-l-2 border-neon-purple">
                <div>
                    <h3 className="text-xl font-bold">Diet Program Macros</h3>
                    <p className="text-sm text-gray-400">Günlük planın toplam makro değerleri.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                {[
                    {
                        label: 'Plan Calories',
                        helper: 'Current meal total',
                        value: `${program?.totalCalories ?? 0} kcal`,
                        color: 'text-white',
                        ring: 'from-white/10 to-white/5 border-white/10',
                    },
                    {
                        label: 'AI Protein',
                        helper: 'Muscle support',
                        value: `${program?.totalProtein ?? 0}g`,
                        color: 'text-neon-cyan',
                        ring: 'from-neon-cyan/15 to-cyan-400/5 border-neon-cyan/20',
                    },
                    {
                        label: 'AI Carbs',
                        helper: 'Energy pool',
                        value: `${program?.totalCarbs ?? 0}g`,
                        color: 'text-neon-purple',
                        ring: 'from-neon-purple/15 to-fuchsia-400/5 border-neon-purple/20',
                    },
                    {
                        label: 'AI Fats',
                        helper: 'Recovery balance',
                        value: `${program?.totalFats ?? 0}g`,
                        color: 'text-yellow-400',
                        ring: 'from-yellow-400/15 to-amber-400/5 border-yellow-400/20',
                    },
                ].map((m, i) => (
                    <div key={i} className={`glass-panel bg-gradient-to-br ${m.ring} p-5 relative overflow-hidden group min-h-[128px]`}>
                        <div className="relative z-10 flex h-full flex-col justify-between">
                            <div>
                                <p className="text-[11px] uppercase tracking-[0.24em] text-gray-400">{m.label}</p>
                                <p className={`text-3xl font-bold mt-3 ${m.color}`}>{m.value}</p>
                            </div>
                            <p className="text-sm text-gray-500 mt-4">{m.helper}</p>
                        </div>
                    </div>
                ))}
            </div>

            {program.generalDietNotes && (
                <div className="glass-panel p-6 border-l-2 border-neon-cyan">
                    <h3 className="text-lg font-semibold mb-2 text-white">Genel Notlar</h3>
                    <p className="text-sm text-gray-300 whitespace-pre-wrap">{program.generalDietNotes}</p>
                </div>
            )}

            <div className="glass-panel p-6 border-l-2 border-neon-cyan mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Öğün Planı</h3>
                </div>
                
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                    {groupedMeals.map((meal, index) => (
                        <div key={`${meal.mealName}-${index}`} className={`bg-gradient-to-br ${getMealAccent(meal.mealName)} border rounded-2xl p-5 flex flex-col min-h-[220px]`}>
                            <h4 className="font-bold text-neon-purple mb-4 flex items-center justify-between gap-3">
                                <span className="flex items-center gap-3 text-lg">
                                    {React.createElement(getMealIcon(meal.mealName), {
                                        className: 'h-4.5 w-4.5 text-current'
                                    })}
                                    <span>{meal.mealName}</span>
                                </span>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-gray-400 bg-black/30 px-2 py-1 rounded-full">
                                        {meal.foods.length} {meal.foods.length === 1 ? 'item' : 'items'}
                                    </span>
                                    <span className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded-full">Meal {meal.order || index + 1}</span>
                                </div>
                            </h4>
                            <div className="space-y-2.5 flex-1">
                                {meal.foods.map((food, foodIndex) => (
                                    <div key={`${meal.mealName}-${foodIndex}`} className="flex items-start gap-3 text-sm text-gray-200 bg-black/10 rounded-xl px-3 py-2">
                                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-neon-cyan shrink-0" />
                                        <span>{food}</span>
                                    </div>
                                ))}
                            </div>
                            {meal.notes.length > 0 && (
                                <div className="mt-5 pt-4 border-t border-white/5 space-y-2">
                                    <p className="text-[11px] uppercase tracking-[0.24em] text-gray-500">Notes</p>
                                    {meal.notes.map((note, noteIndex) => (
                                        <p key={`${meal.mealName}-note-${noteIndex}`} className="text-xs text-gray-300 italic bg-black/10 rounded-lg px-3 py-2">
                                            {note}
                                        </p>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
