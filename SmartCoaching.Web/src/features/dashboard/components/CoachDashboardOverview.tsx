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

interface CoachDashboardOverviewProps {
    onSelectAthlete: (athleteId: string) => void;
}

export const CoachDashboardOverview = ({ onSelectAthlete }: CoachDashboardOverviewProps) => {
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
            <section className="rounded-[32px] border border-white/8 bg-[#111827] p-7 text-sm text-white/55">
                Dashboard yukleniyor...
            </section>
        );
    }

    return (
        <section className="space-y-5">
            <div className="rounded-[32px] border border-white/8 bg-[radial-gradient(circle_at_top_left,_rgba(92,57,201,0.22),_transparent_35%),linear-gradient(135deg,#171a34_0%,#0e2a35_100%)] p-4 lg:p-5">
                <div className="grid gap-4 xl:grid-cols-[minmax(0,1.7fr)_minmax(430px,1fr)]">
                    <div className="pt-1">
                        <div className="inline-flex rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] uppercase tracking-[0.26em] text-white/45">
                            Coach dashboard
                        </div>
                        <h1 className="mt-2.5 text-[clamp(1.75rem,2.5vw,2.7rem)] font-semibold leading-[0.97] tracking-[-0.05em] text-white">
                            Welcome back, Coach
                        </h1>
                        <p className="mt-2 max-w-lg text-[12.5px] leading-5.5 text-white/56">
                            Takimdaki genel ritmi, aktif sporculari ve dikkat isteyen alanlari tek bakista gor. Sol taraftan sporcuya gecince detay akisi ayni sistemle devam ediyor.
                        </p>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        {statCards.map((card) => {
                            const Icon = card.icon;
                            const value =
                                card.key === 'adherence'
                                    ? `${summaryValues.adherence}%`
                                    : summaryValues[card.key as keyof typeof summaryValues];

                            return (
                                <article
                                    key={card.key}
                                    className={`rounded-[26px] border border-white/8 bg-gradient-to-br ${card.tone} p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <span className="text-[10px] uppercase tracking-[0.25em] text-white/48">{card.label}</span>
                                        <div className="grid h-9 w-9 place-items-center rounded-2xl bg-white/10 text-white/80">
                                            <Icon className="h-4.5 w-4.5" />
                                        </div>
                                    </div>
                                    <div className={`mt-5 text-[2.2rem] font-semibold tracking-[-0.05em] ${card.valueClass}`}>
                                        {value}
                                    </div>
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
                                <button
                                    key={athlete.id}
                                    type="button"
                                    onClick={() => onSelectAthlete(athlete.id)}
                                    className="grid w-full grid-cols-[110px_minmax(220px,1.4fr)_1fr_1fr_1.1fr_120px] gap-4 border-b border-white/6 px-6 py-5 text-left transition hover:bg-white/[0.03] last:border-b-0"
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
                                        <div className="mt-1 text-sm text-white/45">
                                            {athlete.occupation || athlete.phoneNumber || 'Athlete profile'}
                                        </div>
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
                                        <span
                                            className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                                                athlete.isOnboardingCompleted
                                                    ? 'bg-emerald-500/10 text-emerald-300'
                                                    : 'bg-amber-500/10 text-amber-300'
                                            }`}
                                        >
                                            {athlete.isOnboardingCompleted ? 'Active' : 'Pending'}
                                        </span>
                                    </div>
                                </button>
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
                            <button
                                key={athlete.id}
                                type="button"
                                onClick={() => onSelectAthlete(athlete.id)}
                                className="block w-full rounded-[26px] border border-white/6 bg-[#12202d] p-5 text-left transition hover:border-cyan-400/20 hover:bg-[#142434]"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h3 className="text-xl font-medium text-white">
                                            {athlete.firstName} {athlete.lastName}
                                        </h3>
                                        <p className="mt-1 text-sm text-white/40">{athlete.mainReason || 'Takip devam ediyor'}</p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                                            athlete.isOnboardingCompleted
                                                ? 'bg-emerald-500/10 text-emerald-300'
                                                : 'bg-amber-500/10 text-amber-300'
                                        }`}
                                    >
                                        {athlete.isOnboardingCompleted ? 'Good' : 'Pending'}
                                    </span>
                                </div>

                                <div className="mt-5 grid grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="text-[11px] uppercase tracking-[0.22em] text-white/35">Weight</span>
                                        <div className="mt-2 text-white">
                                            {athlete.startingWeightKg ? `${athlete.startingWeightKg} kg` : '-'}
                                        </div>
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
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </section>
    );
};
