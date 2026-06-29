import type { FormEvent } from 'react';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    useAthleteDietProgram,
    useAthleteProfile,
    useAthleteProgressLogs,
    useAthleteWorkoutProgram,
    useLogProgress
} from '../hooks/useAthletePortal';
import { AthleteDailyLogSection } from './AthleteDailyLogSection';
import { AthleteHeroSummary } from './AthleteHeroSummary';
import { AthleteTrendSection } from './AthleteTrendSection';
import {
    createLastWeekDateRange,
    getDailyProgressSummary,
    getWeeklySummary
} from '../utils/dashboardMetrics';

export const AthleteDashboard = () => {
    const navigate = useNavigate();
    const { data: profile, isLoading: isProfileLoading } = useAthleteProfile();
    const { data: workoutProgram } = useAthleteWorkoutProgram();
    const { data: dietProgram } = useAthleteDietProgram();
    const { mutate: logProgress, isPending: isLogging } = useLogProgress();

    const dateRange = useMemo(createLastWeekDateRange, []);
    const { data: progressLogs } = useAthleteProgressLogs(dateRange.startDate, dateRange.endDate);

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
    const dailySummary = getDailyProgressSummary({
        logs: progressLogs,
        targetCalories,
        targetSteps,
    });
    const weeklySummary = getWeeklySummary(progressLogs);

    if (isProfileLoading) {
        return (
            <div className="empty-state">
                <div className="loader" />
                <p>Profil yukleniyor...</p>
            </div>
        );
    }

    const resetDailyLogForm = () => {
        setCalories('');
        setSteps('');
        setWeight('');
        setNotes('');
        setWorkoutCompleted(false);
        setFrontPhotoUrl('');
        setBackPhotoUrl('');
        setSidePhotoUrl('');
    };

    const handleLogProgress = (event: FormEvent) => {
        event.preventDefault();

        logProgress(
            {
                date: new Date().toISOString(),
                consumedCalories: Number.parseInt(calories, 10) || 0,
                takenSteps: Number.parseInt(steps, 10) || 0,
                weightKg: weight ? Number.parseFloat(weight) : null,
                notes,
                isWorkoutCompleted: workoutCompleted,
                frontPhotoUrl: frontPhotoUrl || null,
                backPhotoUrl: backPhotoUrl || null,
                sidePhotoUrl: sidePhotoUrl || null
            },
            {
                onSuccess: () => {
                    alert('Gunluk gelisim kaydedildi!');
                    resetDailyLogForm();
                }
            }
        );
    };

    return (
        <div className="card-stack athlete-dashboard" style={{ gap: 24 }}>
            <AthleteHeroSummary
                firstName={profile?.firstName}
                targetCalories={targetCalories}
                targetSteps={targetSteps}
                consumedCalories={dailySummary.consumedCalories}
                takenSteps={dailySummary.takenSteps}
                calorieProgress={dailySummary.calorieProgress}
                stepProgress={dailySummary.stepProgress}
                dailyCompletion={dailySummary.dailyCompletion}
                hasTodayLog={!!dailySummary.todayLog}
                isWorkoutCompleted={!!dailySummary.activeLog?.isWorkoutCompleted}
                activeLogDate={dailySummary.todayLog?.date ?? dailySummary.activeLog?.date ?? null}
            />

            <AthleteTrendSection
                logs={progressLogs}
                targetCalories={targetCalories}
                targetSteps={targetSteps}
                weeklySummary={weeklySummary}
                todayIso={dailySummary.todayIso}
            />

            <div className="program-focus-grid">
                <section className="program-focus-card surface">
                    <div className="program-focus-card__icon">N</div>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Beslenme Programi</span>
                            <h2 style={{ marginTop: 8, fontSize: '1.7rem' }}>Beslenme duzeni</h2>
                        </div>
                        <p>
                            Toplam kalori, protein, karb ve yag dengesini tek yerde gor. Gunluk hedefe gore kocun ne verdigini buradan takip et.
                        </p>
                        <div className="button-group">
                            <span className="chip">{dietProgram?.meals?.length ?? 0} ogun</span>
                            <span className="chip">Toplam {dietProgram?.totalCalories ?? 0} kcal</span>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => navigate('/athlete/programs?view=diet')}>
                            Beslenmeyi ac
                        </button>
                    </div>
                </section>

                <section className="program-focus-card surface">
                    <div className="program-focus-card__icon program-focus-card__icon--green">W</div>
                    <div className="card-stack">
                        <div>
                            <span className="section-label">Antrenman Programi</span>
                            <h2 style={{ marginTop: 8, fontSize: '1.7rem' }}>Antrenman duzeni</h2>
                        </div>
                        <p>
                            Haftalik egzersiz planini ayri bir alanda izle. Gun bazli yuk, set, tekrar ve dinlenme bilgilerini net sekilde gor.
                        </p>
                        <div className="button-group">
                            <span className="chip">{workoutProgram?.exercises?.length ?? 0} egzersiz</span>
                            <span className="chip">{workoutProgram?.exercises?.length ? 'Program var' : 'Program bekleniyor'}</span>
                        </div>
                        <button type="button" className="btn btn-primary" onClick={() => navigate('/athlete/programs?view=workout')}>
                            Antrenmani ac
                        </button>
                    </div>
                </section>
            </div>

            <AthleteDailyLogSection
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
                isLogging={isLogging}
                onSubmit={handleLogProgress}
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
};
