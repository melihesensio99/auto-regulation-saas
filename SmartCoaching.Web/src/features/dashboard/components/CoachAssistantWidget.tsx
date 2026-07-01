import React from 'react';
import { Bot, Send, Sparkles, FileText, Activity } from 'lucide-react';

export const CoachAssistantWidget: React.FC = () => {
    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Chat History Sidebar */}
            <div className="w-80 glass-panel flex flex-col hidden lg:flex">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-bold">Chat History</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {[
                        'Summarize Alex\'s progress',
                        'Diet adjustments for bulk',
                        'Suggest leg day variations'
                    ].map((title, i) => (
                        <button key={i} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-300 text-sm transition-colors border border-transparent hover:border-white/10 truncate">
                            {title}
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 glass-panel flex flex-col relative overflow-hidden">
                {/* Decorative background blur */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-neon-purple/5 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="p-6 border-b border-white/10 flex items-center gap-3 bg-black/20 z-10">
                    <div className="w-10 h-10 rounded-full bg-neon-purple/20 flex items-center justify-center border border-neon-purple/50 shadow-[0_0_15px_rgba(138,43,226,0.3)]">
                        <Bot className="w-5 h-5 text-neon-purple" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold glow-text">AI Coach Assistant</h2>
                        <p className="text-xs text-gray-400">Powered by Mistral & Gemini</p>
                    </div>
                </div>

                <div className="flex-1 p-6 overflow-y-auto z-10 space-y-6">
                    {/* User Message */}
                    <div className="flex justify-end">
                        <div className="max-w-[70%] bg-neon-cyan/10 border border-neon-cyan/30 text-white rounded-2xl rounded-tr-none p-4 shadow-[0_4px_20px_rgba(0,240,255,0.1)]">
                            <p>Can you summarize the progress of all my active athletes this week?</p>
                        </div>
                    </div>
                    
                    {/* AI Message */}
                    <div className="flex justify-start">
                        <div className="max-w-[80%] glass-panel rounded-2xl rounded-tl-none p-5 relative">
                            <div className="absolute -left-3 -top-3 w-8 h-8 bg-dark-bg rounded-full flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-neon-purple" />
                            </div>
                            <p className="text-gray-200 leading-relaxed">
                                Here is a quick summary of your active athletes:
                                <br/><br/>
                                <strong>1. Alex Mitchell:</strong> Excellent adherence (95%). Weight is tracking perfectly towards the hypertrophy goal. AI suggests increasing volume on lateral delts.<br/>
                                <strong>2. Sarah Jones:</strong> Missed 2 workouts this week due to stress. You might want to check in on her recovery.<br/>
                                <strong>3. David Chen:</strong> Hitting macro targets consistently. Lost 1.2kg this week.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Prompt Suggestions & Input */}
                <div className="p-6 bg-black/20 z-10 border-t border-white/5">
                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                        {[
                            { label: 'Summarize Check-ins', icon: FileText },
                            { label: 'Analyze Progress Logs', icon: Activity },
                            { label: 'Optimize Diets', icon: Sparkles }
                        ].map((btn, i) => (
                            <button key={i} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-sm text-gray-300 transition-all">
                                <btn.icon className="w-4 h-4" />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder="Ask the AI Assistant anything about your athletes or programs..." 
                            className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple shadow-[0_0_15px_rgba(138,43,226,0.1)] transition-all"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/80 hover:shadow-[0_0_15px_rgba(138,43,226,0.5)] transition-all">
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
