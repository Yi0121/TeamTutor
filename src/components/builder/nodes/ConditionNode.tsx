'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

interface ConditionNodeData {
    label: string;
    condition?: string;
}

export const ConditionNode = memo(function ConditionNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as ConditionNodeData;

    return (
        <div
            className={`px-4 py-3 rounded-xl bg-white border-2 shadow-sm min-w-[150px] ${selected ? 'border-amber-500 shadow-amber-100' : 'border-amber-200'
                }`}
        >
            <Handle type="target" position={Position.Top} className="bg-amber-500!" />

            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-amber-100 rounded-lg">
                    <GitBranch className="w-4 h-4 text-amber-600" />
                </div>
                <div>
                    <div className="font-medium text-slate-900 text-sm">{nodeData.label}</div>
                    <div className="text-xs text-slate-500">條件</div>
                </div>
            </div>

            <Handle
                type="source"
                position={Position.Bottom}
                id="yes"
                style={{ left: '30%' }}
                className="bg-green-500!"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                id="no"
                style={{ left: '70%' }}
                className="bg-red-500!"
            />
        </div>
    );
});
