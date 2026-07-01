import { useState, useRef, type ChangeEvent } from 'react';
import { Camera, Search, Loader2, Plus, Zap, Trash2, CheckCircle2 } from 'lucide-react';
import { nutritionService, type FatSecretFoodItem, type AnalyzeFoodImageResponse } from '@/shared/services/nutrition.service';

interface AthleteNutritionTrackerSectionProps {
    targetCalories: number;
    currentCalories: number;
    onAddCalories: (addedCals: number, addedFoods: string[]) => void;
    consumedFoods?: any[];
    setConsumedFoods?: React.Dispatch<React.SetStateAction<any[]>>;
}

interface StagedFoodItem extends FatSecretFoodItem {
    grams: number;
    baseCalories: number;
    baseProtein: number;
    baseCarbs: number;
    baseFats: number;
}

export const AthleteNutritionTrackerSection = ({
    targetCalories,
    currentCalories,
    onAddCalories,
    consumedFoods = [],
    setConsumedFoods
}: AthleteNutritionTrackerSectionProps) => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<FatSecretFoodItem[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const [stagedFoods, setStagedFoods] = useState<StagedFoodItem[]>([]);

    const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        try {
            const results = await nutritionService.searchFatSecret(searchQuery);
            setSearchResults(results || []);
        } catch (error) {
            console.error('FatSecret search error', error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleStageFood = (food: FatSecretFoodItem) => {
        const newItem: StagedFoodItem = {
            ...food,
            grams: 100,
            baseCalories: food.calories || 0,
            baseProtein: food.protein || 0,
            baseCarbs: food.carbs || 0,
            baseFats: food.fats || 0
        };
        setStagedFoods([...stagedFoods, newItem]);
        setSearchQuery('');
        setSearchResults([]);
    };

    const handleUpdateGrams = (index: number, newGrams: number) => {
        if (newGrams < 0) return;
        const newFoods = [...stagedFoods];
        const food = newFoods[index];
        food.grams = newGrams;
        const ratio = newGrams / 100;
        
        food.calories = Math.round(food.baseCalories * ratio);
        food.protein = food.baseProtein * ratio;
        food.carbs = food.baseCarbs * ratio;
        food.fats = food.baseFats * ratio;
        
        setStagedFoods(newFoods);
    };

    const handleRemoveStagedFood = (index: number) => {
        const newFoods = [...stagedFoods];
        newFoods.splice(index, 1);
        setStagedFoods(newFoods);
    };

    const handleCommitFoods = () => {
        if (stagedFoods.length === 0) return;
        const totalCals = stagedFoods.reduce((sum, f) => sum + f.calories, 0);
        const names = stagedFoods.map(f => `${f.name} (${f.grams}g)`);
        onAddCalories(totalCals, names);
        if (setConsumedFoods) {
            setConsumedFoods(prev => [...prev, ...stagedFoods]);
        }
        setStagedFoods([]);
    };

    const handleRemoveConsumedFood = (index: number) => {
        if (!setConsumedFoods) return;
        const removed = consumedFoods[index];
        const newCals = currentCalories - removed.calories;
        const netAdded = -removed.calories; // Decrease calories
        onAddCalories(netAdded, []); // Pass negative to subtract
        setConsumedFoods(prev => prev.filter((_, i) => i !== index));
    };

    const handleUpdateConsumedGrams = (index: number, newGrams: number) => {
        if (!setConsumedFoods || newGrams < 0) return;
        const newFoods = [...consumedFoods];
        const food = { ...newFoods[index] };
        const oldCals = food.calories;
        
        food.grams = newGrams;
        const ratio = newGrams / 100;
        food.calories = Math.round(food.baseCalories * ratio);
        food.protein = food.baseProtein * ratio;
        food.carbs = food.baseCarbs * ratio;
        food.fats = food.baseFats * ratio;
        
        newFoods[index] = food;
        setConsumedFoods(newFoods);
        
        const diff = food.calories - oldCals;
        onAddCalories(diff, []);
    };

    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsAnalyzingImage(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
            try {
                const base64 = (reader.result as string).split(',')[1];
                const analysis: AnalyzeFoodImageResponse = await nutritionService.analyzeImage(base64);
                if (analysis && analysis.foodName) {
                    const initGrams = analysis.estimatedGrams || 100;
                    
                    // If Mistral provided an estimated total grams, its calories/macros are for THAT total amount!
                    // To support proportional editing, we need base (per 100g) values.
                    const baseRatio = initGrams / 100;
                    
                    const aiFood: StagedFoodItem = {
                        id: `ai-${Date.now()}`,
                        name: analysis.foodName,
                        description: 'Mistral AI Tespiti',
                        calories: analysis.calories,
                        protein: analysis.protein,
                        carbs: analysis.carbs,
                        fats: analysis.fats,
                        grams: initGrams,
                        baseCalories: analysis.calories / baseRatio,
                        baseProtein: analysis.protein / baseRatio,
                        baseCarbs: analysis.carbs / baseRatio,
                        baseFats: analysis.fats / baseRatio
                    };
                    setStagedFoods(prev => [...prev, aiFood]);
                }
            } catch (error) {
                console.error('Image analysis error', error);
            } finally {
                setIsAnalyzingImage(false);
                if (fileInputRef.current) fileInputRef.current.value = '';
            }
        };
        reader.readAsDataURL(file);
    };

    const inputClassName = "w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-neon-cyan/50 focus:bg-black/60 focus:ring-1 focus:ring-neon-cyan/50";

    const totalStagedCalories = stagedFoods.reduce((sum, f) => sum + f.calories, 0);
    const totalStagedProtein = stagedFoods.reduce((sum, f) => sum + (f.protein || 0), 0);
    const totalStagedCarbs = stagedFoods.reduce((sum, f) => sum + (f.carbs || 0), 0);
    const totalStagedFats = stagedFoods.reduce((sum, f) => sum + (f.fats || 0), 0);
    const projectedCalories = currentCalories + totalStagedCalories;
    const percentage = targetCalories > 0 ? Math.round((projectedCalories / targetCalories) * 100) : 0;
    const cappedPercentage = Math.min(100, percentage);
    const radius = 50;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (cappedPercentage / 100) * circumference;
    
    const isOverTarget = targetCalories > 0 && projectedCalories > targetCalories;
    const progressColorClass = isOverTarget ? "text-red-500" : "text-emerald-400";

    return (
        <section className={`glass-panel p-8 border-l-2 mb-6 ${isOverTarget ? 'border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.1)]' : 'border-emerald-400 shadow-[0_0_40px_rgba(52,211,153,0.1)]'}`}>
            <div className="flex flex-col gap-5 border-b border-white/10 pb-5 xl:flex-row xl:items-center xl:justify-between">
                <div>
                    <span className={`text-[11px] uppercase tracking-[0.28em] flex items-center gap-2 ${progressColorClass}`}>
                        <Zap className="w-4 h-4" /> Akıllı Besin Takibi
                    </span>
                    <h2 className="mt-2 text-2xl font-bold text-white">Öğün Ekle & Kalori Durumu</h2>
                    <p className="mt-2 text-sm text-gray-400">Yediklerini ekle, kalori hedefini anlık olarak takip et.</p>
                </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_350px] items-start">
                
                {/* Left Side: Staged Foods and Macros */}
                <div className="space-y-6">
                    <div className="bg-white/[0.02] border border-white/5 rounded-2xl p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-xl font-semibold text-white">Eklenecek Besinler</h3>
                            <span className={`${progressColorClass} font-bold text-xl`}>+{totalStagedCalories} kcal</span>
                        </div>

                        {stagedFoods.length === 0 ? (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-white/10 rounded-xl">
                                Henüz besin eklenmedi. Sağdaki araçları kullanarak öğün ekleyin.
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {stagedFoods.map((food, idx) => (
                                    <div key={idx} className="bg-black/30 border border-white/10 rounded-xl p-4 flex flex-col gap-4 group">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <span className="font-medium text-white block mb-1">{food.name}</span>
                                                <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                                                    <div>Protein: <span className="text-neon-cyan">{food.protein?.toFixed(1) || 0}g</span></div>
                                                    <div>Karbonhidrat: <span className="text-neon-purple">{food.carbs?.toFixed(1) || 0}g</span></div>
                                                    <div>Yağ: <span className="text-yellow-400">{food.fats?.toFixed(1) || 0}g</span></div>
                                                </div>
                                            </div>
                                            
                                            <div className="flex items-center gap-4">
                                                <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
                                                    <input 
                                                        type="number" 
                                                        min="0"
                                                        value={food.grams || ''}
                                                        onChange={(e) => handleUpdateGrams(idx, Number(e.target.value))}
                                                        className="w-14 bg-transparent text-white text-right outline-none text-sm"
                                                    />
                                                    <span className="text-gray-500 text-sm">g</span>
                                                </div>
                                                <span className={`font-semibold w-16 text-right ${progressColorClass}`}>{food.calories} kcal</span>
                                                <button 
                                                    onClick={() => handleRemoveStagedFood(idx)}
                                                    className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <div className="mt-6 pt-6 border-t border-white/10">
                                    <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">Eklenen Makrolar</h4>
                                    <div className="grid grid-cols-3 gap-4 text-center">
                                        <div className="bg-black/20 p-3 rounded-lg border border-neon-cyan/20">
                                            <div className="text-xs text-gray-500 mb-1">Protein</div>
                                            <div className="font-bold text-neon-cyan">{totalStagedProtein.toFixed(1)}g</div>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg border border-neon-purple/20">
                                            <div className="text-xs text-gray-500 mb-1">Karbonhidrat</div>
                                            <div className="font-bold text-neon-purple">{totalStagedCarbs.toFixed(1)}g</div>
                                        </div>
                                        <div className="bg-black/20 p-3 rounded-lg border border-yellow-400/20">
                                            <div className="text-xs text-gray-500 mb-1">Yağ</div>
                                            <div className="font-bold text-yellow-400">{totalStagedFats.toFixed(1)}g</div>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={handleCommitFoods}
                                    className={`w-full mt-6 flex items-center justify-center gap-2 py-4 px-4 rounded-xl transition-all font-bold text-base ${isOverTarget ? 'bg-red-500/20 border border-red-500/50 text-red-500 hover:bg-red-500/30 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/30 shadow-[0_0_20px_rgba(52,211,153,0.2)]'}`}
                                >
                                    <CheckCircle2 className="w-5 h-5" />
                                    Günlük Kaloriye İşle (+{totalStagedCalories} kcal)
                                </button>
                            </div>
                        )}
                        
                        {consumedFoods.length > 0 && (
                            <div className="mt-8 border-t border-white/10 pt-6">
                                <h3 className="text-lg font-semibold text-white mb-4">Bugün Tüketilenler</h3>
                                <div className="space-y-4">
                                    {consumedFoods.map((food, idx) => (
                                        <div key={`consumed-${idx}`} className="bg-black/20 border border-white/5 rounded-xl p-4 flex flex-col gap-4 group">
                                            <div className="flex justify-between items-start gap-4">
                                                <div className="flex-1">
                                                    <span className="font-medium text-white block mb-1">{food.name}</span>
                                                    <div className="grid grid-cols-3 gap-2 text-xs text-gray-400">
                                                        <div>Protein: <span className="text-neon-cyan">{food.protein?.toFixed(1) || 0}g</span></div>
                                                        <div>Karb: <span className="text-neon-purple">{food.carbs?.toFixed(1) || 0}g</span></div>
                                                        <div>Yağ: <span className="text-yellow-400">{food.fats?.toFixed(1) || 0}g</span></div>
                                                    </div>
                                                </div>
                                                
                                                <div className="flex items-center gap-4">
                                                    <div className="flex items-center gap-2 bg-black/40 border border-white/10 rounded-lg px-2 py-1">
                                                        <input 
                                                            type="number" 
                                                            min="0"
                                                            value={food.grams || ''}
                                                            onChange={(e) => handleUpdateConsumedGrams(idx, Number(e.target.value))}
                                                            className="w-14 bg-transparent text-white text-right outline-none text-sm"
                                                        />
                                                        <span className="text-gray-500 text-sm">g</span>
                                                    </div>
                                                    <span className="font-semibold w-16 text-right text-gray-300">{food.calories} kcal</span>
                                                    <button 
                                                        onClick={() => handleRemoveConsumedFood(idx)}
                                                        className="text-red-400/50 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Side: Circular Chart & Tools */}
                <div className="space-y-6">
                    {/* Progress Chart */}
                    <div className="bg-black/20 p-6 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
                        <div className="relative flex items-center justify-center w-40 h-40">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    fill="transparent"
                                    stroke="rgba(255,255,255,0.05)"
                                    strokeWidth="10"
                                />
                                <circle
                                    cx="80"
                                    cy="80"
                                    r={radius}
                                    fill="transparent"
                                    stroke="currentColor"
                                    strokeWidth="10"
                                    strokeDasharray={circumference}
                                    strokeDashoffset={strokeDashoffset}
                                    strokeLinecap="round"
                                    className={`${progressColorClass} transition-all duration-1000 ease-out ${isOverTarget ? 'drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]' : ''}`}
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center justify-center text-center">
                                <span className={`text-2xl font-bold tracking-tighter ${isOverTarget ? 'text-red-500' : 'text-white'}`}>{projectedCalories}</span>
                                <span className="text-[10px] text-gray-400 uppercase tracking-widest mt-1">/ {targetCalories} kcal</span>
                                <span className={`${progressColorClass} font-semibold text-xs mt-1`}>% {percentage}</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-400 mt-4 text-center">
                            Mevcut: <span className="text-white font-medium">{currentCalories}</span> + Eklenecek: <span className={`${progressColorClass} font-medium`}>{totalStagedCalories}</span>
                        </p>
                        {isOverTarget && (
                            <p className="text-xs text-red-500 mt-2 text-center animate-pulse font-medium">Hedefi aşmak üzeresiniz!</p>
                        )}
                    </div>

                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Camera className="w-4 h-4 text-neon-purple" />
                            Yapay Zeka (Mistral Vision)
                        </h3>
                        <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isAnalyzingImage}
                            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-neon-purple/20 border border-neon-purple/50 text-white rounded-xl hover:bg-neon-purple/30 transition-all text-sm font-medium disabled:opacity-50"
                        >
                            {isAnalyzingImage ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                            {isAnalyzingImage ? 'Analiz Ediliyor...' : 'Fotoğraf Tara'}
                        </button>
                    </div>

                    <div className="bg-black/20 p-5 rounded-2xl border border-white/5">
                        <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                            <Search className="w-4 h-4 text-neon-cyan" />
                            Arama Yap (FatSecret)
                        </h3>
                        <div className="flex gap-2">
                            <input 
                                type="text" 
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Örn: Yulaf..." 
                                className={`${inputClassName} py-2.5 text-sm`} 
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                disabled={isSearching}
                                className="px-3 bg-neon-cyan/20 border border-neon-cyan/50 text-white rounded-xl hover:bg-neon-cyan/30 transition-all disabled:opacity-50"
                            >
                                {isSearching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                            </button>
                        </div>

                        {searchResults.length > 0 && (
                            <div className="mt-3 space-y-2 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                                {searchResults.map((food) => (
                                    <div key={food.id} className="flex flex-col p-2.5 bg-black/40 border border-white/10 rounded-lg hover:border-white/20 transition-colors">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <p className="text-xs font-medium text-white">{food.name}</p>
                                                <p className="text-[10px] text-emerald-400 font-semibold">{food.calories} kcal <span className="text-gray-500 font-normal">/ 100g</span></p>
                                            </div>
                                            <button 
                                                type="button"
                                                onClick={() => handleStageFood(food)}
                                                className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-md hover:bg-emerald-500/30 transition-colors"
                                            >
                                                <Plus className="w-3 h-3" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};
