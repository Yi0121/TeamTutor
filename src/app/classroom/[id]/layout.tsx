'use client';

import { useState } from 'react';
import { ParticipantsPanel } from '@/components/classroom/ParticipantsPanel';
import { ContextPanel } from '@/components/classroom/ContextPanel';
import mockData from '../../../../mock_data.json';
import type { Session } from '@/types';

const session = mockData.session as Session;

export default function ClassroomLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-50">
            {/* Left Sidebar - Participants Panel */}
            <aside
                className={`${leftSidebarOpen ? 'w-[280px]' : 'w-0'
                    } transition-all duration-300 overflow-hidden border-r border-slate-200 bg-white`}
            >
                <ParticipantsPanel
                    participants={session.participants}
                    onCollapse={() => setLeftSidebarOpen(false)}
                />
            </aside>

            {/* Toggle button for collapsed sidebar */}
            {!leftSidebarOpen && (
                <button
                    onClick={() => setLeftSidebarOpen(true)}
                    className="absolute left-2 top-4 z-10 p-2 bg-white rounded-md shadow-md hover:bg-slate-100"
                    title="展開參與者面板"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m9 18 6-6-6-6" />
                    </svg>
                </button>
            )}

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col overflow-hidden">
                {children}
            </main>

            {/* Right Sidebar - Context Panel */}
            <aside className="w-[300px] border-l border-slate-200 bg-white overflow-y-auto">
                <ContextPanel
                    learningGoals={session.learningGoals}
                    stats={session.stats}
                />
            </aside>
        </div>
    );
}
