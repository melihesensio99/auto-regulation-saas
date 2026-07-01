import { useMemo, useState, type FormEvent } from 'react';
import { X } from 'lucide-react';
import { useCreateAthlete } from '../hooks/useDashboard';

interface AddAthleteModalProps {
    onClose: () => void;
}

const getDefaultSubscriptionDate = () => {
    const nextYear = new Date();
    nextYear.setFullYear(nextYear.getFullYear() + 1);
    return nextYear.toISOString().split('T')[0];
};

export const AddAthleteModal = ({ onClose }: AddAthleteModalProps) => {
    const createAthlete = useCreateAthlete();
    const initialState = useMemo(
        () => ({
            firstName: '',
            lastName: '',
            email: '',
            subscriptionEndDate: getDefaultSubscriptionDate(),
        }),
        []
    );

    const [form, setForm] = useState(initialState);

    const handleSubmit = async (event: FormEvent) => {
        event.preventDefault();
        await createAthlete.mutateAsync({
            ...form,
            subscriptionEndDate: new Date(form.subscriptionEndDate).toISOString(),
        });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#111826] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
                <div className="mb-6 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">Yeni sporcu</p>
                        <h3 className="mt-2 text-2xl font-semibold text-white">Takima sporcu ekle</h3>
                        <p className="mt-2 text-sm text-white/55">
                            Gecici hesabini olusturalim, ilk giriste sifresini degistirip onboarding akisini tamamlasin.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-full border border-white/10 p-2 text-white/55 transition hover:border-white/20 hover:text-white"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="space-y-2">
                            <span className="text-xs uppercase tracking-[0.22em] text-white/45">Ad</span>
                            <input
                                required
                                value={form.firstName}
                                onChange={(event) => setForm((current) => ({ ...current, firstName: event.target.value }))}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-xs uppercase tracking-[0.22em] text-white/45">Soyad</span>
                            <input
                                required
                                value={form.lastName}
                                onChange={(event) => setForm((current) => ({ ...current, lastName: event.target.value }))}
                                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
                            />
                        </label>
                    </div>

                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.22em] text-white/45">E-posta</span>
                        <input
                            required
                            type="email"
                            value={form.email}
                            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
                        />
                    </label>

                    <label className="space-y-2">
                        <span className="text-xs uppercase tracking-[0.22em] text-white/45">Uyelik bitis tarihi</span>
                        <input
                            required
                            type="date"
                            value={form.subscriptionEndDate}
                            onChange={(event) => setForm((current) => ({ ...current, subscriptionEndDate: event.target.value }))}
                            className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition focus:border-cyan-400/60"
                        />
                    </label>

                    {createAthlete.isError && (
                        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                            Sporcu eklenirken bir sorun oldu. Bilgileri kontrol edip tekrar deneyelim.
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-2xl border border-white/10 px-5 py-3 text-sm text-white/70 transition hover:border-white/20 hover:text-white"
                        >
                            Vazgec
                        </button>
                        <button
                            type="submit"
                            disabled={createAthlete.isPending}
                            className="rounded-2xl bg-gradient-to-r from-cyan-400 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {createAthlete.isPending ? 'Olusturuluyor...' : 'Sporcuyu ekle'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
