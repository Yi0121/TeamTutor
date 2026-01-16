import Link from 'next/link';
import { Calendar, Users, MessageSquare, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
} from '@/components/ui/card';
import MockDataService from '@/lib/mock';

/*
interface SessionHistory {
    id: string;
    title: string;
    date: string;
    duration: string;
    participants: string[];
    messageCount: number;
    events: unknown[];
}
*/

const sessions = MockDataService.getSessionHistory();

export default function HistoryListPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-bold text-slate-900">學習歷程</h1>
                    <p className="text-slate-500">查看過往的課堂紀錄與重播</p>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                <div className="space-y-4">
                    {sessions.length > 0 ? (
                        sessions.map((session) => (
                            <Card key={session.id} className="hover:shadow-md transition-shadow">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="text-lg font-semibold text-slate-900">
                                                {session.title}
                                            </h3>
                                            <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                                                <span className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    {session.date}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    {session.participants.length} 參與者
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <MessageSquare className="w-4 h-4" />
                                                    {session.messageCount} 則訊息
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mt-3">
                                                {session.participants.slice(0, 3).map((p, i) => (
                                                    <Badge key={i} variant="outline">
                                                        {p}
                                                    </Badge>
                                                ))}
                                                {session.participants.length > 3 && (
                                                    <Badge variant="outline">
                                                        +{session.participants.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge className="bg-slate-100 text-slate-600">
                                                {session.duration}
                                            </Badge>
                                            <div className="flex gap-2">
                                                <Link href={`/history/${session.id}/report`}>
                                                    <Button variant="outline">
                                                        <MessageSquare className="w-4 h-4 mr-2" />
                                                        省思
                                                    </Button>
                                                </Link>
                                                <Link href={`/history/${session.id}`}>
                                                    <Button>
                                                        <Play className="w-4 h-4 mr-2" />
                                                        回放
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-400">
                            目前沒有歷程紀錄
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
