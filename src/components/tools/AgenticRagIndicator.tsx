'use client';

import { Database, Search, Layers } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface AgenticRagIndicatorProps {
    isTriggered: boolean;
    knowledgeBaseName?: string;
    retrievalDepth?: number;
}

export function AgenticRagIndicator({
    isTriggered,
    knowledgeBaseName,
    retrievalDepth = 3,
}: AgenticRagIndicatorProps) {
    if (!isTriggered) return null;

    return (
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-full text-xs">
            <div className="flex items-center gap-1 text-purple-600">
                <Search className="w-3 h-3" />
                <span>RAG 檢索</span>
            </div>
            {knowledgeBaseName && (
                <>
                    <span className="text-purple-300">|</span>
                    <div className="flex items-center gap-1 text-purple-600">
                        <Database className="w-3 h-3" />
                        <span>{knowledgeBaseName}</span>
                    </div>
                </>
            )}
            <span className="text-purple-300">|</span>
            <div className="flex items-center gap-1 text-purple-600">
                <Layers className="w-3 h-3" />
                <span>深度 {retrievalDepth}</span>
            </div>
        </div>
    );
}
