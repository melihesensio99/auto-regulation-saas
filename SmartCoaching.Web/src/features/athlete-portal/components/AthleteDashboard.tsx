import { type FormEvent, useMemo, useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AthleteDietSection } from './AthleteDietSection';
import { AthleteProgressSection } from './AthleteProgressSection';
import { AthleteSectionSidebar, type AthleteSectionKey } from './AthleteSectionSidebar';
import { AthleteTargetsSection } from './AthleteTargetsSection';
import { AthleteWorkoutSection } from './AthleteWorkoutSection';
import {
    useAthleteDietProgram,
    useAthleteProfile,
    useAthleteProgressLogs,
    useAthleteWorkoutProgram,
    useLogProgress,
    useDailyNutrition,
} from '../hooks/useAthletePortal';
import { createLastWeekDateRange, getDailyProgressSummary, getWeeklySummary } from '../utils/dashboardMetrics';

const VALID_SECTIONS: AthleteSectionKey[] = ['dashboard', 'log', 'workout', 'diet'];

const getSectionFromQuery = (value: string | null): AthleteSectionKey =>
    VALID_SECTIONS.includes(value as AthleteSectionKey) ? (value as AthleteSectionKey) : 'dashboard';

const goalLabelMap: Record<number, string> = {
    1: 'Kas kazanimi',
    2: 'Yag kaybi',
    3: 'Guc artisi',
    4: 'Dayaniklilik',
    5: 'Genel fitness',
    6: 'Rehabilitasyon',
};

