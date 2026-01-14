'use client';

import { Bot, Zap, GitBranch, Play, StopCircle } from 'lucide-react';

const nodeTypes = [
    {
        type: 'trigger',
        label: '觸發器',
        icon: Zap,
        color: 'bg-green-500',
        description: '定義工作流程的起點',
    },
    {
        type: 'agent',
        label: '代理人',
        icon: Bot,
        color: 'bg-blue-500',
        description: 'AI 代理人節點',
    },
    {
        type: 'condition',
        label: '條件',
        icon: GitBranch,
        color: 'bg-amber-500',
        description: '條件分支判斷',
    },
    {
        type: 'action',
        label: '動作',
        icon: Play,
        color: 'bg-purple-500',
        description: '執行特定動作',
    },
    {
        type: 'end',
        label: '結束',
        icon: StopCircle,
        color: 'bg-red-500',
        description: '工作流程終點',
    },
];

export function NodePalette() {
    const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">節點元件</h2>
                <p className="text-xs text-slate-500 mt-1">拖曳至畫布以新增</p>
            </div>

            {/* Node Types */}
            <div className="flex-1 p-4 space-y-3">
                {nodeTypes.map((node) => {
                    const Icon = node.icon;
                    return (
                        <div
                            key={node.type}
                            draggable
                            onDragStart={(e) => onDragStart(e, node.type)}
                            className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-200 cursor-grab hover:bg-slate-100 hover:border-slate-300 active:cursor-grabbing transition-colors"
                        >
                            <div className={`p-2 rounded-lg ${node.color} text-white`}>
                                <Icon className="w-4 h-4" />
                            </div>
                            <div>
                                <div className="font-medium text-slate-900 text-sm">{node.label}</div>
                                <div className="text-xs text-slate-500">{node.description}</div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 text-center">
                    按住節點拖曳至畫布
                </p>
            </div>
        </div>
    );
}
