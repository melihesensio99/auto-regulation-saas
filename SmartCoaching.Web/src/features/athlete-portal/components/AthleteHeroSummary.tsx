interface AthleteHeroSummaryProps {
    firstName?: string;
    targetCalories: number;
    targetSteps: number;
    consumedCalories: number;
    takenSteps: number;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
    hasTodayLog: boolean;
    isWorkoutCompleted: boolean;
    activeLogDate?: string | null;
}

export const AthleteHeroSummary = ({
    firstName,
    targetCalories,
    targetSteps,
    consumedCalories,
    takenSteps,
    calorieProgress,
    stepProgress,
    dailyCompletion,
    hasTodayLog,
    isWorkoutCompleted,
    activeLogDate,
}: AthleteHeroSummaryProps) => {
    return (
        <section className="hero-panel surface">
            <div className="athlete-hero-grid">
                <div className="card-stack">
                    <span className="eyebrow">Günlük takip</span>
                    <div>
                        <h1 className="page-title" style={{ fontSize: '2.8rem' }}>
                            Hoş geldin, {firstName}
                        </h1>
                        <p className="page-subtitle" style={{ marginTop: 10 }}>
                            Bugünün verilerini gir, hedef barların otomatik olarak güncellensin ve haftalık trendi tek bakışta gör.
                        </p>
                    </div>
                    <div className="button-group">
                        <span className="chip chip--success">Takip açık</span>
                        <span className="chip">Son 7 gün görünümü</span>
                        <span className="chip">Kişisel koç alanı</span>
                    </div>
                </div>

                <div className="goal-progress-stack">
                    <article className="goal-progress-card">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Hedef kalori</span>
                                <div className="goal-progress-card__value">{targetCalories || '—'}</div>
                            </div>
                            <span className={`chip ${calorieProgress >= 100 ? 'chip--success' : 'chip--warning'}`}>
                                {targetCalories > 0 ? `${Math.round(calorieProgress)}%` : 'Hedef yok'}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill" style={{ width: `${calorieProgress}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>{consumedCalories} / {targetCalories || '—'} kcal</span>
                            <span>{hasTodayLog ? 'Bugün kayıt var' : 'Henüz kayıt yok'}</span>
                        </div>
                    </article>

                    <article className="goal-progress-card">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Hedef adım</span>
                                <div className="goal-progress-card__value">{targetSteps || '—'}</div>
                            </div>
                            <span className={`chip ${stepProgress >= 100 ? 'chip--success' : 'chip--warning'}`}>
                                {targetSteps > 0 ? `${Math.round(stepProgress)}%` : 'Hedef yok'}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill progress-bar__fill--green" style={{ width: `${stepProgress}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>{takenSteps} / {targetSteps || '—'} adım</span>
                            <span>{isWorkoutCompleted ? 'Antrenman tamam' : 'Antrenman bekliyor'}</span>
                        </div>
                    </article>

                    <article className="goal-progress-card goal-progress-card--summary">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Günlük tamamlanma</span>
                                <div className="goal-progress-card__value">{dailyCompletion}%</div>
                            </div>
                            <span className={`chip ${isWorkoutCompleted ? 'chip--success' : 'chip--warning'}`}>
                                {isWorkoutCompleted ? 'Tamamlandı' : 'Takipte'}
                            </span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill progress-bar__fill--violet" style={{ width: `${dailyCompletion}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>{activeLogDate ? new Date(activeLogDate).toLocaleDateString('tr-TR') : 'Bugün için veri bekleniyor'}</span>
                            <span>{hasTodayLog ? 'Günlük bar' : 'Henüz ölçüm yok'}</span>
                        </div>
                    </article>
                </div>
            </div>
        </section>
    );
};
