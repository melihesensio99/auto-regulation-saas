import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, FileText, Activity, Loader2, User } from 'lucide-react';
import { coachService, type AthleteDto } from '../services/coachService';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

export const CoachAssistantWidget: React.FC<{ onSelectAthlete?: (id: string) => void }> = ({ onSelectAthlete }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: 'Merhaba Koç! Ben senin yapay zeka asistanınım. Hangi öğrencilerinin log girdiğini sorabilir, diyet programlarını optimize ettirebilirsin. Sana nasıl yardımcı olabilirim?' }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [athletes, setAthletes] = useState<AthleteDto[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        coachService.getAthletes().then(setAthletes).catch(console.error);
    }, []);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            const response = await coachService.askAiAgent(userText);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: response.textReply };
            setMessages(prev => [...prev, aiMsg]);
        } catch (error) {
            console.error('Failed to ask AI agent', error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: 'Üzgünüm, şu an bağlantı kuramıyorum. Lütfen API anahtarlarının yapılandırıldığından emin ol.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSuggestion = (text: string) => {
        setInput(text);
    };

    return (
        <div className="h-[calc(100vh-8rem)] flex gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Chat History Sidebar */}
            <div className="w-80 glass-panel flex flex-col hidden lg:flex">
                <div className="p-6 border-b border-white/10">
                    <h3 className="text-lg font-bold">Öğrenciler</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                    {athletes.map(athlete => (
                        <button 
                            key={athlete.id} 
                            onClick={() => onSelectAthlete && onSelectAthlete(athlete.id)} 
                            className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-300 text-sm transition-colors border border-transparent hover:border-white/10 flex items-center gap-3"
                        >
                            <div className="w-8 h-8 rounded-full bg-neon-cyan/20 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-neon-cyan" />
                            </div>
                            <span className="truncate">{athlete.firstName} {athlete.lastName}</span>
                        </button>
                    ))}
                    {athletes.length === 0 && (
                        <p className="text-xs text-gray-500 text-center mt-4">Henüz öğrenci yok.</p>
                    )}
                </div>
                
                <div className="p-6 border-t border-white/10">
                    <h3 className="text-sm font-bold mb-3 text-gray-400 uppercase tracking-wider">Önerilen Sorgular</h3>
                    <div className="space-y-2">
                        {[
                            'Tüm aktif öğrencilerimin gelişimini özetle',
                            'Bugün kimler beslenme verisi girdi?',
                        ].map((title, i) => (
                            <button key={i} onClick={() => handleSuggestion(title)} className="w-full text-left p-3 rounded-xl hover:bg-white/5 text-gray-300 text-xs transition-colors border border-transparent hover:border-white/10">
                                {title}
                            </button>
                        ))}
                    </div>
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

                <div className="flex-1 p-6 overflow-y-auto z-10 space-y-6 custom-scrollbar">
                    {messages.map((msg) => (
                        <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            {msg.role === 'user' ? (
                                <div className="max-w-[70%] bg-neon-cyan/10 border border-neon-cyan/30 text-white rounded-2xl rounded-tr-none p-4 shadow-[0_4px_20px_rgba(0,240,255,0.1)]">
                                    <p>{msg.content}</p>
                                </div>
                            ) : (
                                <div className="max-w-[80%] glass-panel rounded-2xl rounded-tl-none p-5 relative">
                                    <div className="absolute -left-3 -top-3 w-8 h-8 bg-dark-bg rounded-full flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-neon-purple" />
                                    </div>
                                    <div className="text-gray-200 leading-relaxed prose prose-invert max-w-none prose-sm">
                                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="max-w-[80%] glass-panel rounded-2xl rounded-tl-none p-5 relative flex items-center gap-3">
                                <Loader2 className="w-5 h-5 text-neon-purple animate-spin" />
                                <span className="text-gray-400 text-sm">Yapay zeka düşünüyor...</span>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Prompt Suggestions & Input */}
                <div className="p-6 bg-black/20 z-10 border-t border-white/5">
                    <div className="flex gap-3 mb-4 overflow-x-auto pb-2 custom-scrollbar">
                        {[
                            { label: 'Öğrencileri Özetle', icon: FileText, text: 'Tüm öğrencilerimin son durumunu özetler misin?' },
                            { label: 'İlerlemeleri Analiz Et', icon: Activity, text: 'Veri girişlerini analiz et' },
                            { label: 'Diyetleri Optimize Et', icon: Sparkles, text: 'Diyet optimizasyonu öner' }
                        ].map((btn, i) => (
                            <button key={i} onClick={() => handleSuggestion(btn.text)} className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-neon-cyan/50 hover:bg-neon-cyan/10 text-sm text-gray-300 transition-all whitespace-nowrap">
                                <btn.icon className="w-4 h-4" />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                    
                    <div className="relative">
                        <input 
                            type="text" 
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                            placeholder="Koçluk asistanına her şeyi sorabilirsin..." 
                            className="w-full bg-black/40 border border-white/20 rounded-xl py-4 pl-6 pr-14 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple shadow-[0_0_15px_rgba(138,43,226,0.1)] transition-all disabled:opacity-50"
                        />
                        <button 
                            onClick={handleSend}
                            disabled={isLoading || !input.trim()}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/80 hover:shadow-[0_0_15px_rgba(138,43,226,0.5)] transition-all disabled:opacity-50"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
