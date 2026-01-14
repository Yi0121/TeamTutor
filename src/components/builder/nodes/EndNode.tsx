'use client';

import { Handle, Position, type NodeProps } from '@xyflow/react';

interface EndNodeData {
    label: string;
}

export function EndNode({ data, selected }: NodeProps) {
    const nodeData = data as unknown as EndNodeData;

    return (
        <div
            className={`px-4 py-3 rounded-full border-2 shadow-md min-w-[100px] text-center transition-all ${selected
                    ? 'border-red-500 bg-red-50 shadow-lg'
                    : 'border-red-300 bg-white hover:border-red-400'
                }`}
        >
            <Handle
                type="target"
                position={Position.Top}
                className="w-3 h-3 bg-red-500!"
            />
            <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <span className="text-sm font-medium text-red-700">
                    {nodeData.label || '結束'}
                </span>
            </div>
        </div>
    );
}
