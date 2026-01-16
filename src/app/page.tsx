'use client';

import Link from 'next/link';
import { Bot, Workflow, BarChart3, MessageSquare, Wrench, Database, Shield, Code, History, Layout, Lock } from 'lucide-react';
import { useAuth, type Permission } from '@/lib/auth';
import { RoleSwitcher } from '@/components/auth/RoleSwitcher';

interface PageItem {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  color: string;
  permission?: Permission;
}

const pages: PageItem[] = [
  {
    href: '/classroom',
    icon: MessageSquare,
    title: '虛擬課堂',
    description: '多代理人對話教室',
    color: 'bg-blue-500',
    permission: 'use_classroom',
  },
  {
    href: '/agents',
    icon: Bot,
    title: 'AI 代理人',
    description: '設定與管理 AI 角色',
    color: 'bg-green-500',
    permission: 'manage_agents',
  },
  {
    href: '/builder',
    icon: Workflow,
    title: 'Workflow 編輯器',
    description: '視覺化情境設定',
    color: 'bg-purple-500',
    permission: 'manage_agents',
  },
  {
    href: '/templates',
    icon: Layout,
    title: '情境模板',
    description: '預設與自訂模板',
    color: 'bg-violet-500',
    permission: 'manage_templates',
  },
  {
    href: '/dashboard',
    icon: BarChart3,
    title: '學習儀表板',
    description: '數據分析與報告',
    color: 'bg-amber-500',
    permission: 'view_dashboard',
  },
  {
    href: '/history',
    icon: History,
    title: '學習歷程',
    description: '歷程回放與標註',
    color: 'bg-orange-500',
    permission: 'view_history',
  },
  {
    href: '/tools',
    icon: Wrench,
    title: 'MCP 工具',
    description: '外部工具管理',
    color: 'bg-pink-500',
    permission: 'manage_tools',
  },
  {
    href: '/knowledge',
    icon: Database,
    title: 'RAG 知識庫',
    description: '向量資料庫管理',
    color: 'bg-cyan-500',
    permission: 'manage_knowledge',
  },
  {
    href: '/admin',
    icon: Shield,
    title: '系統管理',
    description: '權限與系統監控',
    color: 'bg-slate-600',
    permission: 'manage_system',
  },
  {
    href: '/embed',
    icon: Code,
    title: '嵌入設定',
    description: '外部網站整合',
    color: 'bg-indigo-500',
    permission: 'manage_system',
  },
];

export default function HomePage() {
  const { user, can } = useAuth();

  // Filter pages based on user permissions
  const accessiblePages = pages.filter(page => {
    if (!page.permission) return true;
    return can(page.permission);
  });

  // Pages user cannot access
  const restrictedPages = pages.filter(page => {
    if (!page.permission) return false;
    return !can(page.permission);
  });

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header with Role Switcher */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              TeamTutor
            </h1>
            <p className="text-xl text-blue-200">
              智慧虛擬課堂 · Multi-Agent × RAG
            </p>
          </div>
          <div className="flex items-center gap-3">
            {user && (
              <div className="text-right text-sm mr-2">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-blue-300/70">{user.email}</p>
              </div>
            )}
            <RoleSwitcher />
          </div>
        </div>

        {/* Accessible Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accessiblePages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href}>
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer h-full">
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${page.color} text-white`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-white group-hover:text-blue-200 transition-colors">
                        {page.title}
                      </h2>
                      <p className="text-blue-200/70">{page.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Restricted Pages (shown as disabled) */}
        {restrictedPages.length > 0 && (
          <div className="mt-8">
            <h3 className="text-sm text-blue-300/50 mb-4 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              權限不足 - 以下功能需要更高權限
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {restrictedPages.map((page) => {
                const Icon = page.icon;
                return (
                  <div
                    key={page.href}
                    className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-4 opacity-50 cursor-not-allowed"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-slate-700/50 text-slate-400">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-slate-400">{page.title}</h3>
                        <p className="text-xs text-slate-500">{page.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Footer */}
        <p className="text-center text-blue-300/50 mt-12 text-sm">
          © 2026 TeamTutor · 前端展示版本 (Mock Data)
        </p>
      </div>
    </div>
  );
}

