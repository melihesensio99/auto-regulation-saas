import type { FormEvent } from 'react';

interface AthleteDailyLogSectionProps {
    calories: string;
    steps: string;
    weight: string;
    notes: string;
    workoutCompleted: boolean;
    frontPhotoUrl: string;
    backPhotoUrl: string;
    sidePhotoUrl: string;
    calorieProgress: number;
    stepProgress: number;
    dailyCompletion: number;
    isLogging: boolean;
    onSubmit: (event: FormEvent) => void;
    onCaloriesChange: (value: string) => void;
    onStepsChange: (value: string) => void;
    onWeightChange: (value: string) => void;
    onNotesChange: (value: string) => void;
    onWorkoutCompletedChange: (value: boolean) => void;
    onFrontPhotoUrlChange: (value: string) => void;
    onBackPhotoUrlChange: (value: string) => void;
    onSidePhotoUrlChange: (value: string) => void;
}

export const AthleteDailyLogSection = ({
    calories,
    steps,
    weight,
    notes,
    workoutCompleted,
    frontPhotoUrl,
    backPhotoUrl,
    sidePhotoUrl,
    calorieProgress,
    stepProgress,
    dailyCompletion,
    isLogging,
    onSubmit,
    onCaloriesChange,
    onStepsChange,
    onWeightChange,
    onNotesChange,
    onWorkoutCompletedChange,
    onFrontPhotoUrlChange,
    onBackPhotoUrlChange,
    onSidePhotoUrlChange,
}: AthleteDailyLogSectionProps) => {
    const isSunday = new Date().getDay() === 0;

    const inputClassName = "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-500 focus:border-emerald-400/50 focus:bg-black/60 focus:ring-1 focus:ring-emerald-400/50";

    return (
        <section className="glass-panel p-8 border-l-2 border-emerald-400">
            <div className="flex flex-col gap-5 border-b border-white/10 pb-5 xl:flex-row xl:items-end xl:justify-between">
                <div>
                    <span className="text-[11px] uppercase tracking-[0.28em] text-emerald-400">Günlük Kayıt</span>
                    <h2 className="mt-2 text-2xl font-bold text-white">Bugünün Verilerini Ekle</h2>
                    <p className="mt-2 text-sm text-gray-400">Kalori, adım ve notlarını tek akışta güncelle.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                    <span className="bg-neon-cyan/10 text-neon-cyan border border-neon-cyan/20 px-4 py-2 rounded-lg text-sm font-semibold">{Math.round(calorieProgress)}% kalori</span>
                    <span className="bg-emerald-400/10 text-emerald-400 border border-emerald-400/20 px-4 py-2 rounded-lg text-sm font-semibold">{Math.round(stepProgress)}% adım</span>
                    <span className="bg-neon-purple/10 text-neon-purple border border-neon-purple/20 px-4 py-2 rounded-lg text-sm font-semibold">{Math.round(dailyCompletion)}% genel uyum</span>
                </div>
            </div>

            <form onSubmit={onSubmit} className="mt-6 space-y-5">
                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Alınan Kalori (kcal)</label>
                        <input className={inputClassName} type="number" value={calories} onChange={(e) => onCaloriesChange(e.target.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-300">Atılan Adım</label>
                        <input className={inputClassName} type="number" value={steps} onChange={(e) => onStepsChange(e.target.value)} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Güncel Kilo (Opsiyonel)</label>
                    <input className={inputClassName} type="number" step="0.1" value={weight} onChange={(e) => onWeightChange(e.target.value)} />
                </div>

                <label className="flex items-center gap-3 p-4 rounded-xl border border-white/10 bg-black/20 cursor-pointer hover:bg-black/40 transition-colors">
                    <input
                        type="checkbox"
                        checked={workoutCompleted}
                        onChange={(e) => onWorkoutCompletedChange(e.target.checked)}
                        className="w-5 h-5 rounded border-white/20 bg-black/50 text-emerald-400 focus:ring-emerald-400/50 focus:ring-offset-0"
                    />
                    <span className="text-sm font-medium text-white">Antrenmanımı tamamladım</span>
                </label>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-300">Günün Notu</label>
                    <textarea className={`${inputClassName} min-h-[100px] resize-none`} value={notes} onChange={(e) => onNotesChange(e.target.value)} />
                </div>

                {isSunday && (
                    <div className="rounded-xl border border-neon-purple/20 bg-neon-purple/5 p-5 mt-4">
                        <span className="text-[11px] uppercase tracking-[0.28em] text-neon-purple">Haftalık Form</span>
                        <p className="mt-2 text-sm text-gray-400 mb-4">
                            Pazar kontrolü için fotoğraf bağlantılarını ekle.
                        </p>
                        <div className="grid gap-4">
                            <input className={inputClassName} type="url" placeholder="Ön fotoğraf URL" value={frontPhotoUrl} onChange={(e) => onFrontPhotoUrlChange(e.target.value)} />
                            <input className={inputClassName} type="url" placeholder="Arka fotoğraf URL" value={backPhotoUrl} onChange={(e) => onBackPhotoUrlChange(e.target.value)} />
                            <input className={inputClassName} type="url" placeholder="Yan fotoğraf URL" value={sidePhotoUrl} onChange={(e) => onSidePhotoUrlChange(e.target.value)} />
                        </div>
                    </div>
                )}

                <div className="pt-4">
                    <button
                        type="submit"
                        className="w-full glow-btn glow-btn-emerald py-4 text-[15px] rounded-xl flex justify-center disabled:opacity-50"
                        disabled={isLogging}
                    >
                        {isLogging ? 'Kaydediliyor...' : 'Günlük Veriyi Kaydet'}
                    </button>
                </div>
            </form>
        </section>
    );
};
