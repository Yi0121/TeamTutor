'use client';

import { useState, useCallback } from 'react';
import GridLayout, { Layout } from 'react-grid-layout';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
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
    Download,
    GripVertical,
    RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import mockData from '../../../mock_data.json';
import type { DashboardStats, DailyUsage, RecentSession } from '@/types';

const stats = mockData.dashboardStats as DashboardStats;

// Time range options
const timeRanges = [
    { id: '7d', label: '過去 7 天' },
    { id: '30d', label: '過去 30 天' },
    { id: '90d', label: '過去 90 天' },
    { id: 'custom', label: '自訂範圍' },
];

// Transform daily usage for chart
const dailyData = stats.dailyUsage.map((d: DailyUsage) => ({
    ...d,
    date: d.date.split('-').slice(1).join('/'),
}));

// Transform ability scores for radar chart
const abilityData = [
    { ability: '溝通能力', score: stats.abilityScores.communication, fullMark: 100 },
    { ability: '協作能力', score: stats.abilityScores.collaboration, fullMark: 100 },
    { ability: '批判思考', score: stats.abilityScores.criticalThinking, fullMark: 100 },
    { ability: '問題解決', score: stats.abilityScores.problemSolving, fullMark: 100 },
    { ability: '創造力', score: stats.abilityScores.creativity, fullMark: 100 },
];

