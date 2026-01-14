'use client';

import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import type { Message, Participant } from '@/types';

interface ChatInterfaceProps {
    messages: Message[];
    participants: Participant[];
    sessionTitle: string;
}

export function ChatInterface({ messages, participants, sessionTitle }: ChatInterfaceProps) {
    // Create a map for quick participant lookup
    const participantMap = new Map(participants.map((p) => [p.id, p]));

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <header className="shrink-0 px-6 py-4 bg-white border-b border-slate-200">
                <h1 className="text-lg font-semibold text-slate-900">{sessionTitle}</h1>
                <p className="text-sm text-slate-500">
                    {participants.length} 位參與者 · {messages.length} 則訊息
                </p>
            </header>

            {/* Message List */}
            <div className="flex-1 overflow-hidden">
                <MessageList messages={messages} participantMap={participantMap} />
            </div>

            {/* Input Area */}
            <InputArea />
        </div>
    );
}
