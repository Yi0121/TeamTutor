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
    const [rightSidebarOpen, setRightSidebarOpen] = useState(true);

    return (
        <div className="flex h-screen bg-slate-50 relative">
            {/* Left Sidebar - Participants Panel */}
            <aside
                className={`${leftSidebarOpen ? 'w-[280px]' : 'w-0'
                    } transition-all duration-300 overflow-hidden border-r border-slate-200 bg-white mr-2`}
            >
                <div className="h-full w-[280px]">
                    <ParticipantsPanel
                        participants={session.participants}
                        onCollapse={() => setLeftSidebarOpen(false)}
                    />
                </div>
            </aside>

            {/* Toggle button for left sidebar */}
            {!leftSidebarOpen && (
                <button
                    onClick={() => setLeftSidebarOpen(true)}
                    className="absolute left-2 top-4 z-10 p-2 bg-white rounded-md shadow-md hover:bg-slate-100 border border-slate-200"
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
            <main className="flex-1 flex flex-col overflow-hidden relative">
                {children}
            </main>

            {/* Toggle button for right sidebar - visible when closed */}
            {!rightSidebarOpen && (
                <button
                    onClick={() => setRightSidebarOpen(true)}
                    className="absolute right-2 top-4 z-10 p-2 bg-white rounded-md shadow-md hover:bg-slate-100 border border-slate-200"
                    title="展開學習進度"
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
                        <path d="m15 18-6-6 6-6" />
                    </svg>
                </button>
            )}

            {/* Right Sidebar - Context Panel */}
            <aside
                className={`${rightSidebarOpen ? 'w-[300px]' : 'w-0'
                    } transition-all duration-300 overflow-hidden border-l border-slate-200 bg-white`}
            >
                <div className="h-full w-[300px] relative">
                    {/* Collapse Button inside panel */}
                    <button
                        onClick={() => setRightSidebarOpen(false)}
                        className="absolute right-4 top-4 z-10 p-1 rounded hover:bg-slate-100 text-slate-500"
                        title="收合側邊欄"
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

                    <div className="h-full overflow-y-auto no-scrollbar pt-12">
                        <ContextPanel
                            learningGoals={session.learningGoals}
                            stats={session.stats}
                        />
                    </div>
                </div>
            </aside>
        </div>
    );
}
