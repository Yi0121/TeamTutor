'use client';

import { useState, useRef, useEffect, FormEvent } from 'react';
import { Send, Paperclip, Mic, X, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface InputAreaProps {
    onSend?: (message: string, files?: File[]) => void;
    disabled?: boolean;
}

interface FilePreview {
    file: File;
    preview?: string;
}

export function InputArea({ onSend, disabled = false }: InputAreaProps) {
    const [message, setMessage] = useState('');
    const [attachedFiles, setAttachedFiles] = useState<FilePreview[]>([]);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Voice input state
    const [isListening, setIsListening] = useState(false);
    const [speechSupported, setSpeechSupported] = useState(false);
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    // Check for Web Speech API support
    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        if (SpeechRecognition) {
            setSpeechSupported(true);
            const recognition = new SpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;
            recognition.lang = 'zh-TW';

            recognition.onresult = (event: SpeechRecognitionEvent) => {
                let finalTranscript = '';
                let interimTranscript = '';

                for (let i = event.resultIndex; i < event.results.length; i++) {
                    const transcript = event.results[i][0].transcript;
                    if (event.results[i].isFinal) {
                        finalTranscript += transcript;
                    } else {
                        interimTranscript += transcript;
                    }
                }

                if (finalTranscript) {
                    setMessage(prev => prev + finalTranscript);
                }
            };

            recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
            };

            recognition.onend = () => {
                setIsListening(false);
            };

            recognitionRef.current = recognition;
        }
    }, []);

    const toggleVoiceInput = () => {
        if (!recognitionRef.current) return;

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
        } else {
            recognitionRef.current.start();
            setIsListening(true);
        }
    };

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
        if (!message.trim() && attachedFiles.length === 0) return;

        // Call onSend callback
        if (onSend) {
            onSend(
                message,
                attachedFiles.length > 0 ? attachedFiles.map((f) => f.file) : undefined
            );
        }

        // TODO: Send message to backend
        console.log('Sending message:', message, 'Files:', attachedFiles);
        setMessage('');
        setAttachedFiles([]);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        // Submit on Enter (without Shift)
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles: FilePreview[] = [];
        Array.from(files).forEach((file) => {
            const preview: FilePreview = { file };

            // Generate preview for images
            if (file.type.startsWith('image/')) {
                preview.preview = URL.createObjectURL(file);
            }

            newFiles.push(preview);
        });

        setAttachedFiles((prev) => [...prev, ...newFiles]);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const removeFile = (index: number) => {
        setAttachedFiles((prev) => {
            const newFiles = [...prev];
            // Revoke object URL if exists
            if (newFiles[index].preview) {
                URL.revokeObjectURL(newFiles[index].preview!);
            }
            newFiles.splice(index, 1);
            return newFiles;
        });
    };

    const formatFileSize = (bytes: number): string => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    return (
        <div className="shrink-0 bg-white border-t border-slate-200 px-4 py-3">
            {/* File Previews */}
            {attachedFiles.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-3">
                    {attachedFiles.map((fp, index) => (
                        <div
                            key={index}
                            className="relative group flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-2 pr-8"
                        >
                            {fp.preview ? (
                                <img
                                    src={fp.preview}
                                    alt={fp.file.name}
                                    className="w-8 h-8 object-cover rounded"
                                />
                            ) : fp.file.type.startsWith('image/') ? (
                                <ImageIcon className="w-5 h-5 text-blue-500" />
                            ) : (
                                <FileText className="w-5 h-5 text-slate-500" />
                            )}
                            <div className="text-sm">
                                <p className="font-medium text-slate-700 truncate max-w-[120px]">
                                    {fp.file.name}
                                </p>
                                <p className="text-xs text-slate-400">
                                    {formatFileSize(fp.file.size)}
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 text-slate-400 hover:text-slate-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex items-end gap-2">
                {/* Hidden File Input */}
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt,.md,.html,.png,.jpg,.jpeg,.gif"
                    onChange={handleFileSelect}
                    className="hidden"
                />

                {/* Attachment Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="shrink-0 text-slate-500 hover:text-slate-700"
                    title="上傳檔案"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={disabled}
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
                        disabled={disabled}
                    />
                </div>

                {/* Voice Button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className={`shrink-0 transition-colors ${isListening
                            ? 'text-red-500 bg-red-50 hover:bg-red-100 animate-pulse'
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                    title={speechSupported ? `語音輸入${isListening ? ' (錄音中...)' : ''}` : '您的瀏覽器不支援語音輸入'}
                    disabled={!speechSupported || disabled}
                    onClick={toggleVoiceInput}
                >
                    <Mic className="w-5 h-5" />
                </Button>

                {/* Send Button */}
                <Button
                    type="submit"
                    size="icon"
                    disabled={disabled || (!message.trim() && attachedFiles.length === 0)}
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
        </div >
    );
}

