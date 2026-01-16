'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Users,
    Shield,
    Activity,
    Server,
    Database,
    Search,
    MoreHorizontal,
    Lock,
} from 'lucide-react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import MockDataService from '@/lib/mock';

const stats = MockDataService.getSystemStats();

// Mock data for charts
const latencyData = [
    { time: '00:00', latency: 320 },
    { time: '04:00', latency: 280 },
    { time: '08:00', latency: 450 },
    { time: '12:00', latency: 380 },
    { time: '16:00', latency: 420 },
    { time: '20:00', latency: 350 },
    { time: '24:00', latency: 310 },
];

export default function AdminPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-600 rounded-lg">
                                <Shield className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold">系統管理後台</h1>
                                <p className="text-blue-200 text-sm">權限管理與系統監控</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2 text-sm bg-slate-800 px-3 py-1.5 rounded-full">
                                <div
                                    className={`w-2 h-2 rounded-full ${stats.serverStatus === 'healthy' ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                />
                                <span className="text-slate-300">System: {stats.serverStatus}</span>
                            </div>
                            <Button variant="secondary" size="sm">
                                匯出報表
                            </Button>
                        </div>
                    </div>

                    {/* Tabs / Navigation */}
                    <div className="flex items-center gap-6 mt-8 border-b border-slate-700">
                        <Link href="/admin/users">
                            <button
                                className="pb-4 text-sm font-medium transition-colors relative text-slate-400 hover:text-slate-200"
                            >
                                使用者管理
                            </button>
                        </Link>
                        <button
                            className="pb-4 text-sm font-medium transition-colors relative text-white"
                        >
                            系統監控
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                        </button>
                        <Link href="/admin/organization">
                            <button
                                className="pb-4 text-sm font-medium transition-colors relative text-slate-400 hover:text-slate-200"
                            >
                                組織架構
                            </button>
                        </Link>
                        <Link href="/admin/quota">
                            <button
                                className="pb-4 text-sm font-medium transition-colors relative text-slate-400 hover:text-slate-200"
                            >
                                配額管理
                            </button>
                        </Link>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* System Monitoring Content */}
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <StatsCard
                            title="API 平均延遲"
                            value={`${stats.apiLatency}ms`}
                            icon={Activity}
                            status="good"
                        />
                        <StatsCard
                            title="系統錯誤率"
                            value={`${stats.errorRate * 100}%`}
                            icon={Server}
                            status="good"
                        />
                        <StatsCard
                            title="向量庫狀態"
                            value={stats.vectorDbStatus}
                            icon={Database}
                            status={stats.vectorDbStatus === 'healthy' ? 'good' : 'bad'}
                        />
                        <StatsCard
                            title="總 Token 使用量"
                            value={(stats.totalTokens / 1000000).toFixed(1) + 'M'}
                            icon={Lock}
                            status="neutral"
                        />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>API 延遲趨勢 (24h)</CardTitle>
                                <CardDescription>伺服器回應時間監控</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={latencyData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                            <XAxis dataKey="time" tick={{ fill: '#64748b' }} />
                                            <YAxis tick={{ fill: '#64748b' }} />
                                            <Tooltip />
                                            <Line
                                                type="monotone"
                                                dataKey="latency"
                                                stroke="#3b82f6"
                                                strokeWidth={2}
                                                dot={false}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}

function StatsCard({
    title,
    value,
    icon: Icon,
    status,
}: {
    title: string;
    value: string;
    icon: React.ElementType;
    status: 'good' | 'bad' | 'neutral';
}) {
    const statusColor =
        status === 'good'
            ? 'text-green-600 bg-green-50'
            : status === 'bad'
                ? 'text-red-600 bg-red-50'
                : 'text-blue-600 bg-blue-50';

    return (
        <Card>
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-slate-500">{title}</p>
                        <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
                    </div>
                    <div className={`p-3 rounded-xl ${statusColor}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
