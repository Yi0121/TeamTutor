'use client';

import Link from 'next/link';
import { Plus, Bot, Brain, Sparkles } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import MockDataService from '@/lib/mock';
import type { AgentConfig, LLMModel } from '@/types';
import { useAuth } from '@/lib/auth/AuthContext';

export default function AgentsPage() {
    const { user } = useAuth();
    // In a real app, this would be an async API call via useEffect
    // For now, we pass user?.id to our mock service which filters synchronously
    const agents = MockDataService.getAgents(user?.id);
    const models = MockDataService.getLLMModels();

    function getModelName(modelId: string): string {
        return models.find((m) => m.id === modelId)?.name || modelId;
    }

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">AI 代理人管理</h1>
                            <p className="text-slate-500 mt-1">設定與管理虛擬課堂中的 AI 角色</p>
                        </div>
                        <Button className="gap-2" asChild>
                            <Link href="/agents/new">
                                <Plus className="w-4 h-4" />
                                新增代理人
                            </Link>
                        </Button>
                    </div>
                </div>
            </header>

            {/* Agent Cards Grid */}
            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {agents.map((agent) => (
                        <AgentCard key={agent.id} agent={agent} getModelName={getModelName} />
                    ))}
                </div>
            </main>
        </div>
    );
}

function AgentCard({ agent, getModelName }: { agent: AgentConfig; getModelName: (id: string) => string }) {
    const modelName = getModelName(agent.baseModel);

    return (
        <Link href={`/agents/${agent.id}`}>
            <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-blue-300 transition-all cursor-pointer group">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                    <Avatar className="w-14 h-14 ring-2 ring-slate-100 group-hover:ring-blue-200 transition-all">
                        <AvatarImage src={agent.avatar} alt={agent.name} />
                        <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-lg">
                            {agent.name.charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {agent.name}
                        </h3>
                        <p className="text-sm text-slate-500 line-clamp-2 mt-1">
                            {agent.description}
                        </p>
                    </div>
                </div>

                {/* Model Badge */}
                <div className="flex flex-wrap gap-2 mb-4">
                    <Badge variant="secondary" className="gap-1">
                        <Bot className="w-3 h-3" />
                        {modelName}
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                        <Brain className="w-3 h-3" />
                        知識等級 {agent.knowledgeLevel}/10
                    </Badge>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-slate-500 pt-4 border-t border-slate-100">
                    <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>溫度 {agent.temperature}</span>
                    </div>
                    <span>{agent.ragKnowledgeBaseIds.length} 個知識庫</span>
                </div>
            </div>
        </Link>
    );
}
