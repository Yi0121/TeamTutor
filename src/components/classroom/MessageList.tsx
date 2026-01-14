'use client';

import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import type { Message, Participant } from '@/types';

interface MessageListProps {
    messages: Message[];
    participantMap: Map<string, Participant>;
}

export function MessageList({ messages, participantMap }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);
    const prevMessagesLength = useRef(messages.length);

    // Auto-scroll to bottom only when new messages are added
    useEffect(() => {
        if (messages.length > prevMessagesLength.current) {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        prevMessagesLength.current = messages.length;
    }, [messages]);

    return (
        <div className="h-full overflow-y-auto custom-scrollbar" ref={scrollRef}>
            <div className="px-6 py-4 space-y-4">
                {messages.map((message) => {
                    const sender = participantMap.get(message.senderId);
                    return (
                        <MessageBubble
                            key={message.id}
                            message={message}
                            sender={sender}
                        />
                    );
                })}
                <div ref={bottomRef} />
            </div>
        </div>
    );
}
