import { useMemo, useState, type FormEvent } from 'react';
import { useSearchParams } from 'react-router-dom';
import { AthleteDietSection } from './AthleteDietSection';
import { AthleteProfileSection } from './AthleteProfileSection';
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
} from '../hooks/useAthletePortal';
import { createLastWeekDateRange, getDailyProgressSummary, getWeeklySummary } from '../utils/dashboardMetrics';

const VALID_SECTIONS: AthleteSectionKey[] = ['profile', 'progress', 'workout', 'diet', 'targets'];

const getSectionFromQuery = (value: string | null): AthleteSectionKey =>
    VALID_SECTIONS.includes(value as AthleteSectionKey) ? (value as AthleteSectionKey) : 'profile';

const renderSectionTitle = (section: AthleteSectionKey) => {
    switch (section) {
        case 'profile':
            return { eyebrow: 'Profile', title: 'Profil', description: 'Temel bilgilerini ve onboarding detaylarini burada gor.' };
        case 'progress':
            return { eyebrow: 'Progress', title: 'Gelisim', description: 'Gunluk loglari, trend akislarini ve yeni kaydini tek yerde yonet.' };
        case 'workout':
            return { eyebrow: 'Workout', title: 'Antrenman', description: 'Gun bazli planini sec, hareket aciklamalarina bak ve egzersiz akisina odaklan.' };
        case 'diet':
            return { eyebrow: 'Diet', title: 'Beslenme', description: 'Ogünlerini, toplam makrolari ve genel beslenme notlarini net gor.' };
        case 'targets':
            return { eyebrow: 'Targets', title: 'Hedefler', description: 'Kalori, adim ve genel uyum barlarini tek bakista takip et.' };
        default:
            return { eyebrow: 'Profile', title: 'Profil', description: 'Temel bilgilerini ve onboarding detaylarini burada gor.' };
    }
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

    const sectionMeta = renderSectionTitle(activeSection);

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
            case 'progress':
                return (
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
                );
            case 'workout':
                return <AthleteWorkoutSection exercises={workoutProgram?.exercises} />;
            case 'diet':
                return <AthleteDietSection program={dietProgram} />;
            case 'targets':
                return (
                    <AthleteTargetsSection
                        targetCalories={targetCalories}
                        targetSteps={targetSteps}
                        consumedCalories={dailySummary.consumedCalories}
                        takenSteps={dailySummary.takenSteps}
                        calorieProgress={dailySummary.calorieProgress}
                        stepProgress={dailySummary.stepProgress}
                        dailyCompletion={dailySummary.dailyCompletion}
                    />
                );
            case 'profile':
            default:
                return <AthleteProfileSection profile={profile} />;
        }
    })();

    return (
        <div className="grid items-start gap-6 xl:grid-cols-[280px_minmax(0,1fr)]">
            <AthleteSectionSidebar activeSection={activeSection} onSelect={handleSectionChange} />

            <div className="space-y-6">
                <section className="rounded-[28px] border border-white/8 bg-[#0b111d] p-6">
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
                        <div>
                            <span className="text-[11px] uppercase tracking-[0.28em] text-white/35">{sectionMeta.eyebrow}</span>
                            <h1 className="mt-3 text-[clamp(2.2rem,3.5vw,3.8rem)] font-semibold leading-[0.95] tracking-[-0.06em] text-white">
                                {profile?.firstName} {profile?.lastName}
                            </h1>
                            <p className="mt-3 max-w-3xl text-[15px] leading-7 text-white/52">{sectionMeta.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65">
                                {profile?.mainReason || 'Hedef tanimi yok'}
                            </span>
                            <span className={`rounded-full px-4 py-2 text-sm ${dailySummary.todayLog ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                                {dailySummary.todayLog ? 'Bugun kayit var' : 'Bugun kayit yok'}
                            </span>
                        </div>
                    </div>
                </section>

                {renderedSection}
            </div>
        </div>
    );
};
