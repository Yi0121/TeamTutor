'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import {
    ArrowLeft,
    Save,
    Bot,
    MessageSquare,
    Database,
    Sparkles,
    TestTube,
    Plus,
    Trash2,
    FileText,
    BookmarkPlus,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import MockDataService from '@/lib/mock';
import type { AgentConfig, LLMModel, KnowledgeBase, CommunicationStyleOption } from '@/types';

const agents = MockDataService.getAgents();
const models = MockDataService.getLLMModels();
const knowledgeBases = MockDataService.getKnowledgeBases();
const communicationStyles = MockDataService.getCommunicationStyles();

// Get templates from service
const promptTemplates = MockDataService.getAgentTemplates().map(t => ({
    id: t.id,
    name: t.name,
    prompt: t.preview,
}));

interface SuggestedQuestion {
    displayText: string;
    actualPrompt: string;
}

export default function AgentEditPage() {
    const params = useParams();
    const router = useRouter();
    const searchParams = useSearchParams();
    const agentId = params.id as string;
    const templateId = searchParams.get('template');

    // If "new" and templateId exists, try to find the template
    const template = templateId ? MockDataService.getAgentTemplateById(templateId) : null;

    const originalAgent = agents.find((a) => a.id === agentId);

    // Initial state logic
    const initialAgent: AgentConfig | null = originalAgent || (agentId === 'new' ? {
        id: `agent-${Date.now()}`,
        name: template ? template.name : '新代理人',
        description: template ? template.description : '',
        baseModel: 'gpt-4o',
        systemPrompt: template ? template.preview : '',
        temperature: 0.7,
        communicationStyle: 'friendly',
        knowledgeLevel: 2,
        ragKnowledgeBaseIds: [],
        suggestedQuestions: [],
        avatar: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    } : null);

    const [agent, setAgent] = useState<AgentConfig | null>(initialAgent);
    const [isTesting, setIsTesting] = useState(false);
    const [showTemplateModal, setShowTemplateModal] = useState(false);
    const [showSaveAsTemplateModal, setShowSaveAsTemplateModal] = useState(false);
    const [newTemplateName, setNewTemplateName] = useState('');

    // Initialize suggested questions from agent data (or empty array)
    const [suggestedQuestions, setSuggestedQuestions] = useState<SuggestedQuestion[]>(
        (initialAgent?.suggestedQuestions || []).map(q => ({ displayText: q, actualPrompt: q }))
    );

    if (!agent) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">找不到此代理人</p>
            </div>
        );
    }

    const handleSave = () => {
        // TODO: Save to backend
        console.log('Saving agent:', agent, 'Questions:', suggestedQuestions);
        alert('代理人設定已儲存（Mock）');
    };

    const handleInsertTemplate = (prompt: string) => {
        setAgent({ ...agent, systemPrompt: prompt });
        setShowTemplateModal(false);
    };

    const handleSaveAsTemplate = () => {
        if (!newTemplateName.trim()) return;
        // Mock save
        console.log('Saving as template:', { name: newTemplateName, prompt: agent.systemPrompt });
        alert(`已另存為模板「${newTemplateName}」（Mock）`);
        setShowSaveAsTemplateModal(false);
        setNewTemplateName('');
    };

    const addSuggestedQuestion = () => {
        setSuggestedQuestions([...suggestedQuestions, { displayText: '', actualPrompt: '' }]);
    };

    const removeSuggestedQuestion = (index: number) => {
        setSuggestedQuestions(suggestedQuestions.filter((_, i) => i !== index));
    };

    const updateSuggestedQuestion = (index: number, field: keyof SuggestedQuestion, value: string) => {
        const updated = [...suggestedQuestions];
        updated[index] = { ...updated[index], [field]: value };
        setSuggestedQuestions(updated);
    };


    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push('/agents')}
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">編輯代理人</h1>
                                <p className="text-sm text-slate-500">{agent.name}</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setIsTesting(true)}>
                                <TestTube className="w-4 h-4 mr-2" />
                                預覽測試
                            </Button>
                            <Button variant="outline" onClick={() => setShowSaveAsTemplateModal(true)}>
                                <BookmarkPlus className="w-4 h-4 mr-2" />
                                另存為模板
                            </Button>
                            <Button onClick={handleSave}>
                                <Save className="w-4 h-4 mr-2" />
                                儲存
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8 space-y-8">
                {/* Basic Info Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Bot className="w-5 h-5 text-blue-600" />
                        基本資訊
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Avatar */}
                        <div className="flex flex-col items-center gap-4">
                            <Avatar className="w-24 h-24 ring-4 ring-slate-100">
                                <AvatarImage src={agent.avatar} alt={agent.name} />
                                <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-2xl">
                                    {agent.name.charAt(0)}
                                </AvatarFallback>
                            </Avatar>
                            <Button variant="outline" size="sm">
                                更換頭像
                            </Button>
                        </div>

                        {/* Name & Description */}
                        <div className="md:col-span-2 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    名稱
                                </label>
                                <Input
                                    value={agent.name}
                                    onChange={(e) => setAgent({ ...agent, name: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    說明
                                </label>
                                <Textarea
                                    value={agent.description}
                                    onChange={(e) =>
                                        setAgent({ ...agent, description: e.target.value })
                                    }
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Model Settings Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-amber-500" />
                        模型設定
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* LLM Model Select */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                語言模型
                            </label>
                            <select
                                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={agent.baseModel}
                                onChange={(e) =>
                                    setAgent({ ...agent, baseModel: e.target.value })
                                }
                            >
                                {models.map((model) => (
                                    <option key={model.id} value={model.id}>
                                        {model.name} ({model.provider})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Communication Style - Three Axes */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 mb-3">
                                溝通風格設定
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Formality Slider */}
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>正式度</span>
                                        <span>{agent.communicationStyleDetailed?.formality ?? 50}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={agent.communicationStyleDetailed?.formality ?? 50}
                                        onChange={(e) =>
                                            setAgent({
                                                ...agent,
                                                communicationStyleDetailed: {
                                                    ...agent.communicationStyleDetailed,
                                                    formality: parseInt(e.target.value),
                                                    verbosity: agent.communicationStyleDetailed?.verbosity ?? 50,
                                                    encouragement: agent.communicationStyleDetailed?.encouragement ?? 50,
                                                },
                                            })
                                        }
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>輕鬆</span>
                                        <span>正式</span>
                                    </div>
                                </div>

                                {/* Verbosity Slider */}
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>詳盡度</span>
                                        <span>{agent.communicationStyleDetailed?.verbosity ?? 50}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={agent.communicationStyleDetailed?.verbosity ?? 50}
                                        onChange={(e) =>
                                            setAgent({
                                                ...agent,
                                                communicationStyleDetailed: {
                                                    ...agent.communicationStyleDetailed,
                                                    formality: agent.communicationStyleDetailed?.formality ?? 50,
                                                    verbosity: parseInt(e.target.value),
                                                    encouragement: agent.communicationStyleDetailed?.encouragement ?? 50,
                                                },
                                            })
                                        }
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>簡潔</span>
                                        <span>詳盡</span>
                                    </div>
                                </div>

                                {/* Encouragement Slider */}
                                <div>
                                    <div className="flex justify-between text-xs text-slate-500 mb-1">
                                        <span>鼓勵程度</span>
                                        <span>{agent.communicationStyleDetailed?.encouragement ?? 50}%</span>
                                    </div>
                                    <input
                                        type="range"
                                        min="0"
                                        max="100"
                                        step="5"
                                        value={agent.communicationStyleDetailed?.encouragement ?? 50}
                                        onChange={(e) =>
                                            setAgent({
                                                ...agent,
                                                communicationStyleDetailed: {
                                                    ...agent.communicationStyleDetailed,
                                                    formality: agent.communicationStyleDetailed?.formality ?? 50,
                                                    verbosity: agent.communicationStyleDetailed?.verbosity ?? 50,
                                                    encouragement: parseInt(e.target.value),
                                                },
                                            })
                                        }
                                        className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                                    />
                                    <div className="flex justify-between text-xs text-slate-400 mt-1">
                                        <span>嚴格</span>
                                        <span>鼓勵</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Temperature Slider */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                溫度 (Temperature): {agent.temperature}
                            </label>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={agent.temperature}
                                onChange={(e) =>
                                    setAgent({ ...agent, temperature: parseFloat(e.target.value) })
                                }
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>精確 (0)</span>
                                <span>創意 (1)</span>
                            </div>
                        </div>

                        {/* Knowledge Level Slider */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                知識等級: {agent.knowledgeLevel}/10
                            </label>
                            <input
                                type="range"
                                min="1"
                                max="10"
                                step="1"
                                value={agent.knowledgeLevel}
                                onChange={(e) =>
                                    setAgent({
                                        ...agent,
                                        knowledgeLevel: parseInt(e.target.value),
                                    })
                                }
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                            <div className="flex justify-between text-xs text-slate-400 mt-1">
                                <span>初學 (1)</span>
                                <span>專家 (10)</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* System Prompt Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-green-600" />
                            System Prompt
                        </h2>
                        <Button variant="outline" size="sm" onClick={() => setShowTemplateModal(true)}>
                            <FileText className="w-4 h-4 mr-2" />
                            套用模板
                        </Button>
                    </div>

                    <Textarea
                        value={agent.systemPrompt}
                        onChange={(e) =>
                            setAgent({ ...agent, systemPrompt: e.target.value })
                        }
                        rows={8}
                        className="font-mono text-sm"
                        placeholder="輸入代理人的系統提示詞..."
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        此提示詞將作為 AI 的角色設定，決定其回應風格與行為模式。
                    </p>
                </section>

                {/* Knowledge Base Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-6 flex items-center gap-2">
                        <Database className="w-5 h-5 text-purple-600" />
                        關聯知識庫
                    </h2>

                    <div className="space-y-3">
                        {knowledgeBases.map((kb) => (
                            <label
                                key={kb.id}
                                className="flex items-center gap-3 p-3 rounded-lg border border-slate-200 hover:bg-slate-50 cursor-pointer"
                            >
                                <Checkbox
                                    checked={agent.ragKnowledgeBaseIds.includes(kb.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked) {
                                            setAgent({
                                                ...agent,
                                                ragKnowledgeBaseIds: [...agent.ragKnowledgeBaseIds, kb.id],
                                            });
                                        } else {
                                            setAgent({
                                                ...agent,
                                                ragKnowledgeBaseIds: agent.ragKnowledgeBaseIds.filter(
                                                    (id) => id !== kb.id
                                                ),
                                            });
                                        }
                                    }}
                                />
                                <div className="flex-1">
                                    <div className="font-medium text-slate-900">{kb.name}</div>
                                    <div className="text-sm text-slate-500">{kb.description}</div>
                                </div>
                                <Badge variant="secondary">
                                    {kb.documentCount} 文件
                                </Badge>
                            </label>
                        ))}
                    </div>
                </section>

                {/* Suggested Questions Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                            <MessageSquare className="w-5 h-5 text-blue-600" />
                            建議問題
                        </h2>
                        <Button variant="outline" size="sm" onClick={addSuggestedQuestion}>
                            <Plus className="w-4 h-4 mr-2" />
                            新增問題
                        </Button>
                    </div>

                    <p className="text-sm text-slate-500 mb-4">
                        設定預設的建議問題，讓學生快速開始互動。可設定顯示文字與實際發送的 Prompt。
                    </p>

                    {suggestedQuestions.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 border-2 border-dashed border-slate-200 rounded-lg">
                            尚無建議問題，點擊「新增問題」開始設定
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {suggestedQuestions.map((q, index) => (
                                <div key={index} className="p-4 border border-slate-200 rounded-lg bg-slate-50">
                                    <div className="flex items-start gap-4">
                                        <div className="flex-1 space-y-3">
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                                    顯示文字
                                                </label>
                                                <Input
                                                    value={q.displayText}
                                                    onChange={(e) => updateSuggestedQuestion(index, 'displayText', e.target.value)}
                                                    placeholder="例如：什麼是方程式？"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-medium text-slate-500 mb-1">
                                                    實際 Prompt
                                                </label>
                                                <Textarea
                                                    value={q.actualPrompt}
                                                    onChange={(e) => updateSuggestedQuestion(index, 'actualPrompt', e.target.value)}
                                                    placeholder="例如：請用簡單的例子解釋什麼是方程式..."
                                                    rows={2}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => removeSuggestedQuestion(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>

            {/* Test Dialog (Simple Mock) */}
            {isTesting && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-lg mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">預覽測試對話</h3>
                        <div className="bg-slate-50 rounded-lg p-4 h-64 overflow-y-auto mb-4">
                            <div className="text-sm text-slate-500 text-center py-8">
                                此功能需要連接後端 API
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setIsTesting(false)}
                        >
                            關閉
                        </Button>
                    </div>
                </div>
            )}

            {/* Template Selection Modal */}
            {showTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">選擇 Prompt 模板</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto mb-4">
                            {promptTemplates.map((tpl) => (
                                <button
                                    key={tpl.id}
                                    onClick={() => handleInsertTemplate(tpl.prompt)}
                                    className="w-full text-left p-4 border border-slate-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                >
                                    <div className="font-medium text-slate-900">{tpl.name}</div>
                                    <div className="text-sm text-slate-500 mt-1 line-clamp-2">{tpl.prompt}</div>
                                </button>
                            ))}
                        </div>
                        <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => setShowTemplateModal(false)}
                        >
                            取消
                        </Button>
                    </div>
                </div>
            )}

            {/* Save as Template Modal */}
            {showSaveAsTemplateModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl w-full max-w-md mx-4 p-6">
                        <h3 className="text-lg font-semibold mb-4">另存為模板</h3>
                        <p className="text-sm text-slate-500 mb-4">
                            將目前的 System Prompt 儲存為可重複使用的模板。
                        </p>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                模板名稱
                            </label>
                            <Input
                                value={newTemplateName}
                                onChange={(e) => setNewTemplateName(e.target.value)}
                                placeholder="例如：數學助教 Prompt"
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={() => setShowSaveAsTemplateModal(false)}
                            >
                                取消
                            </Button>
                            <Button
                                className="flex-1"
                                onClick={handleSaveAsTemplate}
                                disabled={!newTemplateName.trim()}
                            >
                                儲存模板
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
