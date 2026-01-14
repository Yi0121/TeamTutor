'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Zap } from 'lucide-react';

interface TriggerNodeData {
    label: string;
    triggerType?: string;
}

export const TriggerNode = memo(function TriggerNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as TriggerNodeData;

    return (
        <div
            className={`px-4 py-3 rounded-xl bg-white border-2 shadow-sm min-w-[150px] ${selected ? 'border-green-500 shadow-green-100' : 'border-green-200'
                }`}
        >
            <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-100 rounded-lg">
                    <Zap className="w-4 h-4 text-green-600" />
                </div>
                <div>
                    <div className="font-medium text-slate-900 text-sm">{nodeData.label}</div>
                    <div className="text-xs text-slate-500">觸發器</div>
                </div>
            </div>

            <Handle type="source" position={Position.Bottom} className="bg-green-500!" />
        </div>
    );
});
