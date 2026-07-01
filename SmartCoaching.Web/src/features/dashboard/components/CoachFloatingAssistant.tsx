import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Sparkles, X, Loader2, Maximize2, Minimize2 } from 'lucide-react';
import { coachService } from '../services/coachService';
import ReactMarkdown from 'react-markdown';

interface Message {
    id: string;
    role: 'user' | 'ai';
    content: string;
}

interface CoachFloatingAssistantProps {
    athleteId: string;
    athleteName: string;
    onActionReceived?: (action: string, data: any) => void;
}

export const CoachFloatingAssistant: React.FC<CoachFloatingAssistantProps> = ({ athleteId, athleteName, onActionReceived }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { id: '1', role: 'ai', content: `Merhaba! Ben ${athleteName} için bağlama sahibim. Beslenmesini, idmanını veya kalori hedeflerini güncelleyebilirim.` }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (isOpen) {
            messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen, isExpanded]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userText = input.trim();
        setInput('');
        const newUserMsg: Message = { id: Date.now().toString(), role: 'user', content: userText };
        setMessages(prev => [...prev, newUserMsg]);
        setIsLoading(true);

        try {
            // Updated backend call with context
            const response = await coachService.askAiAgent(userText, athleteId, athleteName);
            const aiMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: response.textReply };
            setMessages(prev => [...prev, aiMsg]);

            if (response.uiAction && onActionReceived) {
                onActionReceived(response.uiAction, response.actionData);
            }

        } catch (error) {
            console.error('Failed to ask AI agent', error);
            const errorMsg: Message = { id: (Date.now() + 1).toString(), role: 'ai', content: 'Üzgünüm, şu an bağlantı kuramıyorum.' };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button 
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-neon-purple rounded-full flex items-center justify-center shadow-[0_0_25px_rgba(138,43,226,0.5)] hover:scale-110 transition-transform z-50 group"
            >
                <Bot className="w-8 h-8 text-white group-hover:animate-pulse" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-neon-cyan rounded-full border-2 border-[#0a0f1b] animate-pulse"></div>
            </button>
        );
    }

    return (
        <div className={`fixed bottom-6 right-6 bg-black/80 backdrop-blur-xl border border-neon-purple/50 shadow-[0_0_40px_rgba(138,43,226,0.3)] flex flex-col z-50 transition-all duration-300 ${isExpanded ? 'w-[600px] h-[800px] rounded-2xl' : 'w-[380px] h-[550px] rounded-2xl'}`}>
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-neon-purple/20 to-transparent rounded-t-2xl">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-neon-purple/30 flex items-center justify-center border border-neon-purple/50">
                        <Bot className="w-4 h-4 text-neon-purple" />
                    </div>
                    <div>
                        <h3 className="font-bold text-white text-sm">AI Koç Asistanı</h3>
                        <p className="text-[10px] text-gray-400">Bağlam: {athleteName}</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-400 hover:text-white transition-colors p-1">
                        {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    </button>
                    <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white transition-colors p-1">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' ? (
                            <div className="max-w-[80%] bg-neon-purple/20 border border-neon-purple/30 text-white rounded-2xl rounded-tr-none p-3 text-sm shadow-[0_4px_15px_rgba(138,43,226,0.1)]">
                                <p>{msg.content}</p>
                            </div>
                        ) : (
                            <div className="max-w-[90%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 relative">
                                <div className="absolute -left-2 -top-2 w-6 h-6 bg-black rounded-full flex items-center justify-center border border-white/10">
                                    <Sparkles className="w-3 h-3 text-neon-cyan" />
                                </div>
                                <div className="text-gray-200 text-sm leading-relaxed prose prose-invert prose-sm max-w-none">
                                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="max-w-[80%] bg-white/5 border border-white/10 rounded-2xl rounded-tl-none p-4 relative flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-neon-cyan animate-spin" />
                            <span className="text-gray-400 text-xs">AI Düşünüyor...</span>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/10 bg-black/40 rounded-b-2xl">
                <div className="relative">
                    <input 
                        type="text" 
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                        placeholder={`${athleteName} için işlem yap...`} 
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-4 pr-12 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple focus:ring-1 focus:ring-neon-purple transition-all disabled:opacity-50"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !input.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-lg bg-neon-purple text-white hover:bg-neon-purple/80 transition-all disabled:opacity-50"
                    >
                        <Send className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    );
};
