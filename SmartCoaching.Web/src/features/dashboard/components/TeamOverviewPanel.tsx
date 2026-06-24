import { useState } from 'react';
import { useCoachDashboard } from '../hooks/useDashboard';

export const TeamOverviewPanel = () => {
    const { data: dashboard, isLoading, error } = useCoachDashboard();
    const [searchQuery, setSearchQuery] = useState('');

    if (isLoading) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div className="loader"></div>
                <p style={{ marginLeft: '10px' }}>Dashboard yükleniyor...</p>
            </div>
        );
    }

    if (error || !dashboard) {
        return (
            <div className="glass-panel" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <p style={{ color: 'var(--danger-color)' }}>Dashboard yüklenirken bir hata oluştu.</p>
            </div>
        );
    }

    return (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '24px', overflowY: 'auto', paddingRight: '10px' }} className="animate-fade-in">
            {/* Header Widgets */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Toplam Sporcu</span>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--primary-color)', textShadow: '0 0 20px rgba(99, 102, 241, 0.4)' }}>{dashboard.totalAthletes}</span>
                </div>
                <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.01))' }}>
                    <span style={{ fontSize: '1.1rem', color: 'var(--text-secondary)' }}>Günlük Aktif Sporcu</span>
                    <span style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--success-color)', textShadow: '0 0 20px rgba(16, 185, 129, 0.4)' }}>{dashboard.dailyActiveAthletes}</span>
                </div>
            </div>

            {/* Athlete Grid */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '15px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--text-secondary)' }}>Sporcu Değerlendirmeleri</h3>
                <input 
                    type="search" 
                    placeholder="Sporcu ara..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '10px 15px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(0,0,0,0.2)',
                        color: 'white',
                        width: '250px'
                    }}
                />
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                {dashboard.athletePerformances
                    .filter(a => a.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
                    .map(athlete => (
                    <div key={athlete.athleteId} className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', transition: 'transform 0.2s', cursor: 'default' }} onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
                        
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{ 
                                    width: '14px', 
                                    height: '14px', 
                                    borderRadius: '50%', 
                                    backgroundColor: athlete.isActiveToday ? 'var(--success-color)' : 'var(--text-secondary)',
                                    boxShadow: athlete.isActiveToday ? '0 0 12px var(--success-color)' : 'none'
                                }} title={athlete.isActiveToday ? 'Bugün Aktif' : 'Bugün Giriş Yapmadı'} />
                                <h4 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 600 }}>{athlete.fullName}</h4>
                                {athlete.isSlacking && <span style={{ fontSize: '0.75rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px', background: 'rgba(239, 68, 68, 0.15)', color: 'var(--danger-color)', padding: '4px 10px', borderRadius: '12px', border: '1px solid rgba(239, 68, 68, 0.3)' }}>Dikkat</span>}
                            </div>
                            <div style={{ display: 'flex', gap: '20px', fontSize: '1rem', background: 'rgba(0,0,0,0.2)', padding: '10px 15px', borderRadius: '12px' }}>
                                <div title={`Hedef: ${athlete.weeklyTargetCalories} kcal | Alınan: ${athlete.weeklyConsumedCalories} kcal`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Kalori:</span> {athlete.isMetCalorieTarget ? '✅' : '❌'}
                                </div>
                                <div title={`Hedef: ${athlete.weeklyTargetSteps} adım | Atılan: ${athlete.weeklyTakenSteps} adım`} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Adım:</span> {athlete.isMetStepTarget ? '✅' : '❌'}
                                </div>
                            </div>
                        </div>

                        {/* Progress Bar for Compliance */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                                <span>Haftalık Uyum</span>
                                <span style={{ fontWeight: 'bold', color: athlete.weeklyComplianceRatePercentage >= 80 ? 'var(--success-color)' : athlete.weeklyComplianceRatePercentage >= 50 ? '#f59e0b' : 'var(--danger-color)' }}>%{athlete.weeklyComplianceRatePercentage}</span>
                            </div>
                            <div style={{ width: '100%', height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <div style={{ 
                                    width: `${athlete.weeklyComplianceRatePercentage}%`, 
                                    height: '100%', 
                                    background: athlete.weeklyComplianceRatePercentage >= 80 ? 'var(--success-color)' : athlete.weeklyComplianceRatePercentage >= 50 ? '#f59e0b' : 'var(--danger-color)',
                                    transition: 'width 1s cubic-bezier(0.4, 0, 0.2, 1)',
                                    boxShadow: '0 0 10px rgba(0,0,0,0.3)'
                                }} />
                            </div>
                        </div>

                        {/* Algorithmic Insight */}
                        <div style={{ 
                            padding: '16px 20px', 
                            background: 'linear-gradient(to right, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.02))', 
                            borderRadius: '12px', 
                            borderLeft: '4px solid var(--text-secondary)',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '10px',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Kilo Durumu:</strong><br/>
                                    <span style={{ color: 'var(--text-secondary)' }}>Başlangıç: {athlete.startingWeightKg} kg ➔ Güncel: {athlete.latestWeightKg} kg </span>
                                    <span style={{ fontWeight: 'bold', color: athlete.latestWeightKg < athlete.startingWeightKg ? 'var(--success-color)' : athlete.latestWeightKg > athlete.startingWeightKg ? 'var(--danger-color)' : 'var(--text-secondary)' }}>
                                        ({athlete.latestWeightKg > athlete.startingWeightKg ? '+' : ''}{(athlete.latestWeightKg - athlete.startingWeightKg).toFixed(1)} kg)
                                    </span>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Kalori Uyumu:</strong><br/>
                                    <span style={{ color: 'var(--text-secondary)' }}>Hedef: {athlete.weeklyTargetCalories} kcal / Alınan: {athlete.weeklyConsumedCalories} kcal</span>
                                </div>
                                <div style={{ flex: 1, minWidth: '200px' }}>
                                    <strong style={{ color: 'var(--text-primary)' }}>Adım Uyumu:</strong><br/>
                                    <span style={{ color: 'var(--text-secondary)' }}>Hedef: {athlete.weeklyTargetSteps} / Atılan: {athlete.weeklyTakenSteps}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
