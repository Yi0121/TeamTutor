'use client';

import type { Node } from '@xyflow/react';
import { Settings, Bot, Zap, GitBranch, Play } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface PropertyPanelProps {
    selectedNode: Node | null;
}

export function PropertyPanel({ selectedNode }: PropertyPanelProps) {
    if (!selectedNode) {
        return (
            <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                    <h2 className="font-semibold text-slate-900 flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        屬性設定
                    </h2>
                </div>
                <div className="flex-1 flex items-center justify-center p-6">
                    <p className="text-sm text-slate-400 text-center">
                        點擊節點以編輯屬性
                    </p>
                </div>
            </div>
        );
    }

    const getNodeIcon = () => {
        switch (selectedNode.type) {
            case 'agent':
                return <Bot className="w-5 h-5 text-blue-500" />;
            case 'trigger':
                return <Zap className="w-5 h-5 text-green-500" />;
            case 'condition':
                return <GitBranch className="w-5 h-5 text-amber-500" />;
            case 'action':
                return <Play className="w-5 h-5 text-purple-500" />;
            default:
                return <Settings className="w-5 h-5" />;
        }
    };

    const getNodeTypeName = () => {
        switch (selectedNode.type) {
            case 'agent':
                return '代理人節點';
            case 'trigger':
                return '觸發器節點';
            case 'condition':
                return '條件節點';
            case 'action':
                return '動作節點';
            default:
                return '節點';
        }
    };

    return (
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <div className="flex items-center gap-2">
                    {getNodeIcon()}
                    <h2 className="font-semibold text-slate-900">{getNodeTypeName()}</h2>
                </div>
                <p className="text-xs text-slate-500 mt-1">ID: {selectedNode.id}</p>
            </div>

            {/* Properties */}
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                {/* Common: Label */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        標籤名稱
                    </label>
                    <Input
                        value={(selectedNode.data as { label?: string })?.label || ''}
                        readOnly
                        className="bg-slate-50"
                    />
                </div>

                {/* Agent-specific */}
                {selectedNode.type === 'agent' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                代理人 ID
                            </label>
                            <Input
                                value={(selectedNode.data as { agentId?: string })?.agentId || ''}
                                readOnly
                                className="bg-slate-50"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                模型
                            </label>
                            <Input
                                value={(selectedNode.data as { model?: string })?.model || ''}
                                readOnly
                                className="bg-slate-50"
                            />
                        </div>
                    </>
                )}

                {/* Trigger-specific */}
                {selectedNode.type === 'trigger' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            觸發類型
                        </label>
                        <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
                            <option value="user_message">使用者發言</option>
                            <option value="timer">定時觸發</option>
                            <option value="event">事件觸發</option>
                        </select>
                    </div>
                )}

                {/* Condition-specific */}
                {selectedNode.type === 'condition' && (
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            條件表達式
                        </label>
                        <Textarea
                            value={(selectedNode.data as { condition?: string })?.condition || ''}
                            readOnly
                            className="bg-slate-50 font-mono text-sm"
                            rows={3}
                        />
                    </div>
                )}

                {/* Action-specific */}
                {selectedNode.type === 'action' && (
                    <>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                動作類型
                            </label>
                            <select className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50">
                                <option value="tool_call">呼叫工具</option>
                                <option value="send_message">發送訊息</option>
                                <option value="update_state">更新狀態</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                工具名稱
                            </label>
                            <Input
                                value={(selectedNode.data as { toolName?: string })?.toolName || ''}
                                readOnly
                                className="bg-slate-50"
                            />
                        </div>
                    </>
                )}

                {/* Position */}
                <div className="pt-4 border-t border-slate-200">
                    <label className="block text-sm font-medium text-slate-500 mb-2">
                        位置
                    </label>
                    <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
                        <div>X: {Math.round(selectedNode.position.x)}</div>
                        <div>Y: {Math.round(selectedNode.position.y)}</div>
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50">
                <p className="text-xs text-slate-500 text-center">
                    編輯功能需連接後端
                </p>
            </div>
        </div>
    );
}
