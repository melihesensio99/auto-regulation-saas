import React, { useState } from 'react';
import { Search, Camera, ScanLine, CheckCircle2, Apple } from 'lucide-react';

export const NutritionTracker: React.FC = () => {
    const [isScanning, setIsScanning] = useState(false);
    
    const handleScan = () => {
        setIsScanning(true);
        setTimeout(() => setIsScanning(false), 3000);
    };

    // Circular Chart Variables
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const percentConsumed = (1250 / 2800) * 100;
    const strokeDashoffset = circumference - (percentConsumed / 100) * circumference;

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold glow-text">Daily Nutrition Tracker</h2>
                <p className="text-gray-400">Log your meals manually or let Mistral AI estimate calories from a photo.</p>
            </div>

            {/* Top Section: Circular Chart & Macros */}
            <div className="glass-panel p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-center border-t-2 border-neon-cyan/50">
                
                {/* Circular Chart */}
                <div className="relative flex items-center justify-center">
                    <svg className="w-48 h-48 transform -rotate-90">
                        {/* Background Circle */}
                        <circle
                            className="text-white/10"
                            strokeWidth="12"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="96"
                            cy="96"
                        />
                        {/* Progress Circle */}
                        <circle
                            className="text-neon-cyan drop-shadow-[0_0_10px_rgba(0,240,255,0.8)]"
                            strokeWidth="12"
                            strokeDasharray={circumference}
                            strokeDashoffset={strokeDashoffset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx="96"
                            cy="96"
                            style={{ transition: 'stroke-dashoffset 1.5s ease-in-out' }}
                        />
                    </svg>
                    {/* Inner Text */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-3xl font-bold text-white">1,250</span>
                        <span className="text-xs text-neon-cyan uppercase tracking-wider font-semibold">/ 2800 kcal</span>
                    </div>
                </div>

                {/* Macro Details */}
                <div className="space-y-4">
                    <h3 className="text-xl font-bold border-b border-white/10 pb-2">Today's Macros</h3>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Protein</span>
                            <div className="flex items-center gap-3 w-1/2">
                                <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-neon-cyan h-full rounded-full" style={{ width: '40%' }}></div>
                                </div>
                                <span className="text-sm font-medium">85g</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Carbs</span>
                            <div className="flex items-center gap-3 w-1/2">
                                <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-neon-purple h-full rounded-full" style={{ width: '60%' }}></div>
                                </div>
                                <span className="text-sm font-medium">150g</span>
                            </div>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-gray-400">Fats</span>
                            <div className="flex items-center gap-3 w-1/2">
                                <div className="flex-1 bg-white/10 h-2 rounded-full overflow-hidden">
                                    <div className="bg-yellow-400 h-full rounded-full" style={{ width: '30%' }}></div>
                                </div>
                                <span className="text-sm font-medium">40g</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* AI Camera Widget */}
            <div className="glass-panel p-1 relative overflow-hidden group">
                {/* Glowing border effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-purple to-neon-cyan opacity-20 group-hover:opacity-50 blur-xl transition-opacity duration-700"></div>
                
                <div className="relative bg-dark-bg/80 backdrop-blur-xl p-8 rounded-xl border border-white/10 text-center">
                    <div 
                        onClick={handleScan}
                        className={`w-32 h-32 mx-auto rounded-full border-2 border-dashed ${isScanning ? 'border-neon-cyan animate-spin-slow' : 'border-gray-500 hover:border-neon-cyan'} flex items-center justify-center cursor-pointer transition-colors relative`}
                    >
                        {isScanning ? (
                            <ScanLine className="w-12 h-12 text-neon-cyan animate-pulse" />
                        ) : (
                            <Camera className="w-10 h-10 text-gray-400 group-hover:text-neon-cyan transition-colors" />
                        )}
                        
                        {isScanning && (
                            <div className="absolute inset-0 rounded-full shadow-[0_0_30px_rgba(0,240,255,0.6)]"></div>
                        )}
                    </div>

                    <h3 className="mt-6 text-xl font-bold text-white">
                        {isScanning ? 'Mistral AI is analyzing your food...' : 'Drop a photo or click to scan'}
                    </h3>
                    <p className="text-sm text-gray-400 mt-2">
                        Upload a photo of your meal. We will automatically estimate the calories and macros.
                    </p>
                </div>
            </div>

            {/* FatSecret Search Bar */}
            <div className="glass-panel p-6">
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Or search food manually (Powered by FatSecret)..." 
                        className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all"
                    />
                </div>
                
                {/* Mock Search Results */}
                <div className="mt-4 space-y-2">
                    {[
                        { name: 'Grilled Chicken Breast', desc: 'Per 100g - 165 kcal | 31g P | 0g C | 3.6g F' },
                        { name: 'Brown Rice', desc: 'Per 1 cup - 216 kcal | 5g P | 45g C | 1.8g F' }
                    ].map((food, i) => (
                        <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-transparent hover:border-white/10">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center">
                                    <Apple className="w-5 h-5 text-neon-purple" />
                                </div>
                                <div>
                                    <p className="font-semibold">{food.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">{food.desc}</p>
                                </div>
                            </div>
                            <button className="text-neon-cyan hover:text-white transition-colors">
                                <CheckCircle2 className="w-6 h-6" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
