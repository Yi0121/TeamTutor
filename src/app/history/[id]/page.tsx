'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Download,
    Clock,
    Users,
    MessageSquare,
    Flag,
    MoreVertical,
    CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import PlaybackControls from '@/components/history/PlaybackControls';
import MessageBubble, { Message } from '@/components/classroom/MessageBubble';
import MockDataService from '@/lib/mock';
import type { SessionEvent, SessionHistory } from '@/lib/mock';

/*
interface SessionEvent {
    time: string;
    type: string;
    sender?: string;
    senderId?: string; // Added for matching with MessageBubble
    preview?: string;
    tool?: string;
    description?: string;
    content?: string; // Full content matching Message format
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
*/

interface Annotation {
    id: string;
    eventIndex: number;
    text: string;
    createdAt: string;
}

const sessionHistory = (MockDataService.getSessionHistory() || [])[0];
const participants = MockDataService.getSession().participants;

export default function HistoryReplayPage() {
    const params = useParams();
    const router = useRouter();
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentEventIndex, setCurrentEventIndex] = useState(0);
    const [playbackSpeed, setPlaybackSpeed] = useState(1);

    // Annotation State
    const [annotations, setAnnotations] = useState<Annotation[]>([]);
    const [currentAnnotationText, setCurrentAnnotationText] = useState('');
    const [isAnnotationDialogOpen, setIsAnnotationDialogOpen] = useState(false);
    const [selectedEventIndexForAnnotation, setSelectedEventIndexForAnnotation] = useState<number | null>(null);

    const scrollRef = useRef<HTMLDivElement>(null);
    const eventRefs = useRef<(HTMLDivElement | null)[]>([]);

    const session = sessionHistory;
    const events = session?.events || [];
    const currentEvent = events[currentEventIndex];

    // Scroll to new message when index changes
    useEffect(() => {
        if (eventRefs.current[currentEventIndex]) {
            eventRefs.current[currentEventIndex]?.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
            });
        }
    }, [currentEventIndex]);

    // Auto-play effect
    useEffect(() => {
        if (!isPlaying) return;

        const intervalTime = 2000 / playbackSpeed;

        const timer = setInterval(() => {
            setCurrentEventIndex((prev) => {
                if (prev >= events.length - 1) {
                    setIsPlaying(false);
                    return prev;
                }
                return prev + 1;
            });
        }, intervalTime);

        return () => clearInterval(timer);
    }, [isPlaying, events.length, playbackSpeed]);

    const handleAddAnnotation = () => {
        if (!currentAnnotationText.trim() || selectedEventIndexForAnnotation === null) return;

        const newAnnotation: Annotation = {
            id: `anno-${Date.now()}`,
            eventIndex: selectedEventIndexForAnnotation,
            text: currentAnnotationText,
            createdAt: new Date().toISOString(),
        };

        setAnnotations([...annotations, newAnnotation]);
        setCurrentAnnotationText('');
        setIsAnnotationDialogOpen(false);
        setSelectedEventIndexForAnnotation(null);
    };

    const openAnnotationDialog = (index: number) => {
        setSelectedEventIndexForAnnotation(index);
        setIsAnnotationDialogOpen(true);
    };

    // Helper to construct Message object for MessageBubble
    const getMessageInfo = (event: SessionEvent, index: number) => {
        if (event.type !== 'message') return null;

        const found = participants.find(p => p.id === event.senderId);
        const sender = found ? { ...found, role: found.role as any, status: found.status as any } : {
            id: 'unknown',
            name: event.sender || 'Unknown',
            role: 'student' as const,
            avatar: '',
            status: 'active' as const,
            isAI: false
        };

        const message = {
            id: `msg-${index}`,
            senderId: event.senderId || 'unknown',
            content: event.content || event.preview || '',
            timestamp: event.time,
        };

        return { message, sender };
    };

    if (!session) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">找不到此歷程紀錄</p>
            </div>
        );
    }

    // Filter events to show up to current index
    // In a real replay, we might show *all* up to current, 
    // but here we show the full list and highlight active state.

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 shrink-0">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                    {session.title}
                                    <Badge variant="outline" className="text-xs font-normal">
                                        歷程回放模式
                                    </Badge>
                                </h1>
                                <div className="flex items-center gap-4 text-xs text-slate-500 mt-1">
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {session.duration}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Users className="w-3 h-3" />
                                        {session.participants.length} 參與者
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-3 h-3" />
                                        {session.messageCount} 訊息
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/history/${params.id}/report`)}>
                                <MessageSquare className="w-4 h-4 mr-2" />
                                教學省思
                            </Button>
                            <Button variant="outline" size="sm">
                                <Download className="w-4 h-4 mr-2" />
                                匯出報告
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">

                {/* Left: Replay View (Chat Style) */}
                <div className="lg:col-span-2 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
                    <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <h2 className="font-semibold text-slate-800">課堂重現</h2>
                        <div className="text-xs text-slate-500">
                            目前顯示: {currentEventIndex + 1} / {events.length}
                        </div>
                    </div>

                    <ScrollArea className="flex-1 p-4" ref={scrollRef}>
                        <div className="space-y-6 pb-20">
                            {events.slice(0, currentEventIndex + 1).map((event, index) => {
                                const info = getMessageInfo(event, index);
                                const eventAnnotation = annotations.find(a => a.eventIndex === index);

                                if (info) {
                                    return (
                                        <div
                                            key={index}
                                            ref={el => { eventRefs.current[index] = el }}
                                            className="relative group transition-opacity duration-500 animate-in fade-in slide-in-from-bottom-2"
                                        >
                                            <div className="flex items-start gap-2">
                                                <div className="flex-1">
                                                    <MessageBubble
                                                        message={info.message}
                                                        sender={info.sender}
                                                        isOwn={false}
                                                        mode="history"
                                                        onAnnotate={() => openAnnotationDialog(index)}
                                                    />
                                                </div>

                                                {/* Annotation Indicator/Button */}
                                                <div className="pt-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 rounded-full hover:bg-amber-100 hover:text-amber-600"
                                                        onClick={() => openAnnotationDialog(index)}
                                                        title="新增標註"
                                                    >
                                                        <Flag className="w-4 h-4" />
                                                    </Button>
                                                </div>
                                            </div>

                                            {/* Display Annotation if exists */}
                                            {eventAnnotation && (
                                                <div className="ml-12 mt-2 mr-12 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-slate-800 flex items-start gap-2 animate-in zoom-in-95">
                                                    <div className="bg-amber-100 p-1 rounded-full shrink-0 mt-0.5">
                                                        <Flag className="w-3 h-3 text-amber-600" />
                                                    </div>
                                                    <div>
                                                        <span className="font-semibold text-amber-900 block text-xs mb-0.5">
                                                            教師標註 • {eventAnnotation.createdAt.split('T')[0]}
                                                        </span>
                                                        {eventAnnotation.text}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    );
                                } else {
                                    // System/Tool Events
                                    return (
                                        <div
                                            key={index}
                                            ref={el => { eventRefs.current[index] = el }}
                                            className="flex justify-center my-4 opacity-80"
                                        >
                                            <span className="bg-slate-100 text-slate-500 text-xs px-3 py-1 rounded-full border border-slate-200 flex items-center gap-2">
                                                <Clock className="w-3 h-3" />
                                                {event.time} • {event.description || event.preview}
                                            </span>
                                        </div>
                                    );
                                }
                            })}
                        </div>
                    </ScrollArea>

                    {/* Playback Controls Footer */}
                    <div className="p-4 border-t border-slate-200 bg-slate-50">
                        <PlaybackControls
                            isPlaying={isPlaying}
                            currentEventIndex={currentEventIndex}
                            totalEvents={events.length}
                            playbackSpeed={playbackSpeed}
                            currentTime={events[currentEventIndex]?.time || '00:00'}
                            onPlayPause={() => setIsPlaying(!isPlaying)}
                            onNext={() => setCurrentEventIndex(i => Math.min(i + 1, events.length - 1))}
                            onPrevious={() => setCurrentEventIndex(i => Math.max(i - 1, 0))}
                            onSeek={(val) => setCurrentEventIndex(val)}
                            onSpeedChange={(val) => setPlaybackSpeed(parseFloat(val))}
                        />
                    </div>
                </div>

                {/* Right: Annotation & Event List */}
                <div className="flex flex-col gap-6 h-full overflow-hidden">
                    {/* Annotation Summary Card */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col p-4 shrink-0">
                        <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                            <Flag className="w-4 h-4 text-amber-500" />
                            標註列表
                        </h3>
                        <div className="text-sm text-slate-500 mb-4">
                            已建立 {annotations.length} 則教學評註
                        </div>

                        <ScrollArea className="flex-1 max-h-[300px]">
                            {annotations.length === 0 ? (
                                <div className="text-center py-8 text-slate-400 text-sm border-2 border-dashed border-slate-100 rounded-lg">
                                    尚無任何標註
                                    <br />
                                    點擊對話氣泡旁的旗標以新增
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {annotations.map((anno) => (
                                        <div
                                            key={anno.id}
                                            className="p-3 bg-white border border-slate-200 rounded-lg shadow-sm hover:border-amber-300 transition-colors cursor-pointer group"
                                            onClick={() => setCurrentEventIndex(anno.eventIndex)}
                                        >
                                            <div className="flex items-center justify-between mb-1">
                                                <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                                                    {events[anno.eventIndex]?.time}
                                                </div>
                                                <Button size="icon" variant="ghost" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                                                    <MoreVertical className="w-3 h-3" />
                                                </Button>
                                            </div>
                                            <p className="text-sm text-slate-700 line-clamp-2">
                                                {anno.text}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </div>

                    {/* Full Event List Preview */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col flex-1 overflow-hidden">
                        <div className="p-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900">完整事件清單</h3>
                        </div>
                        <ScrollArea className="flex-1 p-0">
                            <div className="divide-y divide-slate-100">
                                {events.map((event, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => setCurrentEventIndex(idx)}
                                        className={`px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors flex items-start gap-3 ${idx === currentEventIndex ? 'bg-blue-50/60 border-l-4 border-blue-500' : 'border-l-4 border-transparent'
                                            }`}
                                    >
                                        <div className="mt-0.5 shrink-0">
                                            {event.type === 'message' ? (
                                                <MessageSquare className={`w-4 h-4 ${idx === currentEventIndex ? 'text-blue-500' : 'text-slate-400'}`} />
                                            ) : (
                                                <Clock className={`w-4 h-4 ${idx === currentEventIndex ? 'text-blue-500' : 'text-slate-400'}`} />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2 mb-0.5">
                                                <span className={`text-xs font-medium ${idx === currentEventIndex ? 'text-blue-700' : 'text-slate-900'}`}>
                                                    {event.sender || 'System'}
                                                </span>
                                                <span className="text-[10px] text-slate-400">{event.time}</span>
                                            </div>
                                            <p className={`text-xs truncate ${idx === currentEventIndex ? 'text-blue-600' : 'text-slate-500'}`}>
                                                {event.preview || event.description}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>
                </div>
            </main>

            {/* Annotation Dialog */}
            <Dialog open={isAnnotationDialogOpen} onOpenChange={setIsAnnotationDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>新增教學標註</DialogTitle>
                        <DialogDescription>
                            針對此對話內容加入評語、建議或問題，以利後續分析。
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        {selectedEventIndexForAnnotation !== null && (
                            <div className="mb-4 p-3 bg-slate-50 rounded text-sm text-slate-600 italic border-l-2 border-slate-300">
                                "{events[selectedEventIndexForAnnotation]?.content || events[selectedEventIndexForAnnotation]?.preview}"
                            </div>
                        )}
                        <Textarea
                            placeholder="輸入標註內容..."
                            value={currentAnnotationText}
                            onChange={(e) => setCurrentAnnotationText(e.target.value)}
                            rows={4}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsAnnotationDialogOpen(false)}>取消</Button>
                        <Button onClick={handleAddAnnotation}>儲存標註</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

