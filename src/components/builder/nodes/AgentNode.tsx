'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Bot } from 'lucide-react';

interface AgentNodeData {
    label: string;
    agentId?: string;
    model?: string;
}

export const AgentNode = memo(function AgentNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as AgentNodeData;

    return (
        <div
            className={`px-4 py-3 rounded-xl bg-white border-2 shadow-sm min-w-[150px] ${selected ? 'border-blue-500 shadow-blue-100' : 'border-blue-200'
                }`}
        >
            <Handle type="target" position={Position.Top} className="bg-blue-500!" />

            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-100 rounded-lg">
                    <Bot className="w-4 h-4 text-blue-600" />
                </div>
                <div>
                    <div className="font-medium text-slate-900 text-sm">{nodeData.label}</div>
                    {nodeData.model && (
                        <div className="text-xs text-slate-500">{nodeData.model}</div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="bg-blue-500!" />
        </div>
    );
});
