import Link from 'next/link';
import { Bot, Workflow, BarChart3, MessageSquare, Wrench, Database, Shield } from 'lucide-react';

const pages = [
  {
    href: '/classroom/demo',
    icon: MessageSquare,
    title: '虛擬課堂',
    description: '多代理人對話教室',
    color: 'bg-blue-500',
  },
  {
    href: '/agents',
    icon: Bot,
    title: 'AI 代理人',
    description: '設定與管理 AI 角色',
    color: 'bg-green-500',
  },
  {
    href: '/builder',
    icon: Workflow,
    title: 'Workflow 編輯器',
    description: '視覺化情境設定',
    color: 'bg-purple-500',
  },
  {
    href: '/dashboard',
    icon: BarChart3,
    title: '學習儀表板',
    description: '數據分析與報告',
    color: 'bg-amber-500',
  },
  {
    href: '/tools',
    icon: Wrench,
    title: 'MCP 工具',
    description: '外部工具管理',
    color: 'bg-pink-500',
  },
  {
    href: '/knowledge',
    icon: Database,
    title: 'RAG 知識庫',
    description: '向量資料庫管理',
    color: 'bg-cyan-500',
  },
  {
    href: '/admin',
    icon: Shield,
    title: '系統管理',
    description: '權限與系統監控',
    color: 'bg-slate-600',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            TeamTutor
          </h1>
          <p className="text-xl text-blue-200">
            智慧虛擬課堂 · Multi-Agent × RAG
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pages.map((page) => {
            const Icon = page.icon;
            return (
              <Link key={page.href} href={page.href}>
                <div className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 hover:border-white/40 transition-all cursor-pointer">
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

        {/* Footer */}
        <p className="text-center text-blue-300/50 mt-12 text-sm">
          © 2026 TeamTutor · 前端展示版本 (Mock Data)
        </p>
      </div>
    </div>
  );
}
