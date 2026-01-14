'use client';

import { useState } from 'react';
import {
    Building2,
    Users,
    User,
    ChevronRight,
    ChevronDown,
    Search,
    Plus,
    MoreHorizontal,
    Mail,
    Shield,
    Trash2,
    Edit,
    UserPlus,
    ArrowLeft,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Link from 'next/link';

// Mock Organization Data
const organizationData = {
    id: 'org-001',
    name: '台中教育大學',
    type: 'school',
    children: [
        {
            id: 'dept-001',
            name: '數學系',
            type: 'department',
            children: [
                {
                    id: 'class-001',
                    name: '111 級甲班',
                    type: 'class',
                    children: [
                        { id: 'user-001', name: '王小明', type: 'user', email: 'xiaoming@ntcu.edu.tw', role: 'student' },
                        { id: 'user-002', name: '李小華', type: 'user', email: 'xiaohua@ntcu.edu.tw', role: 'student' },
                        { id: 'user-003', name: '張美玲', type: 'user', email: 'meiling@ntcu.edu.tw', role: 'student' },
                    ],
                },
                {
                    id: 'class-002',
                    name: '111 級乙班',
                    type: 'class',
                    children: [
                        { id: 'user-004', name: '陳大文', type: 'user', email: 'dawen@ntcu.edu.tw', role: 'student' },
                        { id: 'user-005', name: '林小芳', type: 'user', email: 'xiaofang@ntcu.edu.tw', role: 'student' },
                    ],
                },
            ],
        },
        {
            id: 'dept-002',
            name: '資訊工程系',
            type: 'department',
            children: [
                {
                    id: 'class-003',
                    name: '112 級',
                    type: 'class',
                    children: [
                        { id: 'user-006', name: '吳俊傑', type: 'user', email: 'junjie@ntcu.edu.tw', role: 'student' },
                    ],
                },
            ],
        },
    ],
};

type OrgNode = {
    id: string;
    name: string;
    type: 'school' | 'department' | 'class' | 'user';
    email?: string;
    role?: string;
    children?: OrgNode[];
};

export default function OrganizationPage() {
    const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['org-001', 'dept-001']));
    const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());

    const toggleExpand = (nodeId: string) => {
        const newExpanded = new Set(expandedNodes);
        if (newExpanded.has(nodeId)) {
            newExpanded.delete(nodeId);
        } else {
            newExpanded.add(nodeId);
        }
        setExpandedNodes(newExpanded);
    };

    const toggleSelectUser = (userId: string) => {
        const newSelected = new Set(selectedUsers);
        if (newSelected.has(userId)) {
            newSelected.delete(userId);
        } else {
            newSelected.add(userId);
        }
        setSelectedUsers(newSelected);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin">
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">組織架構</h1>
                                <p className="text-slate-500 mt-1">管理學校、班級與使用者層級</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant="outline" className="gap-2">
                                <UserPlus className="w-4 h-4" />
                                新增使用者
                            </Button>
                            <Button className="gap-2">
                                <Plus className="w-4 h-4" />
                                新增組織
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left: Organization Tree */}
                    <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold text-slate-900">組織樹狀圖</h2>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <Input
                                    placeholder="搜尋..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-9 w-48"
                                />
                            </div>
                        </div>

                        {/* Batch Operations Bar */}
                        {selectedUsers.size > 0 && (
                            <div className="flex items-center justify-between px-4 py-3 mb-4 bg-blue-50 border border-blue-200 rounded-lg">
                                <span className="text-sm text-blue-700">
                                    已選擇 {selectedUsers.size} 位使用者
                                </span>
                                <div className="flex items-center gap-2">
                                    <Button variant="ghost" size="sm" className="text-blue-700">
                                        <Mail className="w-4 h-4 mr-1" />
                                        發送郵件
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-blue-700">
                                        <Shield className="w-4 h-4 mr-1" />
                                        變更權限
                                    </Button>
                                    <Button variant="ghost" size="sm" className="text-red-600">
                                        <Trash2 className="w-4 h-4 mr-1" />
                                        刪除
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Tree View */}
                        <div className="space-y-1">
                            <TreeNode
                                node={organizationData as OrgNode}
                                depth={0}
                                expandedNodes={expandedNodes}
                                selectedUsers={selectedUsers}
                                onToggleExpand={toggleExpand}
                                onSelect={setSelectedNode}
                                onToggleSelectUser={toggleSelectUser}
                            />
                        </div>
                    </div>

                    {/* Right: Detail Panel */}
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 mb-4">詳細資訊</h2>

                        {selectedNode ? (
                            <div className="space-y-6">
                                {/* Avatar/Icon */}
                                <div className="flex items-center gap-4">
                                    {selectedNode.type === 'user' ? (
                                        <Avatar className="w-16 h-16">
                                            <AvatarFallback className="bg-blue-100 text-blue-600 text-xl">
                                                {selectedNode.name.charAt(0)}
                                            </AvatarFallback>
                                        </Avatar>
                                    ) : (
                                        <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center">
                                            {selectedNode.type === 'school' && <Building2 className="w-8 h-8 text-slate-600" />}
                                            {selectedNode.type === 'department' && <Users className="w-8 h-8 text-slate-600" />}
                                            {selectedNode.type === 'class' && <Users className="w-8 h-8 text-slate-600" />}
                                        </div>
                                    )}
                                    <div>
                                        <h3 className="text-xl font-semibold text-slate-900">{selectedNode.name}</h3>
                                        <Badge variant="secondary" className="mt-1">
                                            {selectedNode.type === 'school' && '學校'}
                                            {selectedNode.type === 'department' && '科系'}
                                            {selectedNode.type === 'class' && '班級'}
                                            {selectedNode.type === 'user' && (selectedNode.role === 'student' ? '學生' : '教師')}
                                        </Badge>
                                    </div>
                                </div>

                                {/* User Details */}
                                {selectedNode.type === 'user' && (
                                    <div className="space-y-3">
                                        <div>
                                            <span className="text-sm text-slate-500">Email</span>
                                            <p className="text-slate-900">{selectedNode.email}</p>
                                        </div>
                                        <div>
                                            <span className="text-sm text-slate-500">角色</span>
                                            <p className="text-slate-900">
                                                {selectedNode.role === 'student' ? '學生' : selectedNode.role === 'teacher' ? '教師' : '管理員'}
                                            </p>
                                        </div>
                                    </div>
                                )}

                                {selectedNode.children && (
                                    <div>
                                        <span className="text-sm text-slate-500">成員數量</span>
                                        <p className="text-slate-900">{countMembers(selectedNode)} 人</p>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="pt-4 border-t border-slate-100 space-y-2">
                                    <Button variant="outline" className="w-full justify-start gap-2">
                                        <Edit className="w-4 h-4" />
                                        編輯資訊
                                    </Button>
                                    {selectedNode.type === 'user' && (
                                        <Button variant="outline" className="w-full justify-start gap-2">
                                            <Mail className="w-4 h-4" />
                                            發送郵件
                                        </Button>
                                    )}
                                    <Button variant="outline" className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
                                        <Trash2 className="w-4 h-4" />
                                        刪除
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-12 text-slate-400">
                                點選左側項目查看詳細資訊
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}

// Tree Node Component
function TreeNode({
    node,
    depth,
    expandedNodes,
    selectedUsers,
    onToggleExpand,
    onSelect,
    onToggleSelectUser,
}: {
    node: OrgNode;
    depth: number;
    expandedNodes: Set<string>;
    selectedUsers: Set<string>;
    onToggleExpand: (id: string) => void;
    onSelect: (node: OrgNode) => void;
    onToggleSelectUser: (id: string) => void;
}) {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;

    const getIcon = () => {
        switch (node.type) {
            case 'school':
                return <Building2 className="w-4 h-4 text-blue-600" />;
            case 'department':
                return <Users className="w-4 h-4 text-purple-600" />;
            case 'class':
                return <Users className="w-4 h-4 text-green-600" />;
            case 'user':
                return <User className="w-4 h-4 text-slate-600" />;
        }
    };

    return (
        <div>
            <div
                className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-slate-100 cursor-pointer group"
                style={{ paddingLeft: `${depth * 20 + 8}px` }}
                onClick={() => onSelect(node)}
            >
                {hasChildren ? (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onToggleExpand(node.id);
                        }}
                        className="p-0.5 hover:bg-slate-200 rounded"
                    >
                        {isExpanded ? (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                        ) : (
                            <ChevronRight className="w-4 h-4 text-slate-400" />
                        )}
                    </button>
                ) : (
                    <div className="w-5" />
                )}

                {node.type === 'user' && (
                    <input
                        type="checkbox"
                        checked={selectedUsers.has(node.id)}
                        onChange={(e) => {
                            e.stopPropagation();
                            onToggleSelectUser(node.id);
                        }}
                        className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                )}

                {getIcon()}

                <span className="text-sm text-slate-700 group-hover:text-slate-900">{node.name}</span>

                <button
                    onClick={(e) => e.stopPropagation()}
                    className="ml-auto opacity-0 group-hover:opacity-100 p-1 hover:bg-slate-200 rounded transition-opacity"
                >
                    <MoreHorizontal className="w-4 h-4 text-slate-400" />
                </button>
            </div>

            {hasChildren && isExpanded && (
                <div>
                    {node.children!.map((child) => (
                        <TreeNode
                            key={child.id}
                            node={child}
                            depth={depth + 1}
                            expandedNodes={expandedNodes}
                            selectedUsers={selectedUsers}
                            onToggleExpand={onToggleExpand}
                            onSelect={onSelect}
                            onToggleSelectUser={onToggleSelectUser}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

function countMembers(node: OrgNode): number {
    if (node.type === 'user') return 1;
    if (!node.children) return 0;
    return node.children.reduce((sum, child) => sum + countMembers(child), 0);
}
