'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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
import MockDataService, { type AgentTemplate, type WorkflowTemplate } from '@/lib/mock';

// Get templates from centralized MockDataService
const agentTemplates = MockDataService.getAgentTemplates();
const workflowTemplates = MockDataService.getWorkflowTemplates();

type TabType = 'agent' | 'workflow';
type FilterType = 'all' | 'system' | 'custom';

type TemplateType = AgentTemplate | WorkflowTemplate;

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

    const router = useRouter(); // Initialize router

    const handleUseTemplate = (templateId: string, templateName: string, type: TabType) => {
        const confirmMsg = `確定要使用「${templateName}」這個${type === 'agent' ? '代理人' : '工作流'}模板嗎？\n這將會建立一個新的副本。`;
        if (confirm(confirmMsg)) {
            // Mock API call - in reality we would create a copy backend side
            console.log(`Using template: ${templateId} (${type})`);

            if (type === 'agent') {
                // Navigate to agent creation with template ID
                router.push(`/agents/new?template=${templateId}`);
            } else {
                // Navigate to builder with template ID
                router.push(`/builder?template=${templateId}`);
            }
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
    template: TemplateType;
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
