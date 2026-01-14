'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessageBubble } from './MessageBubble';
import type { Message, Participant } from '@/types';

interface MessageListProps {
    messages: Message[];
    participantMap: Map<string, Participant>;
}

export function MessageList({ messages, participantMap }: MessageListProps) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <ScrollArea className="h-full" ref={scrollRef}>
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
        </ScrollArea>
    );
}
