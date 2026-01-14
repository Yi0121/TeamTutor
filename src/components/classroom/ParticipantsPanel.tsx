'use client';

import { ChevronLeft, Circle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { Participant, ParticipantStatus } from '@/types';

interface ParticipantsPanelProps {
    participants: Participant[];
    onCollapse: () => void;
}

const statusColors: Record<ParticipantStatus, string> = {
    active: 'text-green-500',
    thinking: 'text-amber-500 animate-pulse',
    idle: 'text-slate-300',
};

const roleLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'outline' }> = {
    teacher: { label: '老師', variant: 'default' },
    student: { label: '學生', variant: 'secondary' },
    assistant: { label: '助理', variant: 'outline' },
    user: { label: '用戶', variant: 'secondary' },
};

export function ParticipantsPanel({ participants, onCollapse }: ParticipantsPanelProps) {
    const aiParticipants = participants.filter((p) => p.isAI);
    const humanParticipants = participants.filter((p) => !p.isAI);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">參與者</h2>
                <button
                    onClick={onCollapse}
                    className="p-1 rounded hover:bg-slate-100 text-slate-500"
                    title="收合側邊欄"
                >
                    <ChevronLeft className="w-5 h-5" />
                </button>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* AI Agents Section */}
                    {aiParticipants.length > 0 && (
                        <div>
                            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                                AI 代理人
                            </h3>
                            <div className="space-y-2">
                                {aiParticipants.map((participant) => (
                                    <ParticipantItem key={participant.id} participant={participant} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Human Participants Section */}
                    {humanParticipants.length > 0 && (
                        <div>
                            <h3 className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-3">
                                學生
                            </h3>
                            <div className="space-y-2">
                                {humanParticipants.map((participant) => (
                                    <ParticipantItem key={participant.id} participant={participant} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </ScrollArea>
        </div>
    );
}

function ParticipantItem({ participant }: { participant: Participant }) {
    const roleConfig = roleLabels[participant.role] || roleLabels.user;

    return (
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors">
            {/* Avatar with status indicator */}
            <div className="relative">
                <Avatar className="w-10 h-10">
                    <AvatarImage src={participant.avatar} alt={participant.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-700">
                        {participant.name.charAt(0)}
                    </AvatarFallback>
                </Avatar>
                <Circle
                    className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 fill-current ${statusColors[participant.status]}`}
                />
            </div>

            {/* Name and Role */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-900 truncate">{participant.name}</span>
                    {participant.isAI && (
                        <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 bg-blue-50 text-blue-600 border-blue-200">
                            AI
                        </Badge>
                    )}
                </div>
                <Badge variant={roleConfig.variant} className="text-[10px] px-1.5 py-0 h-4 mt-1">
                    {roleConfig.label}
                </Badge>
            </div>
        </div>
    );
}
