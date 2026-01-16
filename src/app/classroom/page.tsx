'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    MessageSquare,
    Plus,
    Users,
    Calendar,
    Clock,
    Play,
    MoreHorizontal,
    Search,
    Filter,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import MockDataService from '@/lib/mock';

// Mock classroom sessions data
interface ClassroomSession {
    id: string;
    title: string;
    description: string;
    participants: number;
    status: 'active' | 'completed' | 'scheduled';
    createdAt: string;
    lastActivity: string;
    messageCount: number;
}

const activeSession = MockDataService.getSession();

// Generate mock sessions from existing data
const mockSessions: ClassroomSession[] = [
    {
        id: 'demo',
        title: activeSession.title,
        description: '與 AI 助教和同儕一起學習數學基礎概念',
        participants: activeSession.participants.length,
        status: 'active',
        createdAt: activeSession.createdAt,
        lastActivity: activeSession.updatedAt,
        messageCount: activeSession.messages.length,
    },
    {
        id: 'session-002',
        title: '二次函數圖形',
        description: '探索二次函數的圖形特性與應用',
        participants: 3,
        status: 'completed',
        createdAt: '2026-01-13T08:00:00Z',
        lastActivity: '2026-01-13T08:45:00Z',
        messageCount: 24,
    },
    {
        id: 'session-003',
        title: '因式分解練習',
        description: '學習因式分解的各種技巧',
        participants: 5,
        status: 'completed',
        createdAt: '2026-01-12T14:00:00Z',
        lastActivity: '2026-01-12T15:00:00Z',
        messageCount: 32,
    },
];

const getStatusBadge = (status: ClassroomSession['status']) => {
    switch (status) {
        case 'active':
            return <Badge className="bg-green-100 text-green-700 border-green-200">進行中</Badge>;
        case 'completed':
            return <Badge className="bg-slate-100 text-slate-600 border-slate-200">已完成</Badge>;
        case 'scheduled':
            return <Badge className="bg-blue-100 text-blue-700 border-blue-200">已排程</Badge>;
    }
};

const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export default function ClassroomListPage() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');

    const filteredSessions = mockSessions.filter((session) => {
        const matchesSearch = session.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFilter = filterStatus === 'all' || session.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    const handleCreateNew = () => {
        // TODO: 實作建立新課堂的邏輯
        // 暫時導向 demo 課堂
        router.push('/classroom/new');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">虛擬課堂</h1>
                            <p className="text-slate-500 mt-1">選擇或建立多代理人對話課堂</p>
                        </div>
                        <Button onClick={handleCreateNew} className="gap-2">
                            <Plus className="w-4 h-4" />
                            建立新課堂
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                {/* Search and Filter */}
                <div className="flex items-center gap-4 mb-6">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="搜尋課堂..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    <div className="flex gap-2">
                        <Button
                            variant={filterStatus === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('all')}
                        >
                            全部
                        </Button>
                        <Button
                            variant={filterStatus === 'active' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('active')}
                        >
                            進行中
                        </Button>
                        <Button
                            variant={filterStatus === 'completed' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus('completed')}
                        >
                            已完成
                        </Button>
                    </div>
                </div>

                {/* Session Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredSessions.map((session) => (
                        <Card
                            key={session.id}
                            className="hover:shadow-lg hover:border-blue-200 transition-all cursor-pointer group"
                        >
                            <CardHeader className="pb-3">
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                                            {session.title}
                                        </CardTitle>
                                        <CardDescription className="mt-1 line-clamp-2">
                                            {session.description}
                                        </CardDescription>
                                    </div>
                                    {getStatusBadge(session.status)}
                                </div>
                            </CardHeader>
                            <CardContent>
                                {/* Stats */}
                                <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                                    <span className="flex items-center gap-1">
                                        <Users className="w-4 h-4" />
                                        {session.participants} 人
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <MessageSquare className="w-4 h-4" />
                                        {session.messageCount} 則
                                    </span>
                                </div>

                                {/* Timestamps */}
                                <div className="text-xs text-slate-400 space-y-1 mb-4">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        建立於 {formatDate(session.createdAt)}
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        最後活動 {formatDate(session.lastActivity)}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Link href={`/classroom/${session.id}`} className="flex-1">
                                        <Button className="w-full gap-2" size="sm">
                                            <Play className="w-4 h-4" />
                                            {session.status === 'active' ? '繼續' : '查看'}
                                        </Button>
                                    </Link>
                                    <Button variant="ghost" size="icon" className="shrink-0">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Empty State */}
                {filteredSessions.length === 0 && (
                    <div className="text-center py-16">
                        <MessageSquare className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-slate-600 mb-2">沒有找到課堂</h3>
                        <p className="text-slate-400 mb-4">
                            {searchQuery ? '嘗試其他搜尋關鍵字' : '建立第一個虛擬課堂開始學習'}
                        </p>
                        <Button onClick={handleCreateNew} className="gap-2">
                            <Plus className="w-4 h-4" />
                            建立新課堂
                        </Button>
                    </div>
                )}
            </main>
        </div>
    );
}
