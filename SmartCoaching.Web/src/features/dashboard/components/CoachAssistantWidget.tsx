import { useEffect, useMemo, useRef, useState } from 'react';
import { dashboardService } from '../services/dashboard.service';

type ChatRole = 'assistant' | 'user';

interface CoachAssistantWidgetProps {
    contextAthleteId?: string | null;
    contextAthleteName?: string | null;
}

interface ChatMessage {
    id: string;
    role: ChatRole;
    text: string;
    meta?: string | null;
}

const quickPrompts = [
    'Bugun dikkat gerektiren sporculari ozetle.',
    'Seçili sporcunun son gelişim kaydını yorumla.',
    'Seçili sporcunun hedef kalorisini 2200 yap.',
    'Bu haftaki aktif sporcuları çıkar.'
];

const initialMessages: ChatMessage[] = [
    {
        id: 'assistant-welcome',
        role: 'assistant',
        text: 'Merhaba. Sporcu verilerini hızlıca özetleyebilirim, eksikleri çıkarabilirim veya hedef güncellemelerini yapabilirim.',
        meta: 'Hazır'
    }
];

export const CoachAssistantWidget = ({ contextAthleteId, contextAthleteName }: CoachAssistantWidgetProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [draft, setDraft] = useState('');
    const [isSending, setIsSending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    const hasContext = Boolean(contextAthleteId && contextAthleteName);
    const contextLabel = hasContext ? `${contextAthleteName}` : 'Takım geneli';

    const canSend = draft.trim().length > 0 && !isSending;

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isOpen, isSending]);

    useEffect(() => {
        if (!isOpen) return;

        setMessages(prev => {
            const baseMessages = prev.filter(message => message.id !== 'context-note');
            if (!hasContext) {
                return baseMessages;
            }

            return [
                {
                    id: 'context-note',
                    role: 'assistant',
                    text: `${contextAthleteName} için bağlam aktif. Bu alandaki komutlar doğrudan bu sporcuya uygulanacak.`,
                    meta: 'Bağlam'
                },
                ...baseMessages
            ];
        });
    }, [contextAthleteName, hasContext, isOpen]);

    const badgeText = useMemo(() => {
        if (isSending) return 'Yanıt hazırlanıyor';
        if (error) return 'Bağlantı sorunu';
        return 'Canlı';
    }, [error, isSending]);

    const sendMessage = async (messageText: string) => {
        const trimmed = messageText.trim();
        if (!trimmed || isSending) return;

        setError(null);
        setIsSending(true);
        setMessages(prev => [
            ...prev,
            {
                id: crypto.randomUUID(),
                role: 'user',
                text: trimmed
            }
        ]);
        setDraft('');

        try {
            const response = await dashboardService.sendCoachAssistantMessage({
                message: trimmed,
                contextAthleteId: contextAthleteId ?? null,
                contextAthleteName: contextAthleteName ?? null
            });

            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    text: response.textReply || 'Bir yanıt üretilmedi.',
                    meta: response.uiAction ? response.uiAction.replaceAll('_', ' ') : null
                }
            ]);
        } catch {
            setError('Asistan bağlantısı kurulamadı.');
            setMessages(prev => [
                ...prev,
                {
                    id: crypto.randomUUID(),
                    role: 'assistant',
                    text: 'Şu anda asistana ulaşılamıyor. Lütfen backend servisinin çalıştığını kontrol et.',
                    meta: 'Hata'
                }
            ]);
        } finally {
            setIsSending(false);
        }
    };

    return (
        <div className={`coach-assistant ${isOpen ? 'coach-assistant--open' : ''}`}>
            {!isOpen ? (
                <button
                    type="button"
                    className="coach-assistant__launcher"
                    onClick={() => setIsOpen(true)}
                >
                    <span className="coach-assistant__launcher-mark">AI</span>
                    <span className="coach-assistant__launcher-copy">
                        <strong>Koç Asistanı</strong>
                        <span>Sohbet penceresini aç</span>
                    </span>
                </button>
            ) : (
                <section className="coach-assistant__panel surface animate-scale-in" aria-label="Koç asistanı sohbet penceresi">
                    <header className="coach-assistant__header">
                        <div className="coach-assistant__brand">
                            <div className="coach-assistant__avatar">AI</div>
                            <div>
                                <span className="coach-assistant__eyebrow">Coach assistant</span>
                                <strong>SmartCoaching</strong>
                            </div>
                        </div>

                        <div className="coach-assistant__header-actions">
                            <span className={`chip ${error ? 'chip--warning' : 'chip--success'}`}>{badgeText}</span>
                            <button type="button" className="btn btn-secondary coach-assistant__close" onClick={() => setIsOpen(false)}>
                                Kapat
                            </button>
                        </div>
                    </header>

                    <div className="coach-assistant__body">
                        <div className="coach-assistant__context">
                            <span className="coach-assistant__context-label">Aktif bağlam</span>
                            <strong>{contextLabel}</strong>
                            <p>
                                {hasContext
                                    ? 'Bu sporcu seçiliyken yapılan komutlar doğrudan onun üzerinde çalışır.'
                                    : 'Takım bazlı genel komutlar için bu alan açık.'}
                            </p>
                        </div>

                        <div className="coach-assistant__messages">
                            {messages.map(message => (
                                <article
                                    key={message.id}
                                    className={`coach-assistant__message coach-assistant__message--${message.role}`}
                                >
                                    {message.meta && <span className="coach-assistant__meta">{message.meta}</span>}
                                    <p>{message.text}</p>
                                </article>
                            ))}
                            {isSending && (
                                <article className="coach-assistant__message coach-assistant__message--assistant">
                                    <span className="coach-assistant__meta">Yazıyor</span>
                                    <p>Koç verilerini kontrol ediyorum...</p>
                                </article>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        <div className="coach-assistant__quick-actions">
                            {quickPrompts.map(prompt => (
                                <button
                                    key={prompt}
                                    type="button"
                                    className="coach-assistant__quick-action"
                                    onClick={() => sendMessage(prompt)}
                                    disabled={isSending}
                                >
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <footer className="coach-assistant__composer">
                        <textarea
                            className="coach-assistant__input"
                            placeholder="Koçuna bir şey sor..."
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    void sendMessage(draft);
                                }
                            }}
                            rows={3}
                        />

                        <div className="coach-assistant__composer-actions">
                            <div className="caption">
                                <span>Enter gönderir, Shift+Enter satır atlar.</span>
                                {error && <span style={{ color: 'var(--warning-color)' }}> {error}</span>}
                            </div>
                            <button
                                type="button"
                                className="btn btn-primary coach-assistant__send"
                                onClick={() => void sendMessage(draft)}
                                disabled={!canSend}
                            >
                                Gönder
                            </button>
                        </div>
                    </footer>
                </section>
            )}
        </div>
    );
};