// Default layout for widgets
const defaultLayout: Layout[] = [
    { i: 'stat-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'bar-chart', x: 0, y: 2, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'radar-chart', x: 6, y: 2, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'recent-sessions', x: 0, y: 7, w: 12, h: 6, minW: 6, minH: 4 },
];

export default function DashboardPage() {
    const [selectedRange, setSelectedRange] = useState('7d');
    const [isExporting, setIsExporting] = useState(false);
    const [layout, setLayout] = useState<Layout[]>(defaultLayout);

    const handleExport = () => {
        setIsExporting(true);
        setTimeout(() => {
            const data = {
                stats: stats.usage,
                dailyUsage: stats.dailyUsage,
                abilityScores: stats.abilityScores,
                exportedAt: new Date().toISOString(),
            };
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `dashboard_export_${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            setIsExporting(false);
        }, 500);
    };

    const onLayoutChange = useCallback((newLayout: Layout[]) => {
        setLayout(newLayout);
        // TODO: Persist layout to localStorage or backend
        localStorage.setItem('dashboard-layout', JSON.stringify(newLayout));
    }, []);

    const resetLayout = () => {
        setLayout(defaultLayout);
        localStorage.removeItem('dashboard-layout');
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-[1600px] mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">學習儀表板</h1>
                            <p className="text-slate-500 mt-1">查看學習數據與分析 · 可拖曳調整版面</p>
                        </div>
                        <div className="flex items-center gap-3">
                            {/* Time Range Selector */}
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                {timeRanges.map((range) => (
                                    <button
                                        key={range.id}
                                        onClick={() => setSelectedRange(range.id)}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${selectedRange === range.id
                                                ? 'bg-white text-slate-900 shadow-sm'
                                                : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>

                            {/* Reset Layout Button */}
                            <Button variant="ghost" size="icon" onClick={resetLayout} title="重設版面">
                                <RotateCcw className="w-4 h-4" />
                            </Button>

                            {/* Export Button */}
                            <Button
                                variant="outline"
                                onClick={handleExport}
                                disabled={isExporting}
                            >
                                <Download className="w-4 h-4 mr-2" />
                                {isExporting ? '匯出中...' : '匯出數據'}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-8">
                <GridLayout
                    className="layout"
                    layout={layout}
                    cols={12}
                    rowHeight={60}
                    width={1536}
                    onLayoutChange={onLayoutChange}
                    draggableHandle=".widget-drag-handle"
                    isResizable={true}
                    isDraggable={true}
                    compactType="vertical"
                    preventCollision={false}
                >
                    {/* Stat Cards */}
                    <div key="stat-1">
                        <Widget title="總對話數">
                            <StatCardContent
                                value={stats.usage.totalSessions.toString()}
                                icon={MessageSquare}
                                color="blue"
                                trend="+12%"
                            />
                        </Widget>
                    </div>
                    <div key="stat-2">
                        <Widget title="活躍使用者">
                            <StatCardContent
                                value={stats.usage.activeUsers.toString()}
                                icon={Users}
                                color="green"
                                trend="+5%"
                            />
                        </Widget>
                    </div>
                    <div key="stat-3">
                        <Widget title="總訊息數">
                            <StatCardContent
                                value={stats.usage.totalMessages.toLocaleString()}
                                icon={TrendingUp}
                                color="purple"
                                trend="+18%"
                            />
                        </Widget>
                    </div>
                    <div key="stat-4">
                        <Widget title="Token 使用量">
                            <StatCardContent
                                value={(stats.usage.totalTokens / 1000).toFixed(0) + 'K'}
                                icon={Coins}
                                color="amber"
                                trend="+8%"
                            />
                        </Widget>
                    </div>

                    {/* Bar Chart */}
                    <div key="bar-chart">
                        <Widget title="每日使用量">
                            <div className="h-full w-full pt-2">
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
                                        <Bar dataKey="sessions" name="對話數" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                        <Bar dataKey="messages" name="訊息數" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                        <Legend />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Widget>
                    </div>

                    {/* Radar Chart */}
                    <div key="radar-chart">
                        <Widget title="能力雷達圖">
                            <div className="h-full w-full pt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart data={abilityData}>
                                        <PolarGrid stroke="#e2e8f0" />
                                        <PolarAngleAxis dataKey="ability" tick={{ fill: '#64748b', fontSize: 12 }} />
                                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 10 }} />
                                        <Radar name="能力分數" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                                        <Legend />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Widget>
                    </div>

                    {/* Recent Sessions Table */}
                    <div key="recent-sessions">
                        <Widget title="最近對話紀錄" headerAction={<Button variant="outline" size="sm">查看全部</Button>}>
                            <div className="overflow-auto h-full">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-slate-200">
                                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">對話標題</th>
                                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">日期</th>
                                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">時長</th>
                                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">參與者</th>
                                            <th className="text-left py-2 px-3 text-sm font-medium text-slate-500">狀態</th>
                                            <th className="text-right py-2 px-3 text-sm font-medium text-slate-500">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {stats.recentSessions.map((session: RecentSession) => (
                                            <tr key={session.id} className="border-b border-slate-100 hover:bg-slate-50">
                                                <td className="py-2 px-3 font-medium text-slate-900">{session.title}</td>
                                                <td className="py-2 px-3 text-slate-600">{session.date}</td>
                                                <td className="py-2 px-3 text-slate-600 flex items-center gap-1">
                                                    <Clock className="w-3 h-3 text-slate-400" />
                                                    {session.duration}
                                                </td>
                                                <td className="py-2 px-3 text-slate-600">{session.participants} 位</td>
                                                <td className="py-2 px-3">
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${session.status === 'completed'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {session.status === 'completed' ? '已完成' : '進行中'}
                                                    </span>
                                                </td>
                                                <td className="py-2 px-3 text-right">
                                                    <Button variant="ghost" size="sm" className="gap-1">
                                                        <Play className="w-3 h-3" />
                                                        重播
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Widget>
                    </div>
                </GridLayout>
            </main>
        </div>
    );
}

// Widget Container Component
function Widget({
    title,
    children,
    headerAction,
}: {
    title: string;
    children: React.ReactNode;
    headerAction?: React.ReactNode;
}) {
    return (
        <div className="h-full bg-white rounded-xl border border-slate-200 shadow-sm flex flex-col overflow-hidden">
            {/* Header with drag handle */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 shrink-0">
                <div className="flex items-center gap-2">
                    <div className="widget-drag-handle cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600">
                        <GripVertical className="w-4 h-4" />
                    </div>
                    <h3 className="font-semibold text-slate-900">{title}</h3>
                </div>
                {headerAction}
            </div>
            {/* Content */}
            <div className="flex-1 p-4 overflow-hidden">
                {children}
            </div>
        </div>
    );
}

// Stat Card Content Component
function StatCardContent({
    value,
    icon: Icon,
    color,
    trend,
}: {
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
        <div className="h-full flex flex-col justify-between">
            <div className="flex items-start justify-between">
                <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <span className="text-sm font-medium text-green-600">{trend}</span>
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
        </div>
    );
}