export const AthleteDashboard = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const activeSection = getSectionFromQuery(searchParams.get('section'));
    const { startDate, endDate } = useMemo(() => createLastWeekDateRange(), []);

    const { data: profile } = useAthleteProfile();
    const { data: logs } = useAthleteProgressLogs(startDate, endDate);
    const { data: workoutProgram } = useAthleteWorkoutProgram();
    const { data: dietProgram } = useAthleteDietProgram();
    const logProgress = useLogProgress();

    const [calories, setCalories] = useState('');
    const [steps, setSteps] = useState('');
    const [weight, setWeight] = useState('');
    const [notes, setNotes] = useState('');
    const [consumedFoods, setConsumedFoods] = useState<any[]>([]);
    const [workoutCompleted, setWorkoutCompleted] = useState(false);
    const [frontPhotoUrl, setFrontPhotoUrl] = useState('');
    const [backPhotoUrl, setBackPhotoUrl] = useState('');
    const [sidePhotoUrl, setSidePhotoUrl] = useState('');

    const targetCalories = profile?.targetCalories ?? 0;
    const targetSteps = profile?.targetSteps ?? 0;
    const weeklySummary = getWeeklySummary(logs);
    const dailySummary = getDailyProgressSummary({
        logs,
        targetCalories,
        targetSteps,
    });

    const { data: dailyNutrition } = useDailyNutrition(dailySummary.todayIso);

    // Sync backend foods with local state when loaded
    useEffect(() => {
        if (dailyNutrition?.foods) {
            const mappedFoods = dailyNutrition.foods.map((f: any) => ({
                id: f.id,
                name: f.foodName,
                calories: f.calories,
                protein: f.protein,
                carbs: f.carbs,
                fats: f.fats,
                grams: 100, // or approximate
                baseCalories: f.calories,
                baseProtein: f.protein,
                baseCarbs: f.carbs,
                baseFats: f.fats,
                imageUrl: f.imageUrl
            }));
            setConsumedFoods(mappedFoods);
        }
    }, [dailyNutrition]);

    const handleSectionChange = (section: AthleteSectionKey) => {
        const nextParams = new URLSearchParams(searchParams);
        nextParams.set('section', section);
        setSearchParams(nextParams, { replace: true });
    };

    const handleSubmitLog = async (event: FormEvent) => {
        event.preventDefault();

        await logProgress.mutateAsync({
            date: new Date().toISOString(),
            consumedCalories: Number(calories),
            takenSteps: Number(steps),
            isWorkoutCompleted: workoutCompleted,
            weightKg: weight ? Number(weight) : null,
            notes: notes || null,
            frontPhotoUrl: frontPhotoUrl || null,
            backPhotoUrl: backPhotoUrl || null,
            sidePhotoUrl: sidePhotoUrl || null,
        });

        setCalories('');
        setSteps('');
        setWeight('');
        setNotes('');
        setWorkoutCompleted(false);
        setFrontPhotoUrl('');
        setBackPhotoUrl('');
        setSidePhotoUrl('');
    };

    const renderedSection = (() => {
        switch (activeSection) {
            case 'workout':
                return <AthleteWorkoutSection exercises={workoutProgram?.exercises} />;
            case 'diet':
                return (
                    <AthleteDietSection 
                        program={dietProgram}
                        targetCalories={targetCalories}
                        calories={calories}
                        onCaloriesChange={setCalories}
                        notes={notes}
                        onNotesChange={setNotes}
                        consumedFoods={consumedFoods}
                        setConsumedFoods={setConsumedFoods}
                        onNavigateToLog={() => handleSectionChange('log')}
                    />
                );
            case 'log':
                return (
                    <div className="flex flex-col space-y-6">
                        <AthleteProgressSection
                            logs={logs}
                            targetCalories={targetCalories}
                            targetSteps={targetSteps}
                            weeklySummary={weeklySummary}
                            todayIso={dailySummary.todayIso}
                            calories={calories}
                            steps={steps}
                            weight={weight}
                            notes={notes}
                            workoutCompleted={workoutCompleted}
                            frontPhotoUrl={frontPhotoUrl}
                            backPhotoUrl={backPhotoUrl}
                            sidePhotoUrl={sidePhotoUrl}
                            calorieProgress={dailySummary.calorieProgress}
                            stepProgress={dailySummary.stepProgress}
                            dailyCompletion={dailySummary.dailyCompletion}
                            isLogging={logProgress.isPending}
                            onSubmit={handleSubmitLog}
                            onCaloriesChange={setCalories}
                            onStepsChange={setSteps}
                            onWeightChange={setWeight}
                            onNotesChange={setNotes}
                            onWorkoutCompletedChange={setWorkoutCompleted}
                            onFrontPhotoUrlChange={setFrontPhotoUrl}
                            onBackPhotoUrlChange={setBackPhotoUrl}
                            onSidePhotoUrlChange={setSidePhotoUrl}
                        />
                    </div>
                );
            case 'dashboard':
            default:
                return (
                    <div className="flex flex-col space-y-6">
                        <AthleteTargetsSection
                            targetCalories={targetCalories}
                            targetSteps={targetSteps}
                            consumedCalories={dailySummary.consumedCalories}
                            takenSteps={dailySummary.takenSteps}
                            calorieProgress={dailySummary.calorieProgress}
                            stepProgress={dailySummary.stepProgress}
                            dailyCompletion={dailySummary.dailyCompletion}
                        />
                    </div>
                );
        }
    })();

    return (
        <div className="min-h-screen bg-[#080d17]">
            <AthleteSectionSidebar activeSection={activeSection} onSelect={handleSectionChange} />

            <main className="ml-[230px] p-8 space-y-6">
                {activeSection === 'dashboard' && (
                <section className="glass-panel p-8 border-l-2 border-neon-cyan">
                    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(420px,1fr)]">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-neon-cyan">Komuta Merkezi</span>
                            <h1 className="mt-4 text-[clamp(2rem,3vw,3.55rem)] font-bold leading-[0.96] tracking-[-0.06em] text-white">
                                {profile?.firstName} {profile?.lastName}
                            </h1>
                            <p className="mt-3 max-w-3xl text-[14px] leading-7 text-gray-400">Genel hedeflerin, makroların ve antrenman performansın burada.</p>
                            <div className="mt-6 flex flex-wrap gap-3">
                                <span className="rounded-full border border-white/10 bg-black/50 px-4 py-2 text-sm text-gray-300">
                                    {typeof profile?.mainReason === 'number'
                                        ? goalLabelMap[profile.mainReason] || `${profile.mainReason}`
                                        : profile?.mainReason || 'Hedef tanimi yok'}
                                </span>
                                <span
                                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                                        dailySummary.todayLog
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                            : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                    }`}
                                >
                                    {dailySummary.todayLog ? 'Bugün Kayıt Girildi' : 'Bugün Kayıt Bekleniyor'}
                                </span>
                            </div>
                        </div>
                    </div>
                </section>
                )}

                {renderedSection}
            </main>
        </div>
    );
};
