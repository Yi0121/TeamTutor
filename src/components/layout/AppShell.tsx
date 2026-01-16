'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { useUIStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    LayoutDashboard,
    MessageSquare,
    Bot,
    Database,
    Wrench,
    FileText,
    History,
    Settings,
    Menu,
    LogOut,
    ChevronLeft,
    GraduationCap,
    Users,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Navigation Items
const NAV_ITEMS = [
    { label: '儀表板', href: '/dashboard', icon: LayoutDashboard },
    { label: '虛擬課堂', href: '/classroom', icon: GraduationCap },
    { label: 'AI 代理人', href: '/agents', icon: Bot },
    { label: '知識庫', href: '/knowledge', icon: Database },
    { label: '工具箱', href: '/tools', icon: Wrench },
    { label: '情境模板', href: '/templates', icon: FileText },
    { label: '學習歷程', href: '/history', icon: History },
];

const ADMIN_ITEMS = [
    { label: '系統管理', href: '/admin', icon: Settings },
    { label: '使用者管理', href: '/admin/users', icon: Users },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user, logout, canAccess } = useAuth();
    const { sidebarOpen, toggleSidebar, setSidebarOpen } = useUIStore();
    const [isMobile, setIsMobile] = useState(false);

    // Handle protected routes / hiding shell
    // Hide shell on:
    // - Root landing page ('/') ??? Maybe yes, maybe no. Usually landing page is different.
    // - Classroom session page ('/classroom/[id]') -> Needs full screen
    // - History replay ('/history/[id]') -> Needs full screen or specific layout
    const isFullScreenPage =
        pathname === '/' ||
        pathname.match(/^\/classroom\/[^/]+$/) ||
        pathname.match(/^\/history\/[^/]+$/);

    // Responsive check
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
            if (window.innerWidth < 1024) {
                setSidebarOpen(false);
            } else {
                setSidebarOpen(true);
            }
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, [setSidebarOpen]);

    if (isFullScreenPage) {
        return <>{children}</>;
    }

    return (
        <div className="flex h-screen bg-slate-50 overflow-hidden">
            {/* Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-white border-r border-slate-200 transition-all duration-300 flex flex-col",
                    sidebarOpen ? "w-64" : "w-[70px]",
                    isMobile && !sidebarOpen && "-translate-x-full"
                )}
            >
                {/* Sidebar Header */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100">
                    <Link href="/" className="flex items-center gap-2 overflow-hidden">
                        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                            <GraduationCap className="text-white w-5 h-5" />
                        </div>
                        <span className={cn(
                            "font-bold text-xl text-slate-900 transition-opacity duration-300 whitespace-nowrap",
                            !sidebarOpen && "opacity-0 w-0"
                        )}>
                            TeamTutor
                        </span>
                    </Link>
                    {!isMobile && (
                        <Button variant="ghost" size="icon" onClick={toggleSidebar} className="shrink-0">
                            <ChevronLeft className={cn("w-5 h-5 transition-transform", !sidebarOpen && "rotate-180")} />
                        </Button>
                    )}
                </div>

                {/* Navigation */}
                <ScrollArea className="flex-1 py-4">
                    <nav className="space-y-1 px-2">
                        {NAV_ITEMS.filter(item => canAccess(item.href)).map((item) => (
                            <NavItem
                                key={item.href}
                                item={item}
                                isActive={pathname.startsWith(item.href)}
                                isCollapsed={!sidebarOpen}
                            />
                        ))}

                        {(user?.role === 'super_admin' || user?.role === 'school_admin') && (
                            <>
                                <div className="my-4 border-t border-slate-100 mx-2" />
                                {ADMIN_ITEMS.filter(item => canAccess(item.href)).map((item) => (
                                    <NavItem
                                        key={item.href}
                                        item={item}
                                        isActive={pathname.startsWith(item.href)}
                                        isCollapsed={!sidebarOpen}
                                    />
                                ))}
                            </>
                        )}
                    </nav>
                </ScrollArea>

                {/* User Footer */}
                <div className="p-4 border-t border-slate-100">
                    <div className={cn("flex items-center gap-3", !sidebarOpen && "justify-center")}>
                        <Avatar className="w-9 h-9 border border-slate-200">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback>{user?.name?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className={cn("flex-1 overflow-hidden transition-all", !sidebarOpen && "w-0 hidden")}>
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 truncate">{user?.role}</p>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn("text-slate-400 hover:text-red-600", !sidebarOpen && "hidden")}
                            onClick={() => logout()}
                            title="登出"
                        >
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className={cn(
                "flex-1 flex flex-col transition-all duration-300 h-screen overflow-hidden",
                sidebarOpen ? "ml-64" : "ml-[70px]",
                isMobile && "ml-0"
            )}>
                {/* Mobile Header */}
                {isMobile && (
                    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-4 shrink-0">
                        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
                            <Menu className="w-6 h-6" />
                        </Button>
                        <span className="ml-4 font-bold text-lg">TeamTutor</span>
                    </header>
                )}

                {/* Page Content */}
                <main className="flex-1 overflow-auto bg-slate-50">
                    {children}
                </main>
            </div>

            {/* Mobile Overlay */}
            {isMobile && sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setSidebarOpen(false)}
                />
            )}
        </div>
    );
}

function NavItem({ item, isActive, isCollapsed }: { item: any; isActive: boolean; isCollapsed: boolean }) {
    const Icon = item.icon;
    return (
        <Link href={item.href}>
            <div className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group relative",
                isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                isCollapsed && "justify-center"
            )}>
                <Icon className={cn("w-5 h-5 shrink-0", isActive && "text-blue-600")} />
                {!isCollapsed && (
                    <span className="text-sm font-medium">{item.label}</span>
                )}
                {isCollapsed && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                        {item.label}
                    </div>
                )}
            </div>
        </Link>
    );
}
