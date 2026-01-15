'use client';

import { useState } from 'react';
import { MessageList } from './MessageList';
import { InputArea } from './InputArea';
import { ConversationStatusBar, type ConversationState } from './ConversationStatusBar';
import type { Message, Participant } from '@/types';

interface ChatInterfaceProps {
    messages: Message[];
    participants: Participant[];
    sessionTitle: string;
}

export function ChatInterface({ messages, participants, sessionTitle }: ChatInterfaceProps) {
    // Conversation state management
    const [conversationState, setConversationState] = useState<ConversationState>('WAITING_USER');
    const [activeAgent, setActiveAgent] = useState<string>('');
    const [activeTool, setActiveTool] = useState<string>('');

    // Create a map for quick participant lookup
    const participantMap = new Map(participants.map((p) => [p.id, p]));

    // Demo: Simulate state changes (in real app, this would come from backend/websocket)
    const handleSendMessage = () => {
        // Simulate agent thinking
        setConversationState('AGENT_THINKING');
        setActiveAgent('AI 助教');

        setTimeout(() => {
            setConversationState('AGENT_RESPONDING');
        }, 1500);

        setTimeout(() => {
            setConversationState('WAITING_USER');
            setActiveAgent('');
        }, 3000);
    };

    return (
        <div className="flex flex-col h-full bg-slate-50">
            {/* Header */}
            <header className="shrink-0 px-6 py-4 bg-white border-b border-slate-200">
                <h1 className="text-lg font-semibold text-slate-900">{sessionTitle}</h1>
                <p className="text-sm text-slate-500">
                    {participants.length} 位參與者 · {messages.length} 則訊息
                </p>
            </header>

            {/* Conversation Status Bar */}
            <ConversationStatusBar
                state={conversationState}
                agentName={activeAgent}
                toolName={activeTool}
            />

            {/* Message List */}
            <div className="flex-1 overflow-hidden">
                <MessageList messages={messages} participantMap={participantMap} />
            </div>

            {/* Input Area */}
            <InputArea onSend={handleSendMessage} />
        </div>
    );
}

