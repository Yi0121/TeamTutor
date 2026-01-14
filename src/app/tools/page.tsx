'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Wrench, Zap, Clock, BarChart3, Power } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import mockData from '../../../mock_data.json';

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

function getCategoryColor(category: string) {
    switch (category) {
        case 'math':
            return 'bg-blue-100 text-blue-700';
        case 'research':
            return 'bg-green-100 text-green-700';
        case 'code':
            return 'bg-purple-100 text-purple-700';
        default:
            return 'bg-slate-100 text-slate-700';
    }
}

function getCategoryLabel(category: string) {
    switch (category) {
        case 'math':
            return '數學';
        case 'research':
            return '研究';
        case 'code':
            return '程式';
        default:
            return category;
    }
}

export default function ToolsPage() {
    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Wrench className="w-6 h-6 text-purple-600" />
                                MCP 工具管理
                            </h1>
                            <p className="text-slate-500 mt-1">管理與監控 AI 代理人可使用的外部工具</p>
                        </div>
                        <Button>
                            <Zap className="w-4 h-4 mr-2" />
                            新增工具
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Tools Grid */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">已註冊工具</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {tools.map((tool) => (
                            <ToolCard key={tool.id} tool={tool} />
                        ))}
                    </div>
                </section>

                {/* Recent Logs */}
                <section>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <Clock className="w-5 h-5 text-slate-400" />
                            最近呼叫紀錄
                        </h2>
                        <Button variant="outline" size="sm">
                            查看全部
                        </Button>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">工具</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">時間</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">輸入</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">耗時</th>
                                    <th className="text-left py-3 px-4 text-sm font-medium text-slate-500">狀態</th>
                                </tr>
                            </thead>
                            <tbody>
                                {toolLogs.map((log) => {
                                    const tool = tools.find((t) => t.id === log.toolId);
                                    return (
                                        <tr key={log.id} className="border-t border-slate-100 hover:bg-slate-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl">{tool?.icon}</span>
                                                    <span className="font-medium text-slate-900">{tool?.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600 text-sm">
                                                {new Date(log.timestamp).toLocaleString('zh-TW')}
                                            </td>
                                            <td className="py-3 px-4">
                                                <code className="text-xs bg-slate-100 px-2 py-1 rounded">
                                                    {JSON.stringify(log.input).slice(0, 40)}...
                                                </code>
                                            </td>
                                            <td className="py-3 px-4 text-slate-600">{log.duration}ms</td>
                                            <td className="py-3 px-4">
                                                <Badge
                                                    variant="secondary"
                                                    className={
                                                        log.status === 'success'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-red-100 text-red-700'
                                                    }
                                                >
                                                    {log.status === 'success' ? '成功' : '失敗'}
                                                </Badge>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </main>
        </div>
    );
}

function ToolCard({ tool }: { tool: Tool }) {
    const [isEnabled, setIsEnabled] = useState(tool.status === 'active');

    const handleToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsEnabled(!isEnabled);
    };

    return (
        <Link href={`/tools/${tool.id}`}>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                    <span className="text-3xl">{tool.icon}</span>
                    <button
                        onClick={handleToggle}
                        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${isEnabled
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                            }`}
                    >
                        <Power className="w-3 h-3" />
                        {isEnabled ? '啟用' : '停用'}
                    </button>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{tool.name}</h3>
                <p className="text-sm text-slate-500 mb-3">{tool.description}</p>

                <div className="flex items-center justify-between text-sm">
                    <Badge variant="outline" className={getCategoryColor(tool.category)}>
                        {getCategoryLabel(tool.category)}
                    </Badge>
                    <div className="flex items-center gap-1 text-slate-400">
                        <BarChart3 className="w-4 h-4" />
                        <span>{tool.callCount} 次</span>
                    </div>
                </div>
            </div>
        </Link>
    );
}
