'use client';

import { Loader2, MessageSquare, Bot, Wrench, Clock } from 'lucide-react';

export type ConversationState =
    | 'WAITING_USER'
    | 'AGENT_THINKING'
    | 'AGENT_RESPONDING'
    | 'TOOL_EXECUTING';

interface ConversationStatusBarProps {
    state: ConversationState;
    agentName?: string;
    toolName?: string;
}

const stateConfig: Record<
    ConversationState,
    {
        icon: React.ComponentType<{ className?: string }>;
        label: string;
        bgColor: string;
        textColor: string;
        animate?: boolean;
    }
> = {
    WAITING_USER: {
        icon: MessageSquare,
        label: '等待您的輸入...',
        bgColor: 'bg-blue-50',
        textColor: 'text-blue-600',
    },
    AGENT_THINKING: {
        icon: Bot,
        label: '正在思考中...',
        bgColor: 'bg-amber-50',
        textColor: 'text-amber-600',
        animate: true,
    },
    AGENT_RESPONDING: {
        icon: Bot,
        label: '正在回覆中...',
        bgColor: 'bg-green-50',
        textColor: 'text-green-600',
        animate: true,
    },
    TOOL_EXECUTING: {
        icon: Wrench,
        label: '執行工具中...',
        bgColor: 'bg-purple-50',
        textColor: 'text-purple-600',
        animate: true,
    },
};

export function ConversationStatusBar({
    state,
    agentName,
    toolName,
}: ConversationStatusBarProps) {
    const config = stateConfig[state];
    const Icon = config.icon;

    const getDisplayLabel = () => {
        if (state === 'AGENT_THINKING' && agentName) {
            return `${agentName} 正在思考中...`;
        }
        if (state === 'AGENT_RESPONDING' && agentName) {
            return `${agentName} 正在回覆中...`;
        }
        if (state === 'TOOL_EXECUTING' && toolName) {
            return `正在執行 ${toolName}...`;
        }
        return config.label;
    };

    return (
        <div
            className={`flex items-center gap-2 px-4 py-2 ${config.bgColor} border-b border-slate-200`}
        >
            {config.animate ? (
                <Loader2 className={`w-4 h-4 ${config.textColor} animate-spin`} />
            ) : (
                <Icon className={`w-4 h-4 ${config.textColor}`} />
            )}
            <span className={`text-sm font-medium ${config.textColor}`}>
                {getDisplayLabel()}
            </span>
            {state !== 'WAITING_USER' && (
                <div className="ml-auto flex items-center gap-1 text-slate-400">
                    <Clock className="w-3 h-3" />
                    <span className="text-xs">處理中</span>
                </div>
            )}
        </div>
    );
}

export default ConversationStatusBar;
