'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Users,
    MessageSquare,
    Coins,
    TrendingUp,
    Download,
    Calendar,
    Filter,
} from 'lucide-react';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    Legend,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MockDataService from '@/lib/mock';

/*
// Mock Data Types
interface AnalyticsData {
    usageByModel: { modelId: string; name: string; tokens: number; cost: number }[];
    usageByUser: { userId: string; name: string; role: string; sessions: number; tokens: number }[];
    hourlyActivity: { hour: string; users: number }[];
}
*/

const analytics = MockDataService.getAnalytics();
const stats = MockDataService.getDashboardStats();

const COLORS = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];

export default function AnalyticsPage() {
    const router = useRouter();
    const [dateRange, setDateRange] = useState('7d');

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-[1600px] mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">進階分析</h1>
                                <p className="text-sm text-slate-500">多維度數據洞察與報表</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                {['24h', '7d', '30d'].map((range) => (
                                    <button
                                        key={range}
                                        onClick={() => setDateRange(range)}
                                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${dateRange === range
                                            ? 'bg-white text-slate-900 shadow-sm'
                                            : 'text-slate-600 hover:text-slate-900'
                                            }`}
                                    >
                                        {range}
                                    </button>
                                ))}
                            </div>
                            <Button variant="outline">
                                <Filter className="w-4 h-4 mr-2" />
                                篩選
                            </Button>
                            <Button variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                匯出報表
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-[1600px] mx-auto px-6 py-8 space-y-8">
                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-slate-500">總 Token 使用量</p>
                                <Coins className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats.usage.totalTokens.toLocaleString()}</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +12% 較上週
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-slate-500">活躍使用者</p>
                                <Users className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats.usage.activeUsers}</div>
                            <p className="text-xs text-green-600 flex items-center mt-1">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                +5% 較上週
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-slate-500">總對話場次</p>
                                <MessageSquare className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-bold">{stats.usage.totalSessions}</div>
                            <p className="text-xs text-slate-500 mt-1">
                                平均時長 18 分鐘
                            </p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between space-y-0 pb-2">
                                <p className="text-sm font-medium text-slate-500">預估成本</p>
                                <Coins className="h-4 w-4 text-slate-400" />
                            </div>
                            <div className="text-2xl font-bold">$37.20</div>
                            <p className="text-xs text-slate-500 mt-1">
                                本月累積
                            </p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="overview" className="space-y-6">
                    <TabsList className="bg-white p-1 border border-slate-200 rounded-lg">
                        <TabsTrigger value="overview">活動概覽</TabsTrigger>
                        <TabsTrigger value="models">模型分析</TabsTrigger>
                        <TabsTrigger value="users">使用者分析</TabsTrigger>
                    </TabsList>

                    {/* Overview Tab */}
                    <TabsContent value="overview" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>24小時使用者活動趨勢</CardTitle>
                                <CardDescription>顯示各時段的在線與活躍使用者分佈</CardDescription>
                            </CardHeader>
                            <CardContent className="h-[400px]">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={analytics.hourlyActivity}>
                                        <defs>
                                            <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="hour" />
                                        <YAxis />
                                        <Tooltip />
                                        <Area type="monotone" dataKey="users" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </TabsContent>

                    {/* Models Tab */}
                    <TabsContent value="models" className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Token 使用分佈</CardTitle>
                                    <CardDescription>各模型 Token 消耗佔比</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={analytics.usageByModel}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={100}
                                                paddingAngle={5}
                                                dataKey="tokens"
                                            >
                                                {analytics.usageByModel.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip />
                                            <Legend />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>模型成本估算</CardTitle>
                                    <CardDescription>各模型預估花費 (USD)</CardDescription>
                                </CardHeader>
                                <CardContent className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={analytics.usageByModel} layout="vertical">
                                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                            <XAxis type="number" />
                                            <YAxis dataKey="name" type="category" width={100} />
                                            <Tooltip />
                                            <Bar dataKey="cost" fill="#10b981" radius={[0, 4, 4, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    {/* Users Tab */}
                    <TabsContent value="users" className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>高用量使用者排行</CardTitle>
                                <CardDescription>依 Token 使用量排序</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {analytics.usageByUser.sort((a, b) => b.tokens - a.tokens).map((user, i) => (
                                        <div key={user.userId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                                            <div className="flex items-center gap-4">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                                    {i + 1}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{user.name}</div>
                                                    <div className="text-sm text-slate-500">{user.role} · {user.sessions} Sessions</div>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <div className="font-medium text-slate-900">{user.tokens.toLocaleString()} Tokens</div>
                                                <div className="text-xs text-slate-400">佔總量 {((user.tokens / stats.usage.totalTokens) * 100).toFixed(1)}%</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}
