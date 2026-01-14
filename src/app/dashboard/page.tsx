'use client';

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Radar,
    Legend,
} from 'recharts';
import {
    MessageSquare,
    Users,
    Coins,
    TrendingUp,
    Play,
    Clock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import mockData from '../../../mock_data.json';
import type { DashboardStats, DailyUsage, AbilityScores, RecentSession } from '@/types';

const stats = mockData.dashboardStats as DashboardStats;

// Transform daily usage for chart
const dailyData = stats.dailyUsage.map((d: DailyUsage) => ({
    ...d,
    date: d.date.split('-').slice(1).join('/'), // Format: MM/DD
}));

// Transform ability scores for radar chart
const abilityData = [
    { ability: '溝通能力', score: stats.abilityScores.communication, fullMark: 100 },
    { ability: '協作能力', score: stats.abilityScores.collaboration, fullMark: 100 },
    { ability: '批判思考', score: stats.abilityScores.criticalThinking, fullMark: 100 },
    { ability: '問題解決', score: stats.abilityScores.problemSolving, fullMark: 100 },
    { ability: '創造力', score: stats.abilityScores.creativity, fullMark: 100 },
];

export default function DashboardPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="text-2xl font-bold text-slate-900">學習儀表板</h1>
                    <p className="text-slate-500 mt-1">查看學習數據與分析</p>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Stats Cards Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="總對話數"
                        value={stats.usage.totalSessions.toString()}
                        icon={MessageSquare}
                        color="blue"
                        trend="+12%"
                    />
                    <StatCard
                        title="活躍使用者"
                        value={stats.usage.activeUsers.toString()}
                        icon={Users}
                        color="green"
                        trend="+5%"
                    />
                    <StatCard
                        title="總訊息數"
                        value={stats.usage.totalMessages.toLocaleString()}
                        icon={TrendingUp}
                        color="purple"
                        trend="+18%"
                    />
                    <StatCard
                        title="Token 使用量"
                        value={(stats.usage.totalTokens / 1000).toFixed(0) + 'K'}
                        icon={Coins}
                        color="amber"
                        trend="+8%"
                    />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Daily Usage Bar Chart */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">每日使用量</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={dailyData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <YAxis tick={{ fill: '#64748b', fontSize: 12 }} />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'white',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                        }}
                                    />
                                    <Bar
                                        dataKey="sessions"
                                        name="對話數"
                                        fill="#3b82f6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Bar
                                        dataKey="messages"
                                        name="訊息數"
                                        fill="#8b5cf6"
                                        radius={[4, 4, 0, 0]}
                                    />
                                    <Legend />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Ability Radar Chart */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h3 className="text-lg font-semibold text-slate-900 mb-4">能力雷達圖</h3>
                        <div className="h-72">
                            <ResponsiveContainer width="100%" height="100%">
                                <RadarChart data={abilityData}>
                                    <PolarGrid stroke="#e2e8f0" />
                                    <PolarAngleAxis
                                        dataKey="ability"
                                        tick={{ fill: '#64748b', fontSize: 12 }}
                                    />
                                    <PolarRadiusAxis
                                        angle={30}
                                        domain={[0, 100]}
                                        tick={{ fill: '#64748b', fontSize: 10 }}
                                    />
                                    <Radar
                                        name="能力分數"
                                        dataKey="score"
                                        stroke="#3b82f6"
                                        fill="#3b82f6"
                                        fillOpacity={0.4}
                                    />
                                    <Legend />
                                </RadarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Recent Sessions Table */}
                <div className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-slate-900">最近對話紀錄</h3>
                        <Button variant="outline" size="sm">
                            查看全部
                        </Button>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                                        對話標題
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                                        日期
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                                        時長
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                                        參與者
                                    </th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">
                                        狀態
                                    </th>
                                    <th className="text-right py-3 px-4 text-sm font-medium text-slate-500">
                                        操作
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentSessions.map((session: RecentSession) => (
                                    <tr
                                        key={session.id}
                                        className="border-b border-slate-100 hover:bg-slate-50"
                                    >
                                        <td className="py-3 px-4 font-medium text-slate-900">
                                            {session.title}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">{session.date}</td>
                                        <td className="py-3 px-4 text-slate-600 flex items-center gap-1">
                                            <Clock className="w-4 h-4 text-slate-400" />
                                            {session.duration}
                                        </td>
                                        <td className="py-3 px-4 text-slate-600">
                                            {session.participants} 位
                                        </td>
                                        <td className="py-3 px-4">
                                            <span
                                                className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${session.status === 'completed'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-amber-100 text-amber-700'
                                                    }`}
                                            >
                                                {session.status === 'completed' ? '已完成' : '進行中'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <Button variant="ghost" size="sm" className="gap-1">
                                                <Play className="w-4 h-4" />
                                                重播
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </main>
        </div>
    );
}

// Stat Card Component
function StatCard({
    title,
    value,
    icon: Icon,
    color,
    trend,
}: {
    title: string;
    value: string;
    icon: React.ComponentType<{ className?: string }>;
    color: 'blue' | 'green' | 'purple' | 'amber';
    trend: string;
}) {
    const colorClasses = {
        blue: 'bg-blue-100 text-blue-600',
        green: 'bg-green-100 text-green-600',
        purple: 'bg-purple-100 text-purple-600',
        amber: 'bg-amber-100 text-amber-600',
    };

    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-start justify-between">
                <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                    <Icon className="w-6 h-6" />
                </div>
                <span className="text-sm font-medium text-green-600">{trend}</span>
            </div>
            <div className="mt-4">
                <div className="text-2xl font-bold text-slate-900">{value}</div>
                <div className="text-sm text-slate-500 mt-1">{title}</div>
            </div>
        </div>
    );
}
