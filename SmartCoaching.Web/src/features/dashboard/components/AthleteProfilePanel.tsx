import { useAthlete } from '../hooks/useDashboard';

interface AthleteProfilePanelProps {
    athleteId: string;
}

export const AthleteProfilePanel = ({ athleteId }: AthleteProfilePanelProps) => {
    const { data: athlete, isLoading } = useAthlete(athleteId);

    if (isLoading || !athlete) return <div>Yükleniyor...</div>;

    if (!athlete.isOnboardingCompleted) {
        return (
            <div style={{ padding: '40px 20px', textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📝</div>
                <h3>Form Bekleniyor</h3>
                <p>Bu sporcu henüz başvuru/profil formunu doldurmadı.</p>
            </div>
        );
    }

    const calculateAge = (dob: string | undefined) => {
        if (!dob) return '-';
        const diff = Date.now() - new Date(dob).getTime();
        const age = new Date(diff);
        return Math.abs(age.getUTCFullYear() - 1970);
    };

    const InfoBox = ({ label, value, icon }: { label: string, value: string | undefined, icon: string }) => (
        <div style={{
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '12px',
            padding: '16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontWeight: 600 }}>
                <span>{icon}</span> {label}
            </div>
            <div style={{ color: '#fff', fontSize: '1.05rem', fontWeight: 500 }}>
                {value || '-'}
            </div>
        </div>
    );

    const LongAnswerBox = ({ label, value, icon, highlightColor = '#6366f1' }: { label: string, value: string | undefined, icon: string, highlightColor?: string }) => (
        <div style={{
            background: `rgba(255,255,255,0.02)`,
            border: `1px solid rgba(255,255,255,0.05)`,
            borderLeft: `4px solid ${highlightColor}`,
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '16px'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: highlightColor, fontWeight: 600, marginBottom: '12px' }}>
                <span>{icon}</span> {label}
            </div>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                {value || 'Belirtilmedi'}
            </p>
        </div>
    );

    const targetCalories = athlete.targetCalories && athlete.targetCalories > 0 ? `${athlete.targetCalories} kcal` : '-';
    const targetSteps = athlete.targetSteps && athlete.targetSteps > 0 ? `${athlete.targetSteps} adım` : '-';

    return (
        <div style={{ padding: '20px', color: '#fff', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
                background: 'linear-gradient(145deg, rgba(99, 102, 241, 0.05), rgba(16, 185, 129, 0.02))',
                borderRadius: '20px',
                padding: '30px',
                border: '1px solid rgba(255,255,255,0.1)',
                display: 'flex',
                flexDirection: 'column',
                gap: '30px'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '20px' }}>
                    <div>
                        <h2 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 700 }}>
                            {athlete.firstName} {athlete.lastName}
                        </h2>
                        <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                            <span style={{ color: '#10b981', fontSize: '0.9rem', fontWeight: 600 }}>✓ Form Dolduruldu</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>📞 {athlete.phoneNumber || 'Belirtilmedi'}</span>
                            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>💼 {athlete.occupation || 'Belirtilmedi'}</span>
                        </div>
                    </div>
                </div>

                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>Temel Fiziksel Bilgiler</h3>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                    gap: '16px'
                }}>
                    <InfoBox icon="📅" label="Yaş" value={calculateAge(athlete.dateOfBirth).toString()} />
                    <InfoBox icon="📏" label="Boy" value={`${athlete.heightCm} cm`} />
                    <InfoBox icon="⚖️" label="Başlangıç Kilosu" value={`${athlete.startingWeightKg} kg`} />
                    <InfoBox icon="🥗" label="Makro Takibi" value={athlete.hasTrackedMacros} />
                </div>

                <h3 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>Hedefler & Beklentiler</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <InfoBox icon="🔥" label="Hedef Kalori" value={targetCalories} />
                    <InfoBox icon="👟" label="Hedef Adım" value={targetSteps} />
                </div>
                <div>
                    <LongAnswerBox icon="🎯" label="Koçluk almak istemenin ana sebebi" value={athlete.mainReason} highlightColor="#8b5cf6" />
                    <LongAnswerBox icon="⚡" label="Kısa Vadeli Hedef" value={athlete.shortTermGoal} highlightColor="#3b82f6" />
                    <LongAnswerBox icon="🌟" label="Uzun Vadeli Hedef" value={athlete.longTermGoal} highlightColor="#10b981" />
                    <LongAnswerBox icon="🤝" label="Koçluktan Beklentiler" value={athlete.expectations} highlightColor="#f59e0b" />
                </div>

                <h3 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>Antrenman & Aktivite</h3>
                <div>
                    <LongAnswerBox icon="🏋️" label="Antrenman Geçmişi" value={athlete.trainingHistory} highlightColor="#ef4444" />
                    <LongAnswerBox icon="📅" label="Şu Anki Antrenman Düzeni" value={athlete.currentTrainingRoutine} highlightColor="#ec4899" />
                    <LongAnswerBox icon="🏃" label="Antrenman Dışı Fiziksel Aktivite" value={athlete.outsidePhysicalActivity} highlightColor="#14b8a6" />
                </div>

                <h3 style={{ margin: '10px 0 0 0', fontSize: '1.2rem', color: 'rgba(255,255,255,0.9)' }}>Diğer Bilgiler</h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Daha Önce Koçla Çalıştı mı?</div>
                        <div style={{ fontWeight: 600 }}>{athlete.hasWorkedWithCoach || '-'}</div>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.03)', padding: '16px', borderRadius: '12px' }}>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '8px' }}>Bizi Nereden Duydu?</div>
                        <div style={{ fontWeight: 600 }}>{athlete.hearAboutUs || '-'}</div>
                    </div>
                </div>

                {athlete.additionalNotes && (
                    <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '20px', borderRadius: '12px', marginTop: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', fontWeight: 600, marginBottom: '12px' }}>
                            <span>⚠️</span> Eklemek İstedikleri / Sağlık Durumu
                        </div>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.9)', lineHeight: '1.6', whiteSpace: 'pre-wrap' }}>
                            {athlete.additionalNotes}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
