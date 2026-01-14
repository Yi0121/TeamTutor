'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export function InputArea() {
    const [message, setMessage] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Auto-resize textarea
    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, [message]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        // TODO: Send message to backend
        console.log('Sending message:', message);
        setMessage('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    return (
        <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3">
            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                {/* Attachment Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-slate-500 hover:text-slate-700"
                    title="上傳檔案"
                >
                    <Paperclip className="w-5 h-5" />
                </Button>

                {/* Textarea */}
                <div className="flex-1 relative">
                    <Textarea
                        ref={textareaRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder="輸入訊息... (Shift + Enter 換行)"
                        className="min-h-[44px] max-h-[200px] py-3 pr-12 resize-none bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                        rows={1}
                    />
                </div>

                {/* Voice Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-slate-500 hover:text-slate-700"
                    title="語音輸入"
                >
                    <Mic className="w-5 h-5" />
                </Button>

                {/* Send Button */}
                <Button
                    type="submit"
                    size="icon"
                    disabled={!message.trim()}
                    className="shrink-0 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                    title="傳送訊息"
                >
                    <Send className="w-5 h-5" />
                </Button>
            </form>

            {/* Helper Text */}
            <p className="text-xs text-slate-400 mt-2 text-center">
                按 Enter 傳送 · Shift + Enter 換行 · 支援 Markdown 格式
            </p>
        </div>
    );
}
