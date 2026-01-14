'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    Settings,
    Key,
    Shield,
    History,
    Play,
    Save,
    Power,
    Clock,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import mockData from '../../../../mock_data.json';

interface Tool {
    id: string;
    name: string;
    description: string;
    icon: string;
    category: string;
    status: 'active' | 'inactive';
    callCount: number;
    lastUsed: string;
}

interface ToolLog {
    id: string;
    toolId: string;
    timestamp: string;
    input: Record<string, unknown>;
    output: string;
    duration: number;
    status: 'success' | 'error';
}

const tools = (mockData as { tools?: Tool[] }).tools || [];
const toolLogs = (mockData as { toolLogs?: ToolLog[] }).toolLogs || [];

export default function ToolDetailPage() {
    const params = useParams();
    const router = useRouter();
    const toolId = params.id as string;

    const tool = tools.find((t) => t.id === toolId);
    const logs = toolLogs.filter((l) => l.toolId === toolId);

    const [activeTab, setActiveTab] = useState<'info' | 'params' | 'permissions' | 'logs'>('info');
    const [isEnabled, setIsEnabled] = useState(tool?.status === 'active');
    const [testInput, setTestInput] = useState('');
    const [testResult, setTestResult] = useState<string | null>(null);

    if (!tool) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">找不到此工具</p>
            </div>
        );
    }

    const handleTest = () => {
        // Mock test result
        setTestResult(`[Mock] 工具執行成功\n輸入: ${testInput}\n輸出: 測試結果 at ${new Date().toISOString()}`);
    };

    const tabs = [
        { id: 'info', label: '基本資訊', icon: Settings },
        { id: 'params', label: 'API 參數', icon: Key },
        { id: 'permissions', label: '權限設定', icon: Shield },
        { id: 'logs', label: '使用紀錄', icon: History },
    ] as const;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/tools')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-linear-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-xl">
                                    {tool.icon}
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-slate-900">{tool.name}</h1>
                                    <p className="text-sm text-slate-500">{tool.description}</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant={isEnabled ? 'default' : 'outline'}
                                onClick={() => setIsEnabled(!isEnabled)}
                                className={isEnabled ? 'bg-green-600 hover:bg-green-700' : ''}
                            >
                                <Power className="w-4 h-4 mr-2" />
                                {isEnabled ? '已啟用' : '已停用'}
                            </Button>
                            <Button>
                                <Save className="w-4 h-4 mr-2" />
                                儲存
                            </Button>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 mt-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${activeTab === tab.id
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {activeTab === 'info' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>基本資訊</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">名稱</label>
                                    <Input defaultValue={tool.name} className="mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">描述</label>
                                    <Textarea defaultValue={tool.description} className="mt-1" rows={3} />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">類別</label>
                                    <Input defaultValue={tool.category} className="mt-1" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>測試工具</CardTitle>
                                <CardDescription>輸入測試參數並執行</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <Textarea
                                    placeholder="輸入 JSON 格式的測試參數..."
                                    value={testInput}
                                    onChange={(e) => setTestInput(e.target.value)}
                                    rows={4}
                                    className="font-mono text-sm"
                                />
                                <Button onClick={handleTest} className="w-full">
                                    <Play className="w-4 h-4 mr-2" />
                                    執行測試
                                </Button>
                                {testResult && (
                                    <pre className="p-3 bg-slate-900 text-green-400 rounded-lg text-sm overflow-x-auto">
                                        {testResult}
                                    </pre>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                )}

                {activeTab === 'params' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>API Key 與參數</CardTitle>
                            <CardDescription>設定此工具的 API 金鑰與連線參數</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-slate-700">API Key</label>
                                <Input type="password" placeholder="sk-..." className="mt-1 font-mono" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Endpoint URL</label>
                                <Input placeholder="https://api.example.com/v1" className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">Timeout (ms)</label>
                                <Input type="number" defaultValue={30000} className="mt-1" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-slate-700">額外參數 (JSON)</label>
                                <Textarea
                                    placeholder='{ "maxRetries": 3 }'
                                    className="mt-1 font-mono"
                                    rows={4}
                                />
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'permissions' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>權限設定</CardTitle>
                            <CardDescription>控制哪些角色可以使用此工具</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {['教師', '學生', 'AI 代理人', '訪客'].map((role) => (
                                    <label key={role} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50">
                                        <span className="font-medium text-slate-700">{role}</span>
                                        <input type="checkbox" defaultChecked={role !== '訪客'} className="w-5 h-5" />
                                    </label>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {activeTab === 'logs' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>使用紀錄</CardTitle>
                            <CardDescription>最近的工具呼叫紀錄</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-slate-50 border-b">
                                        <tr>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">時間</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">輸入</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">耗時</th>
                                            <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">狀態</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {logs.length > 0 ? (
                                            logs.map((log) => (
                                                <tr key={log.id} className="border-b last:border-0">
                                                    <td className="py-3 px-4 text-sm text-slate-600">
                                                        <div className="flex items-center gap-2">
                                                            <Clock className="w-4 h-4 text-slate-400" />
                                                            {new Date(log.timestamp).toLocaleString('zh-TW')}
                                                        </div>
                                                    </td>
                                                    <td className="py-3 px-4 text-sm font-mono text-slate-600 max-w-xs truncate">
                                                        {JSON.stringify(log.input)}
                                                    </td>
                                                    <td className="py-3 px-4 text-sm text-slate-600">{log.duration}ms</td>
                                                    <td className="py-3 px-4">
                                                        {log.status === 'success' ? (
                                                            <Badge className="bg-green-100 text-green-700">
                                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                                成功
                                                            </Badge>
                                                        ) : (
                                                            <Badge className="bg-red-100 text-red-700">
                                                                <XCircle className="w-3 h-3 mr-1" />
                                                                失敗
                                                            </Badge>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan={4} className="py-8 text-center text-slate-400">
                                                    尚無使用紀錄
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
