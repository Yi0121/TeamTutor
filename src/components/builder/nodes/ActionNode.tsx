'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Play } from 'lucide-react';

interface ActionNodeData {
    label: string;
    actionType?: string;
    toolName?: string;
}

export const ActionNode = memo(function ActionNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as ActionNodeData;

    return (
        <div
            className={`px-4 py-3 rounded-xl bg-white border-2 shadow-sm min-w-[150px] ${selected ? 'border-purple-500 shadow-purple-100' : 'border-purple-200'
                }`}
        >
            <Handle type="target" position={Position.Top} className="bg-purple-500!" />

            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-100 rounded-lg">
                    <Play className="w-4 h-4 text-purple-600" />
                </div>
                <div>
                    <div className="font-medium text-slate-900 text-sm">{nodeData.label}</div>
                    {nodeData.toolName && (
                        <div className="text-xs text-slate-500">{nodeData.toolName}</div>
                    )}
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="bg-purple-500!" />
        </div>
    );
});
