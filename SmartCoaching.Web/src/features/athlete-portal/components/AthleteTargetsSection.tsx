interface AthleteTargetsSectionProps {
    targetCalories: number;
    targetSteps: number;
    consumedCalories: number;
    takenSteps: number;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
}

export const AthleteTargetsSection = ({
    targetCalories,
    targetSteps,
    consumedCalories,
    takenSteps,
    calorieProgress,
    stepProgress,
    dailyCompletion,
}: AthleteTargetsSectionProps) => {
    return (
        <div className="card-stack">
            <section className="surface athlete-section-card">
                <div className="section-header">
                    <div>
                        <span className="section-label">Hedefler</span>
                        <h3>Gunluk ilerleme</h3>
                    </div>
                </div>

                <div className="goal-progress-stack">
                    <article className="goal-progress-card">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Kalori hedefi</span>
                                <div className="goal-progress-card__value">{targetCalories || '-'}</div>
                            </div>
                            <span className="chip chip--success">{Math.round(calorieProgress)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill" style={{ width: `${calorieProgress}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>{consumedCalories} / {targetCalories || '-'} kcal</span>
                            <span>Bugunluk ilerleme</span>
                        </div>
                    </article>

                    <article className="goal-progress-card">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Adim hedefi</span>
                                <div className="goal-progress-card__value">{targetSteps || '-'}</div>
                            </div>
                            <span className="chip chip--success">{Math.round(stepProgress)}%</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill progress-bar__fill--green" style={{ width: `${stepProgress}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>{takenSteps} / {targetSteps || '-'} adim</span>
                            <span>Hedefe yakinlik</span>
                        </div>
                    </article>

                    <article className="goal-progress-card goal-progress-card--summary">
                        <div className="goal-progress-card__top">
                            <div>
                                <span className="section-label">Genel uyum</span>
                                <div className="goal-progress-card__value">{dailyCompletion}%</div>
                            </div>
                            <span className="chip">{dailyCompletion >= 80 ? 'Guclu' : 'Takipte'}</span>
                        </div>
                        <div className="progress-bar">
                            <div className="progress-bar__fill progress-bar__fill--violet" style={{ width: `${dailyCompletion}%` }} />
                        </div>
                        <div className="progress-meta">
                            <span>Kalori + adim + antrenman dengesi</span>
                            <span>Gun sonu skoru</span>
                        </div>
                    </article>
                </div>
            </section>
        </div>
    );
};
