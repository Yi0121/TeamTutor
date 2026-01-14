'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ToolCallCard } from './ToolCallCard';
import type { Message, Participant } from '@/types';
import 'katex/dist/katex.min.css';

interface MessageBubbleProps {
    message: Message;
    sender?: Participant;
}

export function MessageBubble({ message, sender }: MessageBubbleProps) {
    const isUser = sender && !sender.isAI;
    const timestamp = new Date(message.timestamp).toLocaleTimeString('zh-TW', {
        hour: '2-digit',
        minute: '2-digit',
    });

    // User message: right-aligned, blue background
    if (isUser) {
        return (
            <div className="flex justify-end">
                <div className="max-w-[70%] flex flex-col items-end">
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-2xl rounded-br-md shadow-sm">
                        <div className="prose prose-sm prose-invert max-w-none">
                            <ReactMarkdown>{message.content}</ReactMarkdown>
                        </div>
                    </div>
                    <span className="text-xs text-slate-400 mt-1 mr-1">{timestamp}</span>
                </div>
            </div>
        );
    }

    // AI message: left-aligned, white background with avatar
    return (
        <div className="flex gap-3">
            {/* Avatar */}
            <Avatar className="w-9 h-9 shrink-0 mt-1">
                <AvatarImage src={sender?.avatar} alt={sender?.name} />
                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-sm">
                    {sender?.name?.charAt(0) || 'A'}
                </AvatarFallback>
            </Avatar>

            {/* Message Content */}
            <div className="flex-1 max-w-[70%]">
                {/* Sender Name */}
                <span className="text-sm font-medium text-slate-700 mb-1 block">
                    {sender?.name || 'AI'}
                </span>

                {/* Message Bubble */}
                <div className="bg-white px-4 py-3 rounded-2xl rounded-tl-md shadow-sm border border-slate-100">
                    {/* Tool Call Card (if present) */}
                    {message.toolCall && <ToolCallCard toolCall={message.toolCall} />}

                    {/* Markdown Content */}
                    <div className="prose prose-sm prose-slate max-w-none prose-p:my-2 prose-ul:my-2 prose-ol:my-2 prose-li:my-0.5 prose-headings:my-2 prose-pre:my-2 prose-table:my-2">
                        <ReactMarkdown
                            remarkPlugins={[remarkMath]}
                            rehypePlugins={[rehypeKatex]}
                            components={{
                                // Custom code block rendering
                                code({ className, children, ...props }) {
                                    const match = /language-(\w+)/.exec(className || '');
                                    const codeString = String(children).replace(/\n$/, '');

                                    // Inline code
                                    if (!match) {
                                        return (
                                            <code
                                                className="px-1.5 py-0.5 bg-slate-100 text-slate-800 rounded text-sm font-mono"
                                                {...props}
                                            >
                                                {children}
                                            </code>
                                        );
                                    }

                                    // Code block with syntax highlighting
                                    return (
                                        <SyntaxHighlighter
                                            style={oneLight}
                                            language={match[1]}
                                            PreTag="div"
                                            className="rounded-lg my-2! text-sm"
                                            showLineNumbers
                                        >
                                            {codeString}
                                        </SyntaxHighlighter>
                                    );
                                },
                                // Custom table styling
                                table({ children }) {
                                    return (
                                        <div className="overflow-x-auto my-2">
                                            <table className="min-w-full border-collapse border border-slate-200 text-sm">
                                                {children}
                                            </table>
                                        </div>
                                    );
                                },
                                th({ children }) {
                                    return (
                                        <th className="border border-slate-200 bg-slate-50 px-3 py-2 text-left font-medium">
                                            {children}
                                        </th>
                                    );
                                },
                                td({ children }) {
                                    return (
                                        <td className="border border-slate-200 px-3 py-2">
                                            {children}
                                        </td>
                                    );
                                },
                                // Blockquote styling
                                blockquote({ children }) {
                                    return (
                                        <blockquote className="border-l-4 border-amber-400 bg-amber-50 pl-4 py-2 my-2 italic text-slate-700">
                                            {children}
                                        </blockquote>
                                    );
                                },
                            }}
                        >
                            {message.content}
                        </ReactMarkdown>
                    </div>
                </div>

                {/* Timestamp */}
                <span className="text-xs text-slate-400 mt-1 ml-1 block">{timestamp}</span>
            </div>
        </div>
    );
}
