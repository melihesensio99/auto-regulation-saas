import React, { useState } from 'react';
import { User, Dumbbell, Utensils, BarChart3, ClipboardList, Plus, Edit2, Timer, Repeat, Layers } from 'lucide-react';
import { coachService, type AthleteDto } from '../services/coachService';
import { WorkoutProgramModal } from './WorkoutProgramModal';
import { DietProgramModal } from './DietProgramModal';

export const AthleteProfile: React.FC<{ athleteId?: string }> = ({ athleteId }) => {
    const [activeTab, setActiveTab] = useState('workout');
    const [athlete, setAthlete] = useState<AthleteDto | null>(null);
    const [isLoading, setIsLoading] = useState(!!athleteId);
    
    // Modal states
    const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
    const [isDietModalOpen, setIsDietModalOpen] = useState(false);
    const [workoutProgramToEdit, setWorkoutProgramToEdit] = useState<any>(null);
    const [workoutProgramInitialDay, setWorkoutProgramInitialDay] = useState<string | undefined>();
    const [refreshWorkout, setRefreshWorkout] = useState(0);
    const [refreshDiet, setRefreshDiet] = useState(0);

    React.useEffect(() => {
        if (!athleteId) return;
        const fetchProfile = async () => {
            try {
                const data = await coachService.getAthleteById(athleteId);
                setAthlete(data);
            } catch (error) {
                console.error("Failed to fetch athlete profile", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchProfile();
    }, [athleteId]);

    if (isLoading) return <div className="text-gray-400 animate-pulse">Loading athlete profile...</div>;

    const athleteName = athlete ? `${athlete.firstName} ${athlete.lastName}` : 'Alex Mitchell';
    const mainReason = athlete?.mainReason?.toString() ?? 'Muscle Hypertrophy';
    const handleUpdateTargets = async (calories: number, steps: number) => {
        if (!athlete) return;
        try {
            await coachService.updateTargets(athlete.id, { targetCalories: calories, targetSteps: steps });
            setAthlete({ ...athlete, targetCalories: calories, targetSteps: steps });
        } catch (error) {
            console.error("Failed to update targets", error);
            alert("Failed to update targets");
        }
    };

    const CircularChart = ({ label, value, unit, colorClass, strokeColor }: { label: string, value: string | number, unit?: string, colorClass: string, strokeColor: string }) => (
        <div className="flex flex-col items-center justify-center bg-black/40 p-4 rounded-2xl border border-white/5 shadow-lg min-w-[120px]">
            <div className="relative w-20 h-20 flex items-center justify-center mb-3 drop-shadow-xl">
                {/* Background Ring */}
                <svg className="absolute w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                        className="text-white/10"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    {/* Foreground Ring - 100% full since it represents the target itself */}
                    <path
                        className={strokeColor}
                        strokeDasharray="100, 100"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                </svg>
                <div className="flex flex-col items-center justify-center relative z-10">
                    <span className={`text-xl font-bold ${colorClass}`}>{value}</span>
                    {unit && <span className="text-xs text-gray-400 -mt-1">{unit}</span>}
                </div>
            </div>
            <span className="text-[11px] text-gray-400 font-medium uppercase tracking-wider text-center">{label}</span>
        </div>
    );

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Hero Banner */}
            <div className="glass-panel relative overflow-hidden p-8 border-t-2 border-neon-cyan/50">
                <div className="absolute top-0 right-0 w-64 h-64 bg-neon-cyan/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-neon-purple/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-6">
                        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-neon-cyan to-neon-purple p-[2px] shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0">
                            <div className="w-full h-full rounded-full bg-dark-bg flex items-center justify-center">
                                <User className="w-10 h-10 text-white" />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-3">
                                <h2 className="text-3xl font-bold glow-text">{athleteName}</h2>
                                <span className="px-3 py-1 rounded-full bg-neon-green/20 text-neon-green text-xs font-bold border border-neon-green/30">Active</span>
                            </div>
                            <p className="text-gray-400 mt-1">Goal: {mainReason}</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <CircularChart 
                            label="Target Steps" 
                            value={athlete?.targetSteps ?? 0} 
                            colorClass="text-neon-cyan" 
                            strokeColor="text-neon-cyan" 
                        />
                        <CircularChart 
                            label="Target Calories" 
                            value={athlete?.targetCalories ?? 0} 
                            unit="kcal"
                            colorClass="text-neon-purple" 
                            strokeColor="text-neon-purple" 
                        />
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="glass-panel p-2 flex items-center gap-2">
                {[
                    { id: 'workout', label: 'Workout Program', icon: Dumbbell },
                    { id: 'diet', label: 'Diet Program', icon: Utensils },
                    { id: 'progress', label: 'Progress Logs', icon: BarChart3 },
                    { id: 'info', label: 'Athlete Info (Onboarding)', icon: ClipboardList },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-all duration-300 ${
                            activeTab === tab.id 
                            ? 'bg-gradient-to-r from-neon-purple/20 to-neon-cyan/20 border border-white/10 shadow-lg text-white' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                        }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content Area */}
            <div className="mt-6">
                {activeTab === 'workout' && <WorkoutTab key={`workout-${refreshWorkout}`} athlete={athlete} onUpdateTargets={handleUpdateTargets} onOpenModal={(prog, day) => {
                    setWorkoutProgramToEdit(prog);
                    setWorkoutProgramInitialDay(day);
                    setIsWorkoutModalOpen(true);
                }} />}
                {activeTab === 'diet' && <DietTab key={`diet-${refreshDiet}`} athlete={athlete} onUpdateTargets={handleUpdateTargets} onOpenModal={() => setIsDietModalOpen(true)} />}
                {activeTab === 'progress' && <div className="glass-panel p-8 text-center text-gray-500">Progress Logs coming soon...</div>}
                {activeTab === 'info' && <AthleteInfoTab athlete={athlete} />}
            </div>

            {/* Modals */}
            {isWorkoutModalOpen && athlete && (
                <WorkoutProgramModal 
                    athleteId={athlete.id} 
                    initialExercises={workoutProgramToEdit?.exercises || []}
                    initialDay={workoutProgramInitialDay}
                    onClose={() => setIsWorkoutModalOpen(false)} 
                    onSaved={() => {
                        setIsWorkoutModalOpen(false);
                        setRefreshWorkout(prev => prev + 1);
                    }} 
                />
            )}
            
            {isDietModalOpen && athlete && (
                <DietProgramModal 
                    athleteId={athlete.id} 
                    onClose={() => setIsDietModalOpen(false)} 
                    onSaved={() => {
                        setIsDietModalOpen(false);
                        setRefreshDiet(prev => prev + 1);
                    }} 
                />
            )}

        </div>
    );
};

const WorkoutTab: React.FC<{ athlete: AthleteDto | null; onUpdateTargets: (calories: number, steps: number) => void; onOpenModal: (program?: any, initialDay?: string) => void }> = ({ athlete, onUpdateTargets, onOpenModal }) => {
    const [isEditingSteps, setIsEditingSteps] = useState(false);
    const [stepsValue, setStepsValue] = useState(athlete?.targetSteps?.toString() ?? "0");

    // Program Viewer State
    const [program, setProgram] = useState<any>(null);
    const [isLoadingProgram, setIsLoadingProgram] = useState(true);
    const [selectedDay, setSelectedDay] = useState<string>('Monday');

    React.useEffect(() => {
        if (!athlete) return;
        const fetchProgram = async () => {
            try {
                const data = await coachService.getAthleteWorkoutProgram(athlete.id);
                if (data && data.exercises && data.exercises.length > 0) {
                    setProgram(data);
                    // Select first available day by default
                    const days = Array.from(new Set(data.exercises.map((e: any) => e.dayName)));
                    if (days.length > 0) setSelectedDay(days[0] as string);
                }
            } catch (error) {
                console.error("Failed to load workout program", error);
            } finally {
                setIsLoadingProgram(false);
            }
        };
        fetchProgram();
    }, [athlete]);

    const handleSaveSteps = () => {
        const val = parseInt(stepsValue);
        if (!isNaN(val)) {
            onUpdateTargets(athlete?.targetCalories ?? 0, val);
        }
        setIsEditingSteps(false);
    };

    const toCloudinaryUrl = (url?: string | null) => {
        if (!url) return null;
        const fileName = url.split('/').pop();
        return fileName ? `https://res.cloudinary.com/dc2j01x6b/image/upload/v1/${fileName}` : null;
    };

    const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    return (
        <div className="animate-in fade-in duration-500 space-y-6">
            <div className="glass-panel p-6 flex items-center justify-between border-l-2 border-neon-cyan">
                <div>
                    <h3 className="text-xl font-bold">Target Steps</h3>
                    <p className="text-sm text-gray-400">Set daily step goal for the athlete.</p>
                </div>
                {isEditingSteps ? (
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 w-32 text-white" 
                            value={stepsValue} 
                            onChange={e => setStepsValue(e.target.value)} 
                        />
                        <button onClick={handleSaveSteps} className="glow-btn-cyan text-sm px-4 py-1">Save</button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsEditingSteps(true)} className="glow-btn text-sm px-6 py-2 flex items-center gap-2">
                            <Edit2 className="w-4 h-4" /> Edit Targets
                        </button>
                    </div>
                )}
            </div>

            {isLoadingProgram ? (
                <div className="glass-panel p-12 text-center text-gray-400 border-dashed border-2 border-white/10 flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p>Loading program...</p>
                </div>
            ) : !program ? (
                <div className="glass-panel p-12 text-center text-gray-400 border-dashed border-2 border-white/10">
                    <Dumbbell className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold text-white mb-2">No Workout Program Yet</h3>
                    <p className="max-w-md mx-auto mb-6 text-sm">
                        {athlete?.firstName} hasn't been assigned a workout routine. You can create a new block manually.
                    </p>
                    <div className="flex justify-center gap-4">
                        <button onClick={() => onOpenModal()} className="px-6 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center gap-2">
                            <Plus className="w-4 h-4" /> Create Manually
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Header Action & Day Selector */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                            {daysOrder
                                .map(day => (
                                    <button
                                        key={day}
                                        onClick={() => setSelectedDay(day)}
                                        className={`px-6 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all ${
                                            selectedDay === day 
                                            ? 'bg-neon-cyan text-black shadow-[0_0_15px_rgba(0,240,255,0.4)]' 
                                            : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/5'
                                        }`}
                                    >
                                        {day}
                                    </button>
                            ))}
                        </div>
                        <button 
                            onClick={() => onOpenModal(program, selectedDay)} 
                            className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10 flex items-center gap-2 shrink-0"
                        >
                            <Plus className="w-4 h-4" /> Update Program
                        </button>
                    </div>

                    {/* Exercises List for Selected Day */}
                    <div className="space-y-4">
                        {program.exercises.filter((e: any) => e.dayName === selectedDay).length === 0 ? (
                            <div className="glass-panel p-12 flex flex-col items-center justify-center text-center border border-white/5 shadow-lg rounded-2xl bg-black/20">
                                <div className="w-20 h-20 bg-neon-cyan/10 rounded-full flex items-center justify-center mb-4">
                                    <Dumbbell className="w-10 h-10 text-neon-cyan/50" />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">Rest Day (Off Day)</h3>
                                <p className="text-gray-400 max-w-sm">No exercises are scheduled for this day. Rest and recovery are crucial for muscle growth!</p>
                            </div>
                        ) : (
                            program.exercises
                                .filter((e: any) => e.dayName === selectedDay)
                                .map((exercise: any, idx: number) => {
                                    const mediaUrl = toCloudinaryUrl(exercise.gifUrl ?? exercise.imageUrl);
                                    return (
                                        <div key={idx} className="glass-panel p-4 flex flex-col gap-4 border border-white/5 hover:border-neon-cyan/30 transition-colors group">
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
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider">Sets</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-3 py-1.5 rounded-lg text-sm text-gray-300 shadow-inner">
                                                            <Repeat className="w-4 h-4 text-gray-500" />
                                                            <span className="text-white font-bold">{exercise.reps}</span> 
                                                            <span className="text-xs text-gray-500 uppercase tracking-wider">Reps</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 bg-neon-cyan/10 border border-neon-cyan/20 px-3 py-1.5 rounded-lg text-sm shadow-inner">
                                                            <Timer className="w-4 h-4 text-neon-cyan" />
                                                            <span className="text-neon-cyan font-bold">{exercise.restTimeInSeconds}s</span> 
                                                            <span className="text-xs text-neon-cyan/70 uppercase tracking-wider">Rest</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            {exercise.instructions && (
                                                <div className="bg-gradient-to-br from-white/5 to-transparent p-5 rounded-xl border border-white/10 mt-2 relative overflow-hidden shadow-lg">
                                                    <div className="absolute top-0 left-0 w-1 h-full bg-neon-cyan"></div>
                                                    <h5 className="text-xs font-bold text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                                                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan"></span>
                                                        Instructions
                                                    </h5>
                                                    <p className="text-sm text-gray-300 leading-relaxed max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent pr-2">
                                                        {exercise.instructions}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

const DietTab: React.FC<{ athlete: AthleteDto | null; onUpdateTargets: (calories: number, steps: number) => void; onOpenModal: () => void }> = ({ athlete, onUpdateTargets, onOpenModal }) => {
    const [isEditingCalories, setIsEditingCalories] = useState(false);
    const [caloriesValue, setCaloriesValue] = useState(athlete?.targetCalories?.toString() ?? "0");
    const [program, setProgram] = useState<any>(null);
    const [isLoadingProgram, setIsLoadingProgram] = useState(false);

    const [isRefreshingAI, setIsRefreshingAI] = useState(false);

    React.useEffect(() => {
        const fetchProgram = async () => {
            if (!athlete) return;
            setIsLoadingProgram(true);
            try {
                const data = await coachService.getAthleteDietProgram(athlete.id);
                setProgram(data);
            } catch (error) {
                console.error("Failed to fetch diet program", error);
            } finally {
                setIsLoadingProgram(false);
            }
        };
        fetchProgram();
    }, [athlete]);

    const handleRefreshAI = async () => {
        if (!athlete) return;
        setIsRefreshingAI(true);
        try {
            const data = await coachService.getAthleteDietProgram(athlete.id);
            setProgram(data);
        } catch (error) {
            console.error("Failed to refresh diet program", error);
        } finally {
            setIsRefreshingAI(false);
        }
    };

    const handleSaveCalories = () => {
        const val = parseInt(caloriesValue);
        if (!isNaN(val)) {
            onUpdateTargets(val, athlete?.targetSteps ?? 0);
        }
        setIsEditingCalories(false);
    };

    const hasMeals = program && Array.isArray(program.meals) && program.meals.length > 0;

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="glass-panel p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between border-l-2 border-neon-purple">
                <div>
                    <h3 className="text-xl font-bold">Diet Program Macros</h3>
                    <p className="text-sm text-gray-400">Target calories vs Mistral AI calculated macros.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                    {isEditingCalories ? (
                        <div className="flex gap-2">
                            <input 
                                type="number" 
                                className="bg-black/50 border border-white/10 rounded-lg px-3 py-1 w-32 text-white" 
                                value={caloriesValue} 
                                onChange={e => setCaloriesValue(e.target.value)} 
                            />
                            <button onClick={handleSaveCalories} className="glow-btn text-sm px-4 py-1">Save</button>
                        </div>
                    ) : (
                        <button onClick={() => setIsEditingCalories(true)} className="glow-btn flex items-center gap-2 text-sm px-4 py-2">
                            <Edit2 className="w-4 h-4" /> Edit Target
                        </button>
                    )}
                    <button 
                        onClick={handleRefreshAI} 
                        className="glow-btn-cyan flex items-center gap-2 text-sm px-4 py-2"
                        disabled={isRefreshingAI}
                    >
                        <Repeat className={`w-4 h-4 ${isRefreshingAI ? 'animate-spin' : ''}`} /> 
                        Refresh AI
                    </button>
                </div>
            </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
                { label: 'Target Calories', value: `${athlete?.targetCalories ?? 0} kcal`, color: 'text-white' },
                { label: 'AI Protein', value: `${program?.totalProtein ?? 0}g`, color: 'text-neon-cyan' },
                { label: 'AI Carbs', value: `${program?.totalCarbs ?? 0}g`, color: 'text-neon-purple' },
                { label: 'AI Fats', value: `${program?.totalFats ?? 0}g`, color: 'text-yellow-400' },
            ].map((m, i) => (
                <div key={i} className="glass-panel p-4 text-center relative overflow-hidden group">
                    {(program?.totalProtein === 0 && hasMeals && m.label !== 'Target Calories') && (
                        <div className="absolute inset-0 bg-neon-purple/5 animate-pulse rounded-lg" />
                    )}
                    <p className="text-sm text-gray-400 relative z-10">{m.label}</p>
                    <p className={`text-2xl font-bold mt-1 ${m.color} relative z-10`}>{m.value}</p>
                </div>
            ))}
        </div>

        {isLoadingProgram ? (
            <div className="glass-panel p-12 text-center text-gray-400 border-dashed border-2 border-white/10 mt-6">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-white/10 mb-4"></div>
                    <div className="h-4 w-32 bg-white/10 rounded"></div>
                </div>
            </div>
        ) : !hasMeals ? (
            <div className="glass-panel p-12 text-center text-gray-400 border-dashed border-2 border-white/10 mt-6">
                <Utensils className="w-16 h-16 mx-auto mb-4 opacity-50 text-neon-purple" />
                <h3 className="text-xl font-semibold text-white mb-2">No Meal Plan Found</h3>
                <p className="max-w-md mx-auto mb-6 text-sm">
                    A structured meal plan hasn't been created yet. Generate one in seconds based on macro targets.
                </p>
                <button onClick={onOpenModal} className="glow-btn-cyan flex items-center gap-2 px-6 py-2 mx-auto mt-4">
                    <Plus className="w-4 h-4" />
                    Create Manually
                </button>
            </div>
        ) : (
            <div className="glass-panel p-6 border-l-2 border-neon-cyan mt-6">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold">Current Diet Program</h3>
                    <button onClick={onOpenModal} className="glow-btn flex items-center gap-2 text-sm px-4 py-2">
                        <Edit2 className="w-4 h-4" /> Update Program
                    </button>
                </div>
                
                {program?.generalDietNotes && (
                    <div className="bg-black/30 p-4 rounded-xl border border-white/5 mb-6">
                        <p className="text-sm text-gray-400 mb-1">General Notes</p>
                        <p className="text-white">{program.generalDietNotes}</p>
                    </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {program.meals.map((meal: any, index: number) => (
                        <div key={index} className="bg-white/5 border border-white/10 rounded-xl p-4 flex flex-col">
                            <h4 className="font-bold text-neon-purple mb-2 flex items-center justify-between">
                                {meal?.mealName || 'Unknown Meal'}
                                <span className="text-xs text-gray-500 bg-black/40 px-2 py-1 rounded-full">Meal {meal?.order || index + 1}</span>
                            </h4>
                            <p className="text-gray-300 text-sm flex-1 whitespace-pre-wrap">{meal?.foods || ''}</p>
                            {meal?.notes && (
                                <div className="mt-4 pt-4 border-t border-white/5">
                                    <p className="text-xs text-gray-400 italic">Note: {meal.notes}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        )}
    </div>
    );
};

const AthleteInfoTab: React.FC<{ athlete: AthleteDto | null }> = ({ athlete }) => {
    if (!athlete || !athlete.isOnboardingCompleted) {
        return (
            <div className="animate-in fade-in duration-500">
                <div className="glass-panel p-12 text-center text-gray-400 border-dashed border-2 border-white/10">
                    <ClipboardList className="w-16 h-16 mx-auto mb-4 opacity-50 text-gray-500" />
                    <h3 className="text-xl font-semibold text-white mb-2">Onboarding Not Completed</h3>
                    <p className="max-w-md mx-auto mb-6 text-sm">
                        {athlete?.firstName} hasn't filled out their initial physical attributes and goals yet. This information will appear here once they complete their onboarding.
                    </p>
                </div>
            </div>
        );
    }
    
    return (
        <div className="animate-in fade-in duration-500">
            <div className="glass-panel p-8">
                <div className="mb-6 border-b border-white/10 pb-4">
                    <h3 className="text-2xl font-bold text-white">Onboarding Information</h3>
                    <p className="text-sm text-gray-400 mt-1">Data provided by the athlete during registration.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h4 className="text-lg font-semibold text-neon-cyan mb-2">Physical Attributes</h4>
                        <div className="p-4 bg-white/5 rounded-lg text-gray-300">
                            Information is available but not yet fully mapped to this view.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
