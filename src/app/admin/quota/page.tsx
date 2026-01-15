'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    ArrowLeft,
    Coins,
    AlertTriangle,
    Bell,
    Save,
    Users,
    Building2,
    Settings,
    TrendingUp,
    Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';

// Mock quota data
const MOCK_QUOTA_DATA = {
    global: {
        dailyLimit: 100000,
        monthlyLimit: 2000000,
        currentDailyUsage: 45000,
        currentMonthlyUsage: 850000,
    },
    notifications: {
        enabled: true,
        thresholds: [80, 90, 100],
    },
    roles: [
        {
            role: 'admin',
            label: '管理員',
            dailyLimit: 50000,
            monthlyLimit: 1000000,
            userCount: 3
        },
        {
            role: 'teacher',
            label: '教師',
            dailyLimit: 20000,
            monthlyLimit: 400000,
            userCount: 25
        },
        {
            role: 'student',
            label: '學生',
            dailyLimit: 5000,
            monthlyLimit: 100000,
            userCount: 180
        },
    ]
};

export default function QuotaManagementPage() {
    const [globalDaily, setGlobalDaily] = useState(MOCK_QUOTA_DATA.global.dailyLimit);
    const [globalMonthly, setGlobalMonthly] = useState(MOCK_QUOTA_DATA.global.monthlyLimit);
    const [notifyThresholds, setNotifyThresholds] = useState(MOCK_QUOTA_DATA.notifications.thresholds);
    const [roleQuotas, setRoleQuotas] = useState(MOCK_QUOTA_DATA.roles);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        alert('配額設定已儲存');
    };

    const dailyUsagePercent = (MOCK_QUOTA_DATA.global.currentDailyUsage / globalDaily) * 100;
    const monthlyUsagePercent = (MOCK_QUOTA_DATA.global.currentMonthlyUsage / globalMonthly) * 100;

    const getUsageColor = (percent: number) => {
        if (percent >= 100) return 'bg-red-500';
        if (percent >= 90) return 'bg-orange-500';
        if (percent >= 80) return 'bg-yellow-500';
        return 'bg-green-500';
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-amber-600 rounded-lg">
                                    <Coins className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold">Token 配額管理</h1>
                                    <p className="text-blue-200 text-sm">設定使用上限與通知閾值</p>
                                </div>
                            </div>
                        </div>
                        <Button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="bg-blue-600 hover:bg-blue-700"
                        >
                            <Save className="w-4 h-4 mr-2" />
                            {isSaving ? '儲存中...' : '儲存設定'}
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Current Usage Overview */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-blue-600" />
                                今日使用量
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold text-slate-900">
                                    {(MOCK_QUOTA_DATA.global.currentDailyUsage / 1000).toFixed(0)}K
                                </span>
                                <span className="text-slate-500 pb-1">/ {(globalDaily / 1000).toFixed(0)}K tokens</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${getUsageColor(dailyUsagePercent)}`}
                                    style={{ width: `${Math.min(dailyUsagePercent, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                                已使用 {dailyUsagePercent.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <TrendingUp className="w-5 h-5 text-purple-600" />
                                本月使用量
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-end gap-2 mb-2">
                                <span className="text-3xl font-bold text-slate-900">
                                    {(MOCK_QUOTA_DATA.global.currentMonthlyUsage / 1000000).toFixed(2)}M
                                </span>
                                <span className="text-slate-500 pb-1">/ {(globalMonthly / 1000000).toFixed(1)}M tokens</span>
                            </div>
                            <div className="h-3 bg-slate-200 rounded-full overflow-hidden">
                                <div
                                    className={`h-full transition-all ${getUsageColor(monthlyUsagePercent)}`}
                                    style={{ width: `${Math.min(monthlyUsagePercent, 100)}%` }}
                                />
                            </div>
                            <div className="mt-2 text-sm text-slate-500">
                                已使用 {monthlyUsagePercent.toFixed(1)}%
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Global Quota Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Settings className="w-5 h-5" />
                            全域配額設定
                        </CardTitle>
                        <CardDescription>設定系統整體的 Token 使用上限</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    每日上限 (tokens)
                                </label>
                                <Input
                                    type="number"
                                    value={globalDaily}
                                    onChange={e => setGlobalDaily(Number(e.target.value))}
                                />
                                <p className="text-xs text-slate-500 mt-1">建議值: 100,000 ~ 500,000</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">
                                    每月上限 (tokens)
                                </label>
                                <Input
                                    type="number"
                                    value={globalMonthly}
                                    onChange={e => setGlobalMonthly(Number(e.target.value))}
                                />
                                <p className="text-xs text-slate-500 mt-1">建議值: 2,000,000 ~ 10,000,000</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Notification Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="w-5 h-5" />
                            通知閾值設定
                        </CardTitle>
                        <CardDescription>當使用量達到指定百分比時發送通知</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-wrap gap-3">
                            {[80, 90, 100].map(threshold => (
                                <label
                                    key={threshold}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-lg border cursor-pointer transition-all ${notifyThresholds.includes(threshold)
                                            ? 'bg-blue-50 border-blue-300 text-blue-700'
                                            : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={notifyThresholds.includes(threshold)}
                                        onChange={e => {
                                            if (e.target.checked) {
                                                setNotifyThresholds([...notifyThresholds, threshold].sort((a, b) => a - b));
                                            } else {
                                                setNotifyThresholds(notifyThresholds.filter(t => t !== threshold));
                                            }
                                        }}
                                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <span className="font-medium">{threshold}%</span>
                                    {threshold === 100 && (
                                        <Badge variant="destructive" className="text-xs">超額警示</Badge>
                                    )}
                                </label>
                            ))}
                        </div>
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                            <div className="text-sm text-amber-800">
                                通知將透過 Email 發送給系統管理員。達到 100% 時，新對話將被暫停直到配額重置或提高。
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Role-based Quota Settings */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            角色配額設定
                        </CardTitle>
                        <CardDescription>針對不同角色設定個別的 Token 使用上限</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {roleQuotas.map((roleQuota, index) => (
                                <div key={roleQuota.role} className="p-4 border border-slate-200 rounded-lg bg-white">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <Badge
                                                variant="outline"
                                                className={
                                                    roleQuota.role === 'admin'
                                                        ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                        : roleQuota.role === 'teacher'
                                                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                            : 'bg-slate-50 text-slate-700 border-slate-200'
                                                }
                                            >
                                                {roleQuota.label}
                                            </Badge>
                                            <span className="text-sm text-slate-500">
                                                {roleQuota.userCount} 位使用者
                                            </span>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                每日上限
                                            </label>
                                            <Input
                                                type="number"
                                                value={roleQuota.dailyLimit}
                                                onChange={e => {
                                                    const updated = [...roleQuotas];
                                                    updated[index].dailyLimit = Number(e.target.value);
                                                    setRoleQuotas(updated);
                                                }}
                                                className="h-9"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-slate-500 mb-1">
                                                每月上限
                                            </label>
                                            <Input
                                                type="number"
                                                value={roleQuota.monthlyLimit}
                                                onChange={e => {
                                                    const updated = [...roleQuotas];
                                                    updated[index].monthlyLimit = Number(e.target.value);
                                                    setRoleQuotas(updated);
                                                }}
                                                className="h-9"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    );
}
