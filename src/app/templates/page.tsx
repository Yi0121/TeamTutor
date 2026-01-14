'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Bot,
    GitBranch,
    Star,
    Clock,
    User,
    Tag,
    Search,
    Plus,
    Copy,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

// Mock Template Data
const agentTemplates = [
    {
        id: 'tpl-agent-001',
        name: '友善數學導師',
        description: '專為數學教學設計的 AI 助教，善於用生活化的例子解釋抽象概念。',
        author: '系統預設',
        isSystem: true,
        tags: ['數學', '教育', '導師'],
        usageCount: 128,
        createdAt: '2024-01-01',
        preview: '你是一位友善的數學導師，專門幫助學生理解數學概念。你會用生活中的例子來解釋抽象的數學原理。',
    },
    {
        id: 'tpl-agent-002',
        name: '蘇格拉底式提問者',
        description: '不直接給答案，用問題引導學生思考，培養批判性思維。',
        author: '系統預設',
        isSystem: true,
        tags: ['通用', '思辨', '提問'],
        usageCount: 89,
        createdAt: '2024-01-05',
        preview: '你運用蘇格拉底式提問法，不直接給答案，透過問題引導學生思考。',
    },
    {
        id: 'tpl-agent-003',
        name: '英語對話夥伴',
        description: '模擬英語母語者的對話夥伴，幫助學生練習口語表達。',
        author: '王老師',
        isSystem: false,
        tags: ['英語', '口語', '對話'],
        usageCount: 45,
        createdAt: '2024-02-10',
        preview: 'You are a friendly English conversation partner. Help students practice speaking naturally.',
    },
];

const workflowTemplates = [
    {
        id: 'tpl-wf-001',
        name: '基礎問答流程',
        description: '標準的學生提問、AI 回答、教師確認的三階段流程。',
        author: '系統預設',
        isSystem: true,
        tags: ['基礎', '問答'],
        usageCount: 234,
        createdAt: '2024-01-01',
        nodeCount: 5,
    },
    {
        id: 'tpl-wf-002',
        name: '協作討論模式',
        description: '多個 AI 同儕輪流發言，引導深度討論的流程設計。',
        author: '系統預設',
        isSystem: true,
        tags: ['協作', '討論', '進階'],
        usageCount: 156,
        createdAt: '2024-01-15',
        nodeCount: 8,
    },
    {
        id: 'tpl-wf-003',
        name: '自適應學習路徑',
        description: '根據學生表現動態調整問題難度的智慧流程。',
        author: '李教授',
        isSystem: false,
        tags: ['自適應', '智慧'],
        usageCount: 67,
        createdAt: '2024-03-01',
        nodeCount: 12,
    },
];

type TabType = 'agent' | 'workflow';
type FilterType = 'all' | 'system' | 'custom';

export default function TemplatesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('agent');
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const templates = activeTab === 'agent' ? agentTemplates : workflowTemplates;

    const filteredTemplates = templates.filter((tpl) => {
        const matchesFilter =
            filter === 'all' ||
            (filter === 'system' && tpl.isSystem) ||
            (filter === 'custom' && !tpl.isSystem);

        const matchesSearch =
            searchQuery === '' ||
            tpl.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tpl.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tpl.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesFilter && matchesSearch;
    });

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">模板庫</h1>
                            <p className="text-slate-500 mt-1">瀏覽與管理 Agent 及 Workflow 模板</p>
                        </div>
                        <Button className="gap-2">
                            <Plus className="w-4 h-4" />
                            新增模板
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                {/* Tabs & Filters */}
                <div className="flex items-center justify-between mb-6">
                    {/* Tab Switcher */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                        <button
                            onClick={() => setActiveTab('agent')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${activeTab === 'agent'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <Bot className="w-4 h-4" />
                            Agent 模板
                        </button>
                        <button
                            onClick={() => setActiveTab('workflow')}
                            className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-colors ${activeTab === 'workflow'
                                    ? 'bg-white text-slate-900 shadow-sm'
                                    : 'text-slate-600 hover:text-slate-900'
                                }`}
                        >
                            <GitBranch className="w-4 h-4" />
                            Workflow 模板
                        </button>
                    </div>

                    {/* Search & Filter */}
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="搜尋模板..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-9 w-64"
                            />
                        </div>
                        <select
                            value={filter}
                            onChange={(e) => setFilter(e.target.value as FilterType)}
                            className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">全部</option>
                            <option value="system">系統模板</option>
                            <option value="custom">自訂模板</option>
                        </select>
                    </div>
                </div>

                {/* Template Grid */}
                {filteredTemplates.length === 0 ? (
                    <div className="text-center py-16 text-slate-400">
                        沒有符合條件的模板
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredTemplates.map((template) => (
                            <TemplateCard
                                key={template.id}
                                template={template}
                                type={activeTab}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}

// Template Card Component
function TemplateCard({
    template,
    type,
}: {
    template: (typeof agentTemplates)[0] | (typeof workflowTemplates)[0];
    type: TabType;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${type === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                        {type === 'agent' ? <Bot className="w-5 h-5" /> : <GitBranch className="w-5 h-5" />}
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {template.name}
                        </h3>
                        <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                            <User className="w-3 h-3" />
                            {template.author}
                        </div>
                    </div>
                </div>
                {template.isSystem && (
                    <Badge variant="secondary" className="text-xs">
                        <Star className="w-3 h-3 mr-1" />
                        系統
                    </Badge>
                )}
            </div>

            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-4">
                {template.description}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-1 mb-4">
                {template.tags.map((tag) => (
                    <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded-full text-xs bg-slate-100 text-slate-600"
                    >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                    </span>
                ))}
            </div>

            {/* Stats */}
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        {template.usageCount} 次使用
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.createdAt}
                    </span>
                </div>
                <Button variant="ghost" size="sm" className="gap-1 text-blue-600 hover:text-blue-700">
                    <Eye className="w-3 h-3" />
                    預覽
                </Button>
            </div>
        </div>
    );
}
