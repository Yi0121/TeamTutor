'use client';

import { Target, BarChart3 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { LearningGoal, SessionStats } from '@/types';

interface ContextPanelProps {
    learningGoals: LearningGoal[];
    stats: SessionStats;
}

export function ContextPanel({ learningGoals, stats }: ContextPanelProps) {
    const completedCount = learningGoals.filter((g) => g.completed).length;
    const progressPercent = Math.round((completedCount / learningGoals.length) * 100);

    return (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className="p-4 border-b border-slate-200">
                <h2 className="font-semibold text-slate-900">學習進度</h2>
            </div>

            <ScrollArea className="flex-1">
                <div className="p-4 space-y-6">
                    {/* Learning Goals Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <Target className="w-4 h-4 text-blue-600" />
                            <h3 className="text-sm font-medium text-slate-900">學習目標</h3>
                            <span className="text-xs text-slate-500 ml-auto">
                                {completedCount}/{learningGoals.length}
                            </span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 bg-slate-200 rounded-full mb-4 overflow-hidden">
                            <div
                                className="h-full bg-linear-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>

                        {/* Goals List */}
                        <div className="space-y-2">
                            {learningGoals.map((goal) => (
                                <label
                                    key={goal.id}
                                    className={`flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-colors ${goal.completed
                                        ? 'bg-green-50 hover:bg-green-100'
                                        : 'hover:bg-slate-50'
                                        }`}
                                >
                                    <Checkbox
                                        checked={goal.completed}
                                        className="mt-0.5 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                    />
                                    <span
                                        className={`text-sm leading-relaxed ${goal.completed ? 'text-green-700 line-through' : 'text-slate-700'
                                            }`}
                                    >
                                        {goal.text}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Session Stats Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <BarChart3 className="w-4 h-4 text-amber-600" />
                            <h3 className="text-sm font-medium text-slate-900">即時統計</h3>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <StatCard label="訊息數" value={stats.messageCount.toString()} />
                            <StatCard label="參與者" value={stats.participantCount.toString()} />
                            <StatCard label="持續時間" value={stats.duration} />
                            <StatCard label="Token 使用" value={stats.tokensUsed.toLocaleString()} />
                        </div>
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}

function StatCard({ label, value }: { label: string; value: string }) {
    return (
        <div className="p-3 bg-slate-50 rounded-lg">
            <div className="text-lg font-semibold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500">{label}</div>
        </div>
    );
}
