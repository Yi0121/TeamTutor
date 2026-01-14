'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Play,
    Pause,
    SkipBack,
    SkipForward,
    MessageSquare,
    Wrench,
    Flag,
    Clock,
    Users,
    Download,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import mockData from '../../../../mock_data.json';

interface SessionEvent {
    time: string;
    type: string;
    sender?: string;
    preview?: string;
    tool?: string;
    description?: string;
}

interface SessionHistory {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    messageCount: number;
    events: SessionEvent[];
}

const sessionHistory = ((mockData as { sessionHistory?: SessionHistory[] }).sessionHistory || [])[0];

export default function HistoryReplayPage() {
    const params = useParams();
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [annotation, setAnnotation] = useState('');
    const [annotations, setAnnotations] = useState<{ eventIndex: number; text: string }[]>([]);

    const session = sessionHistory;
    const events = session?.events || [];
    const currentEvent = events[currentEventIndex];

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying) return;

        const timer = setInterval(() => {
            setCurrentEventIndex((prev) => {
                if (prev >= events.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, 1500);

        return () => clearInterval(timer);
    }, [isPlaying, events.length]);

    const handleAddAnnotation = () => {
        if (!annotation.trim()) return;
        setAnnotations([...annotations, { eventIndex: currentEventIndex, text: annotation }]);
        setAnnotation('');
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">找不到此歷程紀錄</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-100">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-6xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{session.title}</h1>
                                <div className="flex items-center gap-4 text-sm text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {session.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {session.participants.length} 位參與者
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        {session.messageCount} 則訊息
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Button variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            匯出報告
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Timeline Panel */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Playback Controls */}
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-center gap-4">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setCurrentEventIndex(0)}
                                    disabled={currentEventIndex === 0}
                                >
                                    <SkipBack className="w-5 h-5" />
                                </Button>
                                <Button
                                    size="icon"
                                    className="w-12 h-12"
                                    onClick={() => setIsPlaying(!isPlaying)}
                                >
                                    {isPlaying ? (
                                        <Pause className="w-6 h-6" />
                                    ) : (
                                        <Play className="w-6 h-6" />
                                    )}
                                </Button>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setCurrentEventIndex((prev) =>
                                            Math.min(prev + 1, events.length - 1)
                                        )
                                    }
                                    disabled={currentEventIndex === events.length - 1}
                                >
                                    <SkipForward className="w-5 h-5" />
                                </Button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mt-4">
                                <div className="flex items-center justify-between text-sm text-slate-500 mb-2">
                                    <span>{currentEvent?.time || '00:00'}</span>
                                    <span>
                                        {currentEventIndex + 1} / {events.length}
                                    </span>
                                </div>
                                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-blue-500 rounded-full transition-all"
                                        style={{
                                            width: `${((currentEventIndex + 1) / events.length) * 100}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Timeline Events */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">時間軸</h2>
                            <div className="space-y-3">
                                {events.map((event, index) => (
                                    <TimelineEvent
                                        key={index}
                                        event={event}
                                        isActive={index === currentEventIndex}
                                        isPast={index < currentEventIndex}
                                        hasAnnotation={annotations.some((a) => a.eventIndex === index)}
                                        onClick={() => setCurrentEventIndex(index)}
                                    />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Annotation Panel */}
                    <div className="space-y-6">
                        {/* Current Event Details */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                目前事件
                            </h2>
                            {currentEvent && (
                                <div className="p-4 bg-slate-50 rounded-lg">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant="outline">{currentEvent.time}</Badge>
                                        <Badge
                                            className={
                                                currentEvent.type === 'message'
                                                    ? 'bg-blue-100 text-blue-700'
                                                    : currentEvent.type === 'tool_call'
                                                        ? 'bg-purple-100 text-purple-700'
                                                        : 'bg-slate-100 text-slate-700'
                                            }
                                        >
                                            {currentEvent.type === 'message'
                                                ? '訊息'
                                                : currentEvent.type === 'tool_call'
                                                    ? '工具呼叫'
                                                    : '系統事件'}
                                        </Badge>
                                    </div>
                                    {currentEvent.sender && (
                                        <p className="font-medium text-slate-900">
                                            {currentEvent.sender}
                                        </p>
                                    )}
                                    <p className="text-slate-600 mt-1">
                                        {currentEvent.preview || currentEvent.description}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Add Annotation */}
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                                <Flag className="w-5 h-5 text-amber-500" />
                                新增標註
                            </h2>
                            <Textarea
                                placeholder="輸入教師評語或標註..."
                                value={annotation}
                                onChange={(e) => setAnnotation(e.target.value)}
                                rows={3}
                            />
                            <Button
                                className="w-full mt-3"
                                onClick={handleAddAnnotation}
                                disabled={!annotation.trim()}
                            >
                                新增標註
                            </Button>
                        </div>

                        {/* Annotations List */}
                        {annotations.length > 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-6">
                                <h2 className="text-lg font-semibold text-slate-900 mb-4">
                                    已標註 ({annotations.length})
                                </h2>
                                <div className="space-y-2">
                                    {annotations.map((a, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-amber-50 border border-amber-200 rounded-lg"
                                        >
                                            <Badge variant="outline" className="mb-1">
                                                {events[a.eventIndex]?.time}
                                            </Badge>
                                            <p className="text-sm text-slate-700">{a.text}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

function TimelineEvent({
    event,
    isActive,
    isPast,
    hasAnnotation,
    onClick,
}: {
    event: SessionEvent;
    isActive: boolean;
    isPast: boolean;
    hasAnnotation: boolean;
    onClick: () => void;
}) {
    const getIcon = () => {
        switch (event.type) {
            case 'message':
                return <MessageSquare className="w-4 h-4" />;
            case 'tool_call':
                return <Wrench className="w-4 h-4" />;
            default:
                return <Clock className="w-4 h-4" />;
        }
    };

    return (
        <div
            onClick={onClick}
            className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-all ${isActive
                    ? 'bg-blue-50 border border-blue-200'
                    : isPast
                        ? 'bg-slate-50 opacity-60'
                        : 'hover:bg-slate-50'
                }`}
        >
            <div
                className={`p-2 rounded-lg ${isActive
                        ? 'bg-blue-500 text-white'
                        : event.type === 'message'
                            ? 'bg-blue-100 text-blue-600'
                            : event.type === 'tool_call'
                                ? 'bg-purple-100 text-purple-600'
                                : 'bg-slate-100 text-slate-600'
                    }`}
            >
                {getIcon()}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">
                        {event.sender || event.tool || '系統'}
                    </span>
                    <span className="text-xs text-slate-400">{event.time}</span>
                    {hasAnnotation && (
                        <Flag className="w-3 h-3 text-amber-500" />
                    )}
                </div>
                <p className="text-sm text-slate-600 truncate">
                    {event.preview || event.description}
                </p>
            </div>
        </div>
    );
}
