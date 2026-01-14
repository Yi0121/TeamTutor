'use client';

import { ExternalLink, Wrench } from 'lucide-react';
import type { ToolCall } from '@/types';

interface ToolCallCardProps {
    toolCall: ToolCall;
}

const toolIcons: Record<string, React.ReactNode> = {
    geogebra: (
        <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M12 2 L22 12 L12 22 L2 12 Z" fill="none" stroke="currentColor" strokeWidth="1" />
        </svg>
    ),
};

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
    const icon = toolIcons[toolCall.toolName] || <Wrench className="w-5 h-5" />;

    return (
        <div className="mb-3 p-3 bg-linear-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
            <div className="flex items-center gap-2 mb-2">
                <div className="p-1.5 bg-purple-100 rounded-lg text-purple-600">
                    {icon}
                </div>
                <div className="flex-1">
                    <span className="text-sm font-medium text-purple-900 capitalize">
                        {toolCall.toolName}
                    </span>
                    <span className="text-xs text-purple-500 ml-2">Tool Call</span>
                </div>
            </div>

            {/* Tool Output Link */}
            {toolCall.output && (
                <a
                    href={toolCall.output}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-lg text-sm text-purple-700 hover:text-purple-900 hover:bg-purple-50 transition-colors border border-purple-200"
                >
                    <ExternalLink className="w-3.5 h-3.5" />
                    開啟互動工具
                </a>
            )}

            {/* Tool Input Preview (collapsed) */}
            {toolCall.input && Object.keys(toolCall.input).length > 0 && (
                <details className="mt-2">
                    <summary className="text-xs text-purple-600 cursor-pointer hover:text-purple-800">
                        查看參數
                    </summary>
                    <pre className="mt-1 p-2 bg-white rounded text-xs text-slate-600 overflow-x-auto">
                        {JSON.stringify(toolCall.input, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    );
}
