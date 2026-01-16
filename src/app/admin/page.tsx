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

const users = MockDataService.getUsers();
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
    const [activeTab, setActiveTab] = useState<'users' | 'system'>('users');
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

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

                    {/* Tabs */}
                    <div className="flex items-center gap-6 mt-8 border-b border-slate-700">
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'users'
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            使用者管理
                            {activeTab === 'users' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('system')}
                            className={`pb-4 text-sm font-medium transition-colors relative ${activeTab === 'system'
                                ? 'text-white'
                                : 'text-slate-400 hover:text-slate-200'
                                }`}
                        >
                            系統監控
                            {activeTab === 'system' && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                            )}
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
                {activeTab === 'users' ? (
                    /* User Management Tab */
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="relative w-72">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="搜尋使用者..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9 bg-white"
                                />
                            </div>
                            <Button className="bg-blue-600 hover:bg-blue-700">
                                <Users className="w-4 h-4 mr-2" />
                                新增使用者
                            </Button>
                        </div>

                        <Card>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b border-slate-200">
                                        <tr>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                使用者
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                角色
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                狀態
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                Token 用量
                                            </th>
                                            <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                                最後登入
                                            </th>
                                            <th className="text-right py-3 px-6 text-sm font-medium text-slate-500">
                                                操作
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map((user) => (
                                            <tr
                                                key={user.id}
                                                className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                            >
                                                <td className="py-3 px-6">
                                                    <div>
                                                        <div className="font-medium text-slate-900">
                                                            {user.name}
                                                        </div>
                                                        <div className="text-xs text-slate-500">
                                                            {user.email}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <Badge
                                                        variant="outline"
                                                        className={
                                                            user.role === 'admin'
                                                                ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                                : user.role === 'teacher'
                                                                    ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                    : 'bg-slate-50 text-slate-700 border-slate-200'
                                                        }
                                                    >
                                                        {user.role}
                                                    </Badge>
                                                </td>
                                                <td className="py-3 px-6">
                                                    <span
                                                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-slate-100 text-slate-500'
                                                            }`}
                                                    >
                                                        {user.status === 'active' ? '正常' : '停用'}
                                                    </span>
                                                </td>
                                                <td className="py-3 px-6 text-slate-600 font-mono text-sm">
                                                    {user.usage.tokens.toLocaleString()}
                                                </td>
                                                <td className="py-3 px-6 text-slate-500 text-sm">
                                                    {new Date(user.lastLogin).toLocaleDateString('zh-TW')}
                                                </td>
                                                <td className="py-3 px-6 text-right">
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-slate-400 hover:text-slate-600"
                                                    >
                                                        <MoreHorizontal className="w-4 h-4" />
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </div>
                ) : (
                    /* System Monitoring Tab */
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
                )}
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
