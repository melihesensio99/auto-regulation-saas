import { useMemo, useState } from 'react';
import type { WorkoutExerciseResponse } from '@/features/dashboard/types';
import { Layers, Repeat, Timer, Dumbbell } from 'lucide-react';

interface AthleteWorkoutSectionProps {
    exercises: WorkoutExerciseResponse[] | undefined;
}

type WorkoutDayGroup = {
    dayName: string;
    exercises: WorkoutExerciseResponse[];
};

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const normalizeDay = (dayName: string) => {
    const d = dayName
        .replace('Pazartesi', 'Monday')
        .replace('Salı', 'Tuesday')
        .replace('Sali', 'Tuesday')
        .replace('Çarşamba', 'Wednesday')
        .replace('Carsamba', 'Wednesday')
        .replace('Perşembe', 'Thursday')
        .replace('Persembe', 'Thursday')
        .replace('Cuma', 'Friday')
        .replace('Cumartesi', 'Saturday')
        .replace('Pazar', 'Sunday');
    return d;
};

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
                const existing = groups.find((group) => normalizeDay(group.dayName) === normalizeDay(exercise.dayName));

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

    const [activeDay, setActiveDay] = useState<string | null>(workoutDays[0]?.dayName ? normalizeDay(workoutDays[0].dayName) : null);
    const selectedDay = workoutDays.find((day) => normalizeDay(day.dayName) === activeDay) ?? workoutDays[0];

    if (!workoutDays.length) {
        return (
            <div className="grid min-h-[280px] place-items-center glass-panel p-8 text-center text-white/52">
                <div>
                    <div className="text-4xl text-neon-cyan/50">∅</div>
                    <p className="mt-4 text-base">Koçun henüz bir antrenman programı atamamış.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <section className="glass-panel p-6 border-l-2 border-neon-cyan">
                <div className="flex flex-col gap-5 border-b border-white/10 pb-5 xl:flex-row xl:items-end xl:justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white">Antrenman Programı</h3>
                        <p className="mt-2 text-sm text-gray-400">Günü seç, hareketleri tek odakta incele.</p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
                            {workoutDays.length} aktif gün
                        </span>
                        <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-lg text-sm text-gray-300">
                            {exercises?.length ?? 0} egzersiz
                        </span>
                    </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                    {workoutDays.map((day) => {
                        const normDay = normalizeDay(day.dayName);
                        return (
                        <button
                            key={normDay}
                            type="button"
                            className={`px-5 py-2.5 text-sm font-medium transition-all duration-300 rounded-lg border ${
                                activeDay === normDay
                                    ? 'bg-neon-cyan/20 border-neon-cyan text-white shadow-[0_0_15px_rgba(34,211,238,0.3)]'
                                    : 'bg-black/40 border-white/10 text-gray-400 hover:bg-white/5 hover:text-white hover:border-white/20'
                            }`}
                            onClick={() => setActiveDay(normDay)}
                        >
                            {normDay}
                        </button>
                    )})}
                </div>
            </section>

            {selectedDay && (
                <section className="glass-panel p-6">
                    <div className="flex flex-col gap-4 border-b border-white/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-neon-cyan">Seçili Gün</span>
                            <h3 className="mt-2 text-2xl font-bold text-white">{normalizeDay(selectedDay.dayName)}</h3>
                        </div>
                        <span className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-4 py-2 rounded-lg text-sm font-semibold">
                            {selectedDay.exercises.length} hareket
                        </span>
                    </div>

                    <div className="mt-6 space-y-4">
                        {selectedDay.exercises.map((exercise) => {
                            const mediaUrl = toCloudinaryUrl(exercise.gifUrl ?? exercise.imageUrl);

                            return (
                                <article
                                    key={exercise.id}
                                    className="glass-panel p-4 flex flex-col gap-4 border border-white/5 hover:border-neon-cyan/30 transition-colors group"
                                >
                                    <div className="flex gap-4">
                                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-lg bg-black/40 overflow-hidden shrink-0 border border-white/10 flex items-center justify-center">
                                            {mediaUrl ? (
                                                <img 
                                                    src={mediaUrl} 
                                                    alt={exercise.exerciseName} 
                                                    className="w-full h-full object-cover mix-blend-screen opacity-80 group-hover:opacity-100 transition-opacity" 
                                                    onError={(e) => {
                                                        e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(exercise.exerciseName)}&background=121212&color=00f0ff&size=200`;
                                                        e.currentTarget.style.mixBlendMode = 'normal';
                                                    }}
                                                />
                                            ) : (
                                                <Dumbbell className="w-8 h-8 text-gray-500" />
                                            )}
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h4 className="text-lg font-bold text-white mb-1 group-hover:text-neon-cyan transition-colors capitalize">{exercise.exerciseName}</h4>
                                            {exercise.targetMuscle && (
                                                <p className="text-xs text-gray-400 mb-3 capitalize tracking-wider">
                                                    <span className="text-neon-cyan/70 font-semibold mr-1">Target Muscle:</span>
                                                    {exercise.targetMuscle}
                                                </p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-3 mt-1">
                                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300 shadow-inner">
                                                    <Layers className="w-4 h-4 text-gray-500" />
                                                    <span className="text-white font-bold">{exercise.sets}</span> 
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">SETS</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300 shadow-inner">
                                                    <Repeat className="w-4 h-4 text-gray-500" />
                                                    <span className="text-white font-bold">{exercise.reps}</span> 
                                                    <span className="text-xs text-gray-500 uppercase tracking-wider">REPS</span>
                                                </div>
                                                <div className="flex items-center gap-1.5 bg-neon-cyan/10 border border-neon-cyan/20 px-3 py-1.5 rounded-lg text-sm shadow-inner">
                                                    <Timer className="w-4 h-4 text-neon-cyan" />
                                                    <span className="text-neon-cyan font-bold">{exercise.restTimeInSeconds}s</span> 
                                                    <span className="text-xs text-neon-cyan/70 uppercase tracking-wider">REST</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {exercise.notes && (
                                        <div className="mt-2 bg-white/5 border border-white/10 rounded-lg p-3 text-sm text-gray-400">
                                            <strong className="text-gray-300">Not: </strong> {exercise.notes}
                                        </div>
                                    )}

                                    {exercise.instructions && (
                                        <div className="bg-gradient-to-br from-white/5 to-transparent p-5 rounded-xl border border-white/10 mt-2 relative overflow-hidden shadow-lg">
                                            <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
                                            <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                                <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                                                INSTRUCTIONS
                                            </h5>
                                            <p className="text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
                                                {exercise.instructions}
                                            </p>
                                        </div>
                                    )}
                                </article>
                            );
                        })}
                    </div>
                </section>
            )}
        </div>
    );
};
