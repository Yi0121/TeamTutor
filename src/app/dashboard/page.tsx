'use client';

import { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import GridLayout from 'react-grid-layout';
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
    AlertTriangle,
    Bot,
    Star,
    Trophy,
    CheckCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import mockData, { type Alert, type PopularAgent, type LeaderboardStudent } from '@/lib/mock';
import type { DashboardStats, DailyUsage, RecentSession } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';
import { ROLE_DISPLAY_NAMES } from '@/lib/auth/permissions';

// Don't fetch stats statically anymore
const alertsData = mockData.getAlerts() as Alert[];
const popularAgentsData = mockData.getPopularAgents() as PopularAgent[];
const leaderboardData = (mockData.getAnalytics()?.studentLeaderboard || []) as LeaderboardStudent[];

// Time range options
const timeRanges = [
    { id: '7d', label: '過去 7 天' },
    { id: '30d', label: '過去 30 天' },
    { id: '90d', label: '過去 90 天' },
    { id: 'custom', label: '自訂範圍' },
];


// Default layout for widgets
const defaultLayout = [
    { i: 'stat-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'bar-chart', x: 0, y: 2, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'radar-chart', x: 6, y: 2, w: 6, h: 5, minW: 4, minH: 4 },
    { i: 'alerts', x: 0, y: 7, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'popular-agents', x: 4, y: 7, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'leaderboard', x: 8, y: 7, w: 4, h: 4, minW: 3, minH: 3 },
    { i: 'recent-sessions', x: 0, y: 11, w: 12, h: 4, minW: 6, minH: 3 },
];

// Student layout (Simplified)
const studentLayout = [
    { i: 'stat-1', x: 0, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-2', x: 3, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-3', x: 6, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'stat-4', x: 9, y: 0, w: 3, h: 2, minW: 2, minH: 2 },
    { i: 'leaderboard', x: 0, y: 2, w: 6, h: 5, minW: 3, minH: 3 },
    { i: 'popular-agents', x: 6, y: 2, w: 6, h: 5, minW: 3, minH: 3 },
    { i: 'recent-sessions', x: 0, y: 7, w: 12, h: 4, minW: 6, minH: 3 },
];

// Custom Legend Component
const CustomLegend = ({ data }: { data: { name: string; color: string }[] }) => (
    <div className="flex flex-wrap gap-4 justify-center mt-2">
        {data.map((item) => (
            <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-slate-600">{item.name}</span>
            </div>
        ))}
    </div>
);

const AXIS_TICK_STYLE = { fill: '#64748b', fontSize: 12 };
const RADIUS_TICK_STYLE = { fill: '#64748b', fontSize: 10 };
const TOOLTIP_STYLE = {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
};

export default function DashboardPage() {
    const { user, switchRole } = useAuth();
    const [selectedRange, setSelectedRange] = useState('7d');
    const [isExporting, setIsExporting] = useState(false);
    const [layout, setLayout] = useState(defaultLayout);

    // Layout persistence ref
    const layoutRef = useRef(layout);
    layoutRef.current = layout;

    // Guard against layout thrashing during role switch
    const isRoleSwitchingRef = useRef(false);

    // Update layout based on role
    useEffect(() => {
        isRoleSwitchingRef.current = true;
        if (user?.role === 'student') {
            setLayout(JSON.parse(JSON.stringify(studentLayout)));
        } else {
            setLayout(JSON.parse(JSON.stringify(defaultLayout)));
        }

        // Release lock after layout settles
        const timer = setTimeout(() => {
            isRoleSwitchingRef.current = false;
        }, 500);

        return () => clearTimeout(timer);
    }, [user?.role]);

    // Dynamic stats based on role
    const stats = useMemo<DashboardStats>(() =>
        mockData.getDashboardStats(user?.role),
        [user?.role]);

    // Transform daily usage for chart
    const dailyData = useMemo(() => stats.dailyUsage.map((d: DailyUsage) => ({
        ...d,
        date: d.date.split('-').slice(1).join('/'),
    })), [stats.dailyUsage]);

    // Transform ability scores for radar chart
    const abilityData = useMemo(() => [
        { ability: '溝通能力', score: stats.abilityScores.communication, fullMark: 100 },
        { ability: '協作能力', score: stats.abilityScores.collaboration, fullMark: 100 },
        { ability: '批判思考', score: stats.abilityScores.criticalThinking, fullMark: 100 },
        { ability: '問題解決', score: stats.abilityScores.problemSolving, fullMark: 100 },
        { ability: '創造力', score: stats.abilityScores.creativity, fullMark: 100 },
    ], [stats.abilityScores]);

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

    const onLayoutChange = useCallback((newLayout: any) => {
        // Ignore layout changes during role transition
        if (isRoleSwitchingRef.current) return;

        // Prevent infinite loop by checking if layout actually changed
        if (JSON.stringify(layoutRef.current) !== JSON.stringify(newLayout)) {
            setLayout(newLayout);
        }
    }, []);

    const resetLayout = () => {
        setLayout(user?.role === 'student' ? JSON.parse(JSON.stringify(studentLayout)) : JSON.parse(JSON.stringify(defaultLayout)));
    };

    const Grid = GridLayout as unknown as React.ComponentType<any>;

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
                            {/* Role Switcher (Demo Only) */}
                            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1 mr-2">
                                {(['student', 'teacher', 'school_admin', 'super_admin'] as const).map((r) => (
                                    <button
                                        key={r}
                                        onClick={() => switchRole(r)}
                                        className={`px-3 py-1.5 text-xs rounded-md transition-colors ${user?.role === r
                                            ? 'bg-white text-slate-900 shadow-sm font-medium'
                                            : 'text-slate-500 hover:text-slate-900'
                                            }`}
                                    >
                                        {ROLE_DISPLAY_NAMES[r]}
                                    </button>
                                ))}
                            </div>

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

                            {/* Advanced Analytics Button */}
                            <Link href="/dashboard/analytics">
                                <Button variant="outline" className="gap-2">
                                    <TrendingUp className="w-4 h-4" />
                                    進階分析
                                </Button>
                            </Link>

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
                <Grid
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
                        <Widget title={user?.role === 'student' ? "總學習時數" : "總對話數"}>
                            <StatCardContent
                                value={user?.role === 'student'
                                    ? (stats.usage.totalLearningHours || 0).toString() + " 小時"
                                    : stats.usage.totalSessions.toString()}
                                icon={user?.role === 'student' ? Clock : MessageSquare}
                                color="blue"
                                trend={user?.role === 'student' ? "+2.5" : "+12%"}
                            />
                        </Widget>
                    </div>
                    <div key="stat-2">
                        <Widget title={user?.role === 'student' ? "學習積分" : "活躍使用者"}>
                            <StatCardContent
                                value={user?.role === 'student'
                                    ? (stats.usage.learningScore || 0).toLocaleString()
                                    : stats.usage.activeUsers.toString()}
                                icon={user?.role === 'student' ? Trophy : Users}
                                color={user?.role === 'student' ? "amber" : "green"}
                                trend={user?.role === 'student' ? "Top 10%" : "+5%"}
                            />
                        </Widget>
                    </div>
                    <div key="stat-3">
                        <Widget title={user?.role === 'student' ? "連續學習" : "總訊息數"}>
                            <StatCardContent
                                value={user?.role === 'student'
                                    ? (stats.usage.studyStreak || 0).toString() + " 天"
                                    : stats.usage.totalMessages.toLocaleString()}
                                icon={user?.role === 'student' ? Star : TrendingUp}
                                color="purple"
                                trend={user?.role === 'student' ? "🔥" : "+18%"}
                            />
                        </Widget>
                    </div>
                    <div key="stat-4">
                        <Widget title={user?.role === 'student' ? "完成課程" : "Token 使用量"}>
                            <StatCardContent
                                value={user?.role === 'student'
                                    ? stats.usage.totalSessions.toString()
                                    : (stats.usage.totalTokens / 1000).toFixed(0) + 'K'}
                                icon={user?.role === 'student' ? CheckCircle : Coins}
                                color={user?.role === 'student' ? "green" : "amber"}
                                trend={user?.role === 'student' ? "+3" : "+8%"}
                            />
                        </Widget>
                    </div>

                    {/* Bar Chart - Hide for Students */}
                    {user?.role !== 'student' && (
                        <div key="bar-chart">
                            <Widget title="每日使用量">
                                <div className="flex flex-col h-full w-full pt-2">
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%" debounce={200}>
                                            <BarChart data={dailyData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                                                <XAxis dataKey="date" tick={AXIS_TICK_STYLE} />
                                                <YAxis tick={AXIS_TICK_STYLE} />
                                                <Tooltip contentStyle={TOOLTIP_STYLE} />
                                                <Bar dataKey="sessions" name="對話數" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                                <Bar dataKey="messages" name="訊息數" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <CustomLegend data={[
                                        { name: '對話數', color: '#3b82f6' },
                                        { name: '訊息數', color: '#8b5cf6' }
                                    ]} />
                                </div>
                            </Widget>
                        </div>
                    )}

                    {/* Radar Chart - Hide for Students */}
                    {user?.role !== 'student' && (
                        <div key="radar-chart">
                            <Widget title="能力雷達圖">
                                <div className="flex flex-col h-full w-full pt-2">
                                    <div className="flex-1 min-h-0">
                                        <ResponsiveContainer width="100%" height="100%" debounce={200}>
                                            <RadarChart data={abilityData}>
                                                <PolarGrid stroke="#e2e8f0" />
                                                <PolarAngleAxis dataKey="ability" tick={AXIS_TICK_STYLE} />
                                                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={RADIUS_TICK_STYLE} />
                                                <Radar name="能力分數" dataKey="score" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.4} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <CustomLegend data={[
                                        { name: '能力分數', color: '#3b82f6' }
                                    ]} />
                                </div>
                            </Widget>
                        </div>
                    )}

                    {/* Alerts Widget - Hide for Students */}
                    {user?.role !== 'student' && (
                        <div key="alerts">
                            <Widget title="異常警示" headerAction={<Badge variant="outline" className="text-xs">{alertsData.length}</Badge>}>
                                <div className="space-y-2 overflow-auto h-full">
                                    {alertsData.map((alert) => (
                                        <div
                                            key={alert.id}
                                            className={`p-3 rounded-lg border flex items-start gap-3 ${alert.type === 'error'
                                                ? 'bg-red-50 border-red-200'
                                                : alert.type === 'warning'
                                                    ? 'bg-amber-50 border-amber-200'
                                                    : 'bg-blue-50 border-blue-200'
                                                }`}
                                        >
                                            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${alert.type === 'error'
                                                ? 'text-red-500'
                                                : alert.type === 'warning'
                                                    ? 'text-amber-500'
                                                    : 'text-blue-500'
                                                }`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-slate-700 font-medium">{alert.message}</p>
                                                <p className="text-xs text-slate-500 mt-1">{new Date(alert.time).toLocaleString('zh-TW', { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Widget>
                        </div>
                    )}

                    {/* Popular Agents Widget */}
                    <div key="popular-agents">
                        <Widget title="熱門代理人" headerAction={<Link href="/agents"><Button variant="ghost" size="sm" className="text-xs h-7">查看全部</Button></Link>}>
                            <div className="space-y-2 overflow-auto h-full">
                                {popularAgentsData.map((agent, index) => (
                                    <Link
                                        key={agent.id}
                                        href={`/agents/${agent.id}`}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
                                    >
                                        <div className="w-6 h-6 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <Bot className="w-4 h-4 text-blue-500" />
                                                <span className="text-sm font-medium text-slate-900 truncate">{agent.name}</span>
                                            </div>
                                            <p className="text-xs text-slate-500">{agent.usageCount} 次使用</p>
                                        </div>
                                        <div className="flex items-center gap-1 text-amber-500">
                                            <Star className="w-3 h-3 fill-current" />
                                            <span className="text-xs font-medium">{agent.rating}</span>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </Widget>
                    </div>

                    {/* Student Leaderboard Widget */}
                    <div key="leaderboard">
                        <Widget title="🏆 學生排行榜">
                            <div className="space-y-2 overflow-auto h-full">
                                {leaderboardData.slice(0, 5).map((student) => (
                                    <div
                                        key={student.id}
                                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                                    >
                                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${student.rank === 1 ? 'bg-amber-400 text-white' :
                                            student.rank === 2 ? 'bg-slate-400 text-white' :
                                                student.rank === 3 ? 'bg-amber-600 text-white' :
                                                    'bg-slate-200 text-slate-600'
                                            }`}>
                                            {student.rank}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-medium text-slate-900 truncate">{student.name}</span>
                                                {student.streak >= 7 && (
                                                    <span className="text-xs px-1.5 py-0.5 bg-orange-100 text-orange-600 rounded-full flex items-center gap-0.5">
                                                        🔥 {student.streak}
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500">{student.class} · {student.sessions} 場學習</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-sm font-bold text-blue-600">{student.score.toLocaleString()}</div>
                                            <div className="text-xs text-slate-400">積分</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </Widget>
                    </div>

                    <div key="recent-sessions">
                        <Widget title="最近對話紀錄" headerAction={<Link href="/history"><Button variant="outline" size="sm">查看全部</Button></Link>}>
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
                                                    <Link href={`/history/${session.id}`}>
                                                        <Button variant="ghost" size="sm" className="gap-1">
                                                            <Play className="w-3 h-3" />
                                                            重播
                                                        </Button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Widget>
                    </div>
                </Grid>
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
