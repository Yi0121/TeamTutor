'use client';

import { X, Bot, Thermometer, MessageSquare } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { Participant } from '@/types';
import MockDataService from '@/lib/mock';
import type { AgentConfig } from '@/types';

interface AgentConfigDrawerProps {
    participant: Participant;
    isOpen: boolean;
    onClose: () => void;
}

const agents = MockDataService.getAgents();

export function AgentConfigDrawer({
    participant,
    isOpen,
    onClose,
}: AgentConfigDrawerProps) {
    if (!isOpen) return null;

    const agentConfig = agents.find((a) => a.id === participant.id);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/30 z-40"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-xl z-50 overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 p-4 flex items-center justify-between">
                    <h2 className="font-semibold text-slate-900">代理人資訊</h2>
                    <Button variant="ghost" size="icon" onClick={onClose}>
                        <X className="w-5 h-5" />
                    </Button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-linear-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-2xl">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-slate-900">{participant.name}</h3>
                            <Badge variant="outline" className="mt-1">
                                {participant.role}
                            </Badge>
                        </div>
                    </div>

                    {agentConfig ? (
                        <>
                            {/* Description */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">描述</h4>
                                <p className="text-slate-700">{agentConfig.description}</p>
                            </div>

                            {/* Model */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">語言模型</h4>
                                <Badge className="bg-blue-100 text-blue-700">
                                    {agentConfig.baseModel}
                                </Badge>
                            </div>

                            {/* Temperature */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                                    <Thermometer className="w-4 h-4" />
                                    Temperature
                                </h4>
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-orange-500 rounded-full"
                                            style={{ width: `${agentConfig.temperature * 100}%` }}
                                        />
                                    </div>
                                    <span className="text-sm font-mono text-slate-600">
                                        {agentConfig.temperature}
                                    </span>
                                </div>
                            </div>

                            {/* Communication Style */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2 flex items-center gap-2">
                                    <MessageSquare className="w-4 h-4" />
                                    溝通風格
                                </h4>
                                <Badge variant="outline">{agentConfig.communicationStyle}</Badge>
                            </div>

                            {/* Knowledge Level */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">知識層級</h4>
                                <div className="flex items-center gap-2">
                                    {Array.from({ length: 10 }).map((_, i) => (
                                        <div
                                            key={i}
                                            className={`w-4 h-4 rounded ${i < agentConfig.knowledgeLevel
                                                ? 'bg-green-500'
                                                : 'bg-slate-200'
                                                }`}
                                        />
                                    ))}
                                    <span className="text-sm text-slate-600 ml-2">
                                        {agentConfig.knowledgeLevel}/10
                                    </span>
                                </div>
                            </div>

                            {/* System Prompt Preview */}
                            <div>
                                <h4 className="text-sm font-medium text-slate-500 mb-2">System Prompt</h4>
                                <pre className="p-3 bg-slate-100 rounded-lg text-xs text-slate-700 overflow-x-auto max-h-32">
                                    {agentConfig.systemPrompt.slice(0, 200)}...
                                </pre>
                            </div>
                        </>
                    ) : (
                        <p className="text-slate-500">此參與者不是 AI 代理人</p>
                    )}
                </div>
            </div>
        </>
    );
}
