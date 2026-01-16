'use client';

import { useState } from 'react';
import {
    Users,
    Search,
    MoreHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Card,
} from '@/components/ui/card';
import MockDataService from '@/lib/mock';

const users = MockDataService.getUsers();

export default function UsersPage() {
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(
        (u) =>
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-lg">
                            <Users className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">使用者管理</h1>
                            <p className="text-slate-500 text-sm">管理學校成員與權限</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="搜尋使用者..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-9 bg-white"
                            />
                        </div>
                        <Button className="bg-blue-600 hover:bg-blue-700">
                            <Users className="w-4 h-4 mr-2" />
                            新增使用者
                        </Button>
                    </div>

                    <Card>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-slate-50 border-b border-slate-200">
                                    <tr>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                            使用者
                                        </th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                            角色
                                        </th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                            狀態
                                        </th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                            Token 用量
                                        </th>
                                        <th className="text-left py-3 px-6 text-sm font-medium text-slate-500">
                                            最後登入
                                        </th>
                                        <th className="text-right py-3 px-6 text-sm font-medium text-slate-500">
                                            操作
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user) => (
                                        <tr
                                            key={user.id}
                                            className="border-b border-slate-100 last:border-0 hover:bg-slate-50/50"
                                        >
                                            <td className="py-3 px-6">
                                                <div>
                                                    <div className="font-medium text-slate-900">
                                                        {user.name}
                                                    </div>
                                                    <div className="text-xs text-slate-500">
                                                        {user.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="py-3 px-6">
                                                <Badge
                                                    variant="outline"
                                                    className={
                                                        user.role === 'admin'
                                                            ? 'bg-purple-50 text-purple-700 border-purple-200'
                                                            : user.role === 'teacher'
                                                                ? 'bg-blue-50 text-blue-700 border-blue-200'
                                                                : 'bg-slate-50 text-slate-700 border-slate-200'
                                                    }
                                                >
                                                    {user.role}
                                                </Badge>
                                            </td>
                                            <td className="py-3 px-6">
                                                <span
                                                    className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${user.status === 'active'
                                                        ? 'bg-green-100 text-green-700'
                                                        : 'bg-slate-100 text-slate-500'
                                                        }`}
                                                >
                                                    {user.status === 'active' ? '正常' : '停用'}
                                                </span>
                                            </td>
                                            <td className="py-3 px-6 text-slate-600 font-mono text-sm">
                                                {user.usage.tokens.toLocaleString()}
                                            </td>
                                            <td className="py-3 px-6 text-slate-500 text-sm">
                                                {new Date(user.lastLogin).toLocaleDateString('zh-TW')}
                                            </td>
                                            <td className="py-3 px-6 text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="text-slate-400 hover:text-slate-600"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </main>
        </div>
    );
}
