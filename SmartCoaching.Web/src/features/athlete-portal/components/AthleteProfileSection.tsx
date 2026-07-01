import type { Athlete } from '@/features/dashboard/types';

interface AthleteProfileSectionProps {
    profile: Athlete | undefined;
}

const infoItems = (profile: Athlete | undefined) => [
    { label: 'Yas', value: profile?.dateOfBirth ? calculateAge(profile.dateOfBirth) : '-' },
    { label: 'Boy', value: profile?.heightCm ? `${profile.heightCm} cm` : '-' },
    { label: 'Baslangic kilosu', value: profile?.startingWeightKg ? `${profile.startingWeightKg} kg` : '-' },
    { label: 'Meslek', value: profile?.occupation || '-' },
    { label: 'Telefon', value: profile?.phoneNumber || '-' },
    { label: 'Makro takibi', value: profile?.hasTrackedMacros || '-' },
];

const calculateAge = (dateOfBirth: string) => {
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age -= 1;
    }

    return `${age}`;
};

export const AthleteProfileSection = ({ profile }: AthleteProfileSectionProps) => {
    return (
        <div className="card-stack athlete-profile-section">
            <section className="surface athlete-profile-section__hero">
                <span className="section-label">Profil</span>
                <h2>
                    {profile?.firstName} {profile?.lastName}
                </h2>
                <p>
                    Hedeflerin, baslangic verilerin ve koçla paylastigin temel bilgiler burada bir arada durur.
                </p>
            </section>

            <section className="surface athlete-profile-section__card">
                <div className="section-header">
                    <div>
                        <span className="section-label">Temel bilgiler</span>
                        <h3>Kisisel ozet</h3>
                    </div>
                </div>

                <div className="athlete-profile-section__grid">
                    {infoItems(profile).map((item) => (
                        <article key={item.label} className="athlete-profile-section__metric">
                            <span>{item.label}</span>
                            <strong>{item.value}</strong>
                        </article>
                    ))}
                </div>
            </section>

            <section className="surface athlete-profile-section__card">
                <div className="athlete-profile-section__notes">
                    <article>
                        <span className="section-label">Ana hedef</span>
                        <p>{profile?.mainReason || '-'}</p>
                    </article>
                    <article>
                        <span className="section-label">Kisa vade</span>
                        <p>{profile?.shortTermGoal || '-'}</p>
                    </article>
                    <article>
                        <span className="section-label">Uzun vade</span>
                        <p>{profile?.longTermGoal || '-'}</p>
                    </article>
                    <article>
                        <span className="section-label">Ek notlar</span>
                        <p>{profile?.additionalNotes || '-'}</p>
                    </article>
                </div>
            </section>
        </div>
    );
};
