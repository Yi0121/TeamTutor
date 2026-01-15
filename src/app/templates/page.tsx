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
    X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

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
    {
        id: 'tpl-agent-004',
        name: '歷史情境模擬者',
        description: '扮演歷史人物，讓學生透過對話身歷其境，了解歷史背景。',
        author: '系統預設',
        isSystem: true,
        tags: ['歷史', '角色扮演', '社會'],
        usageCount: 210,
        createdAt: '2024-01-20',
        preview: '你將扮演指定的歷史人物，用第一人稱視角回答學生問題，堅持當時的價值觀與知識背景。',
    },
    {
        id: 'tpl-agent-005',
        name: '程式碼審查專家',
        description: '協助學生檢查程式碼邏輯、風格與安全性，並給予具體建議。',
        author: '張教授',
        isSystem: false,
        tags: ['程式', 'Code Review', '資訊'],
        usageCount: 76,
        createdAt: '2024-02-28',
        preview: '你是資深的軟體工程師，請針對學生的程式碼進行 Code Review，指出潛在錯誤與優化空間。',
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
    {
        id: 'tpl-wf-004',
        name: 'PBL 專題導向流程',
        description: '引導學生從問題定義、資料蒐集到方案提出的完整專題學習流程。',
        author: '系統預設',
        isSystem: true,
        tags: ['PBL', '專題', '探究'],
        usageCount: 112,
        createdAt: '2024-01-25',
        nodeCount: 15,
    },
    {
        id: 'tpl-wf-005',
        name: '辯論比賽流程',
        description: '包含正方、反方 AI 與裁判 AI 的標準辯論流程控制。',
        author: 'DebateClub',
        isSystem: false,
        tags: ['辯論', '思辨', '多人'],
        usageCount: 34,
        createdAt: '2024-03-10',
        nodeCount: 9,
    },
];

type TabType = 'agent' | 'workflow';
type FilterType = 'all' | 'system' | 'custom';

type TemplateType = (typeof agentTemplates)[0] | (typeof workflowTemplates)[0];

export default function TemplatesPage() {
    const [activeTab, setActiveTab] = useState<TabType>('agent');
    const [filter, setFilter] = useState<FilterType>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [previewTemplate, setPreviewTemplate] = useState<TemplateType | null>(null);
    const [previewType, setPreviewType] = useState<TabType>('agent');

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

    const handleUseTemplate = (templateId: string, templateName: string, type: TabType) => {
        const confirmMsg = `確定要使用「${templateName}」這個${type === 'agent' ? '代理人' : '工作流'}模板嗎？\n這將會建立一個新的副本。`;
        if (confirm(confirmMsg)) {
            // Mock API call
            console.log(`Using template: ${templateId} (${type})`);
            const targetUrl = type === 'agent' ? '/agents/new' : '/builder/new';
            // In a real app we would pass the template ID, here we just mock the redirect
            alert(`已建立副本！正在導向至編輯頁面...`);
            // router.push(`${targetUrl}?template=${templateId}`);
        }
    };

    const handlePreview = (template: TemplateType, type: TabType) => {
        setPreviewTemplate(template);
        setPreviewType(type);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Template Preview Modal */}
            <Dialog open={!!previewTemplate} onOpenChange={(open) => !open && setPreviewTemplate(null)}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${previewType === 'agent' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                                {previewType === 'agent' ? <Bot className="w-5 h-5" /> : <GitBranch className="w-5 h-5" />}
                            </div>
                            <div>
                                <DialogTitle>{previewTemplate?.name}</DialogTitle>
                                <DialogDescription className="flex items-center gap-2 mt-1">
                                    <User className="w-3 h-3" />
                                    {previewTemplate?.author}
                                    {previewTemplate?.isSystem && (
                                        <Badge variant="secondary" className="text-xs ml-2">
                                            <Star className="w-3 h-3 mr-1" />
                                            系統預設
                                        </Badge>
                                    )}
                                </DialogDescription>
                            </div>
                        </div>
                    </DialogHeader>

                    <div className="space-y-4 mt-4">
                        {/* Description */}
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">描述</h4>
                            <p className="text-slate-600">{previewTemplate?.description}</p>
                        </div>

                        {/* Tags */}
                        <div>
                            <h4 className="text-sm font-medium text-slate-700 mb-2">標籤</h4>
                            <div className="flex flex-wrap gap-2">
                                {previewTemplate?.tags.map((tag) => (
                                    <Badge key={tag} variant="outline" className="text-xs">
                                        <Tag className="w-3 h-3 mr-1" />
                                        {tag}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        {/* Preview Content (for agent templates) */}
                        {'preview' in (previewTemplate || {}) && (
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">System Prompt 預覽</h4>
                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200 font-mono text-sm text-slate-700 whitespace-pre-wrap">
                                    {(previewTemplate as typeof agentTemplates[0])?.preview}
                                </div>
                            </div>
                        )}

                        {/* Node Count (for workflow templates) */}
                        {'nodeCount' in (previewTemplate || {}) && (
                            <div>
                                <h4 className="text-sm font-medium text-slate-700 mb-2">工作流資訊</h4>
                                <div className="flex items-center gap-4 text-sm text-slate-600">
                                    <span className="flex items-center gap-1">
                                        <GitBranch className="w-4 h-4" />
                                        {(previewTemplate as typeof workflowTemplates[0])?.nodeCount} 個節點
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Copy className="w-4 h-4" />
                                        已被使用 {previewTemplate?.usageCount} 次
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Stats */}
                        <div className="flex items-center gap-4 text-sm text-slate-500 pt-4 border-t">
                            <span className="flex items-center gap-1">
                                <Copy className="w-4 h-4" />
                                使用次數: {previewTemplate?.usageCount}
                            </span>
                            <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                建立日期: {previewTemplate?.createdAt}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="outline" onClick={() => setPreviewTemplate(null)}>
                            關閉
                        </Button>
                        <Button onClick={() => {
                            if (previewTemplate) {
                                handleUseTemplate(previewTemplate.id, previewTemplate.name, previewType);
                                setPreviewTemplate(null);
                            }
                        }}>
                            使用此模板
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

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
                                onUse={() => handleUseTemplate(template.id, template.name, activeTab)}
                                onPreview={() => handlePreview(template, activeTab)}
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
    onUse,
    onPreview,
}: {
    template: (typeof agentTemplates)[0] | (typeof workflowTemplates)[0];
    type: TabType;
    onUse: () => void;
    onPreview: () => void;
}) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all group flex flex-col h-full">
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
            <p className="text-sm text-slate-600 line-clamp-2 mb-4 flex-1">
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
            <div className="flex items-center justify-between text-xs text-slate-400 pt-4 border-t border-slate-100 mt-auto">
                <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1">
                        <Copy className="w-3 h-3" />
                        {template.usageCount}
                    </span>
                    <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {template.createdAt}
                    </span>
                </div>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="gap-1 h-8 px-2 text-slate-500" onClick={onPreview}>
                        <Eye className="w-3 h-3" />
                        預覽
                    </Button>
                    <Button
                        size="sm"
                        variant="secondary"
                        className="gap-1 h-8 px-3 bg-blue-50 text-blue-600 hover:bg-blue-100 border-none shadow-none"
                        onClick={onUse}
                    >
                        使用
                    </Button>
                </div>
            </div>
        </div>
    );
}
