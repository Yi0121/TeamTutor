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

export function ChatInterface({ messages: initialMessages, participants, sessionTitle }: ChatInterfaceProps) {
    // Local messages state for real-time updates
    const [messages, setMessages] = useState<Message[]>(initialMessages);

    // Conversation state management
    const [conversationState, setConversationState] = useState<ConversationState>('WAITING_USER');
    const [activeAgent, setActiveAgent] = useState<string>('');
    const [activeTool, setActiveTool] = useState<string>('');

    // Create a map for quick participant lookup
    const participantMap = new Map(participants.map((p) => [p.id, p]));

    // Handle sending message
    const handleSendMessage = (text: string, files?: File[]) => {
        if (!text.trim() && (!files || files.length === 0)) return;

        // Add user message
        const userMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: 'user-current',
            content: text,
            timestamp: new Date().toISOString(),
        };
        setMessages(prev => [...prev, userMessage]);

        // Simulate agent thinking
        setConversationState('AGENT_THINKING');
        setActiveAgent('AI 助教');

        // Simulate AI response after delay
        setTimeout(() => {
            setConversationState('AGENT_RESPONDING');
        }, 1000);

        setTimeout(() => {
            // Add AI response
            const aiMessage: Message = {
                id: `msg-${Date.now()}-ai`,
                senderId: 'agent-assistant',
                content: getAIResponse(text),
                timestamp: new Date().toISOString(),
            };
            setMessages(prev => [...prev, aiMessage]);
            setConversationState('WAITING_USER');
            setActiveAgent('');
        }, 2000);
    };

    // Simple mock AI response
    const getAIResponse = (userInput: string): string => {
        if (userInput.includes('數學') || userInput.includes('方程式')) {
            return '好的！讓我來解釋這個數學概念。\n\n對於一元二次方程式 $ax^2 + bx + c = 0$，我們可以使用公式解：\n\n$$x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}$$\n\n您想要我用具體例子來示範嗎？';
        }
        if (userInput.includes('LaTeX') || userInput.includes('公式')) {
            return '沒問題！這裡是一些 LaTeX 公式範例：\n\n**行內公式**: 質能方程式 $E = mc^2$\n\n**區塊公式**:\n$$\\int_{-\\infty}^{\\infty} e^{-x^2} dx = \\sqrt{\\pi}$$\n\n您可以直接在訊息中輸入 LaTeX 語法！';
        }
        return `您好！我收到了您的訊息：「${userInput}」\n\n請問有什麼我可以幫助您的嗎？我可以協助您解決數學問題、撰寫程式碼、或回答各種學習相關的問題。`;
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


