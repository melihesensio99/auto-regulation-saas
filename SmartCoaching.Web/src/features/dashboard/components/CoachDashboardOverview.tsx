import { Activity, CalendarCheck, TrendingUp, Users } from 'lucide-react';
import { useAthletes, useCoachDashboard } from '../hooks/useDashboard';

const statCards = [
    {
        key: 'totalAthletes',
        label: 'Total athletes',
        icon: Users,
        tone: 'from-[#1e2047] to-[#143546]',
        valueClass: 'text-white',
    },
    {
        key: 'dailyActiveAthletes',
        label: 'Active',
        icon: Activity,
        tone: 'from-[#2d1d4b] to-[#1c2247]',
        valueClass: 'text-white',
    },
    {
        key: 'adherence',
        label: 'Avg. adherence',
        icon: TrendingUp,
        tone: 'from-[#0c2b48] to-[#0d3340]',
        valueClass: 'text-white',
    },
    {
        key: 'needsAttentionCount',
        label: 'Weekly check-ins',
        icon: CalendarCheck,
        tone: 'from-[#3c3011] to-[#123641]',
        valueClass: 'text-white',
    },
];

const getInitials = (firstName?: string, lastName?: string) =>
    `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.trim() || 'AT';

export const CoachDashboardOverview = () => {
    const { data: dashboard, isLoading: isDashboardLoading } = useCoachDashboard();
    const { data: athletes = [], isLoading: isAthletesLoading } = useAthletes();

    const activeAthletes = athletes.filter((athlete) => athlete.isOnboardingCompleted).length;
    const adherence = athletes.length > 0 ? Math.round((activeAthletes / athletes.length) * 100) : 0;
    const latestAthletes = athletes.slice(0, 6);
    const latestCheckIns = athletes.slice(0, 4);

    const summaryValues = {
        totalAthletes: dashboard?.totalAthletes ?? athletes.length,
        dailyActiveAthletes: dashboard?.dailyActiveAthletes ?? activeAthletes,
        adherence,
        needsAttentionCount: dashboard?.needsAttentionCount ?? latestCheckIns.length,
    };

    if (isDashboardLoading || isAthletesLoading) {
        return (
            <section className="rounded-[36px] border border-white/8 bg-[#111827] p-8 text-sm text-white/55">
                Dashboard yukleniyor...
            </section>
        );
    }

    return (
        <section className="space-y-7">
            <div className="rounded-[36px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,57,201,0.22),_transparent_35%),linear-gradient(135deg,#171a34_0%,#0e2a35_100%)] p-7 lg:p-8">
                <div className="grid gap-8 xl:grid-cols-[minmax(0,1.8fr)_minmax(460px,1fr)]">
                    <div>
                        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-white/45">
                            Coach dashboard
                        </div>
                        <h1 className="mt-6 text-[clamp(2.6rem,4vw,4.4rem)] font-semibold leading-[0.94] tracking-[-0.06em] text-white">
                            Welcome back, Coach
                        </h1>
                        <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/58">
                            Takimdaki genel ritmi, aktif sporculari ve dikkat isteyen alanlari tek bakista gor. Sol taraftan sporcuya gecince detay akisi ayni sistemle devam ediyor.
                        </p>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            const value =
                                card.key === 'adherence'
                                    ? `${summaryValues.adherence}%`
                                    : summaryValues[card.key as keyof typeof summaryValues];

                            return (
                                <article
                                    key={card.key}
                                    className={`rounded-[30px] border border-white/8 bg-gradient-to-br ${card.tone} p-6 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-[11px] uppercase tracking-[0.28em] text-white/48">{card.label}</span>
                                        <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10 text-white/80">
                                            <Icon className="h-5 w-5" />
                                        </div>
                                    </div>
                                    <div className={`mt-8 text-5xl font-semibold tracking-[-0.05em] ${card.valueClass}`}>{value}</div>
                                </article>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.9fr)_minmax(360px,1fr)]">
                <section className="rounded-[32px] border border-white/8 bg-[#111826] p-6">
                    <div className="flex items-start justify-between gap-4 border-b border-white/6 pb-5">
                        <div>
                            <h2 className="text-[30px] font-semibold tracking-[-0.04em] text-white">My athletes</h2>
                            <p className="mt-1 text-sm text-white/45">{athletes.length} total · updated live</p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-[24px] border border-white/6">
                        <div className="grid grid-cols-[110px_minmax(220px,1.4fr)_1fr_1fr_1.1fr_120px] gap-4 border-b border-white/6 px-6 py-4 text-[11px] uppercase tracking-[0.28em] text-white/35">
                            <span>Athlete</span>
                            <span>Identity</span>
                            <span>Goal</span>
                            <span>Target</span>
                            <span>Last check-in</span>
                            <span>Status</span>
                        </div>

                        <div>
                            {latestAthletes.map((athlete) => (
                                <div
                                    key={athlete.id}
                                    className="grid grid-cols-[110px_minmax(220px,1.4fr)_1fr_1fr_1.1fr_120px] gap-4 border-b border-white/6 px-6 py-5 last:border-b-0"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-cyan-400/10 text-sm font-semibold text-cyan-200">
                                            {getInitials(athlete.firstName, athlete.lastName)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="text-base font-medium text-white">
                                            {athlete.firstName} {athlete.lastName}
                                        </div>
                                        <div className="mt-1 text-sm text-white/45">{athlete.occupation || athlete.phoneNumber || 'Athlete profile'}</div>
                                    </div>
                                    <div className="text-sm text-white/65">{athlete.mainReason || '-'}</div>
                                    <div className="text-sm text-white/65">
                                        <div>{athlete.targetCalories || '-'} kcal</div>
                                        <div className="mt-1 text-white/35">{athlete.targetSteps || '-'} adim</div>
                                    </div>
                                    <div className="text-sm text-white/45">
                                        {athlete.isOnboardingCompleted ? 'Program hazir' : 'Onboarding'}
                                    </div>
                                    <div>
                                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${athlete.isOnboardingCompleted ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'}`}>
                                            {athlete.isOnboardingCompleted ? 'Active' : 'Pending'}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="rounded-[32px] border border-white/8 bg-[#0f1b27] p-6">
                    <div>
                        <h2 className="text-[30px] font-semibold tracking-[-0.04em] text-white">Recent check-ins</h2>
                        <p className="mt-1 text-sm text-white/45">Live progress logs from your athletes</p>
                    </div>

                    <div className="mt-6 space-y-4">
                        {latestCheckIns.map((athlete) => (
                            <article key={athlete.id} className="rounded-[26px] border border-white/6 bg-[#12202d] p-5">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-medium text-white">
                                            {athlete.firstName} {athlete.lastName}
                                        </h3>
                                        <p className="mt-1 text-sm text-white/40">{athlete.mainReason || 'Takip devam ediyor'}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            athlete.isOnboardingCompleted ? 'bg-emerald-500/10 text-emerald-300' : 'bg-amber-500/10 text-amber-300'
                                        }`}
                                    >
                                        {athlete.isOnboardingCompleted ? 'Good' : 'Pending'}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">Weight</span>
                                        <div className="mt-2 text-white">{athlete.startingWeightKg ? `${athlete.startingWeightKg} kg` : '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">Calories</span>
                                        <div className="mt-2 text-white">{athlete.targetCalories || '-'}</div>
                                    </div>
                                    <div>
                                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">Steps</span>
                                        <div className="mt-2 text-white">{athlete.targetSteps || '-'}</div>
                                    </div>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
};
