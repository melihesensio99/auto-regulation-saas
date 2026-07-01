import type { AthleteDietProgram } from '@/features/dashboard/types';

interface AthleteDietSectionProps {
    program: AthleteDietProgram | undefined;
}

export const AthleteDietSection = ({ program }: AthleteDietSectionProps) => {
    if (!program || program.meals.length === 0) {
        return (
            <div className="empty-state athlete-section-empty">
                <p>Kocun henuz bir beslenme programi atamamis.</p>
            </div>
        );
    }

    return (
        <div className="card-stack">
            <section className="surface athlete-section-card">
                <div className="section-header">
                    <div>
                        <span className="section-label">Beslenme</span>
                        <h3>Gunluk toplamlar</h3>
                    </div>
                </div>

                <div className="athlete-profile-section__grid">
                    <article className="athlete-profile-section__metric">
                        <span>Toplam kalori</span>
                        <strong>{program.totalCalories} kcal</strong>
                    </article>
                    <article className="athlete-profile-section__metric">
                        <span>Protein</span>
                        <strong>{program.totalProtein} g</strong>
                    </article>
                    <article className="athlete-profile-section__metric">
                        <span>Karb</span>
                        <strong>{program.totalCarbs} g</strong>
                    </article>
                    <article className="athlete-profile-section__metric">
                        <span>Yag</span>
                        <strong>{program.totalFats} g</strong>
                    </article>
                </div>
            </section>

            <section className="surface athlete-section-card">
                <span className="section-label">Genel not</span>
                <p className="athlete-diet-section__note">
                    {program.generalDietNotes || 'Belirtilmemis.'}
                </p>
            </section>

            <section className="athlete-diet-section__meals">
                {program.meals.map((meal) => (
                    <article key={meal.id} className="surface athlete-section-card">
                        <div className="athlete-diet-section__meal-head">
                            <div>
                                <span className="section-label">{meal.order}. ogun</span>
                                <h4>{meal.mealName}</h4>
                            </div>
                        </div>

                        <p className="athlete-diet-section__foods">{meal.foods}</p>

                        {meal.notes && (
                            <p className="athlete-diet-section__subnote">{meal.notes}</p>
                        )}
                    </article>
                ))}
            </section>
        </div>
    );
};
