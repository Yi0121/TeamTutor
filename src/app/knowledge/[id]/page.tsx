'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    ArrowLeft,
    FileText,
    Settings,
    Search,
    History,
    Upload,
    Trash2,
    RefreshCw,
    Download,
    RotateCcw,
    Clock,
    File,
    ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import mockData from '../../../../mock_data.json';
import type { KnowledgeBase } from '@/types';

const knowledgeBases = mockData.knowledgeBases as KnowledgeBase[];

// Mock files data
const mockFiles = [
    { id: 'f1', name: '數學基礎教材.pdf', size: '2.4 MB', chunks: 45, uploadedAt: '2026-01-10' },
    { id: 'f2', name: '函數概念講義.docx', size: '1.1 MB', chunks: 23, uploadedAt: '2026-01-12' },
    { id: 'f3', name: '習題集.md', size: '156 KB', chunks: 12, uploadedAt: '2026-01-13' },
];

// Mock version history
const mockVersions = [
    { id: 'v3', version: '1.2', date: '2026-01-13', changes: '新增習題集文件', author: '李老師' },
    { id: 'v2', version: '1.1', date: '2026-01-12', changes: '更新 Chunk 參數設定', author: '系統' },
    { id: 'v1', version: '1.0', date: '2026-01-10', changes: '初始版本', author: '李老師' },
];

export default function KnowledgeBaseDetailPage() {
    const params = useParams();
    const router = useRouter();
    const kbId = params.id as string;

    const kb = knowledgeBases.find((k) => k.id === kbId);
    const [activeTab, setActiveTab] = useState<'files' | 'settings' | 'test' | 'history'>('files');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<{ text: string; score: number }[]>([]);

    if (!kb) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">找不到此知識庫</p>
            </div>
        );
    }

    const handleSearch = () => {
        // Mock search results
        setSearchResults([
            { text: '一元一次方程式是指包含一個未知數的一次方程式...', score: 0.92 },
            { text: '解方程式的基本原則是等量加減與等量乘除...', score: 0.85 },
            { text: '函數是一種特殊的對應關係，每個輸入對應唯一輸出...', score: 0.78 },
        ]);
    };

    const tabs = [
        { id: 'files', label: '文件管理', icon: FileText },
        { id: 'settings', label: '設定', icon: Settings },
        { id: 'test', label: '檢索測試', icon: Search },
        { id: 'history', label: '版本紀錄', icon: History },
    ] as const;

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Button variant="ghost" size="icon" onClick={() => router.push('/knowledge')}>
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">{kb.name}</h1>
                                <p className="text-sm text-slate-500">{kb.description}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">{kb.documentCount} 文件</Badge>
                            <Badge variant="outline">{kb.chunkCount} Chunks</Badge>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="flex items-center gap-6 mt-6">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 pb-3 border-b-2 transition-colors ${activeTab === tab.id
                                            ? 'border-blue-500 text-blue-600'
                                            : 'border-transparent text-slate-500 hover:text-slate-700'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8">
                {/* Files Tab */}
                {activeTab === 'files' && (
                    <div className="space-y-6">
                        {/* Upload Area */}
                        <Card>
                            <CardContent className="p-6">
                                <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                                    <Upload className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                                    <p className="text-slate-600 font-medium">拖曳檔案至此處上傳</p>
                                    <p className="text-sm text-slate-400 mt-1">支援 PDF, DOCX, MD, TXT</p>
                                    <Button variant="outline" className="mt-4">
                                        或點擊選擇檔案
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* File List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>已上傳文件</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {mockFiles.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <File className="w-8 h-8 text-blue-500" />
                                                <div>
                                                    <p className="font-medium text-slate-900">{file.name}</p>
                                                    <p className="text-xs text-slate-500">
                                                        {file.size} · {file.chunks} chunks · 上傳於 {file.uploadedAt}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Button variant="ghost" size="icon" title="重新處理">
                                                    <RefreshCw className="w-4 h-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" title="刪除" className="text-red-500 hover:text-red-600">
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>基本設定</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">名稱</label>
                                    <Input defaultValue={kb.name} className="mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">描述</label>
                                    <Textarea defaultValue={kb.description} className="mt-1" rows={3} />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Chunk 參數</CardTitle>
                                <CardDescription>控制文件切割方式</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Chunk Size</label>
                                    <Input type="number" defaultValue={512} className="mt-1" />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">Chunk Overlap</label>
                                    <Input type="number" defaultValue={50} className="mt-1" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Embedding 模型</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <select className="w-full p-2 border rounded-lg">
                                    <option>text-embedding-3-small</option>
                                    <option>text-embedding-3-large</option>
                                    <option>text-embedding-ada-002</option>
                                </select>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>存取控制</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    {['所有人', '僅教師', '僅管理員'].map((opt) => (
                                        <label key={opt} className="flex items-center gap-2">
                                            <input type="radio" name="access" defaultChecked={opt === '所有人'} />
                                            <span>{opt}</span>
                                        </label>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}

                {/* Retrieval Test Tab */}
                {activeTab === 'test' && (
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>檢索測試</CardTitle>
                                <CardDescription>輸入查詢以測試知識庫檢索效果</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="輸入查詢問題..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="flex-1"
                                    />
                                    <Button onClick={handleSearch}>
                                        <Search className="w-4 h-4 mr-2" />
                                        搜尋
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {searchResults.length > 0 && (
                            <Card>
                                <CardHeader>
                                    <CardTitle>檢索結果</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-3">
                                        {searchResults.map((result, i) => (
                                            <div key={i} className="p-4 border rounded-lg">
                                                <div className="flex items-center justify-between mb-2">
                                                    <Badge variant="outline">Chunk #{i + 1}</Badge>
                                                    <span className="text-sm font-mono text-blue-600">
                                                        相似度: {(result.score * 100).toFixed(1)}%
                                                    </span>
                                                </div>
                                                <p className="text-slate-700">{result.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>
                )}

                {/* Version History Tab */}
                {activeTab === 'history' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>版本紀錄</CardTitle>
                            <CardDescription>知識庫的變更歷史</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="relative">
                                {/* Timeline line */}
                                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />

                                <div className="space-y-6">
                                    {mockVersions.map((v, i) => (
                                        <div key={v.id} className="relative flex gap-4 pl-10">
                                            {/* Timeline dot */}
                                            <div
                                                className={`absolute left-2.5 w-3 h-3 rounded-full border-2 ${i === 0 ? 'bg-blue-500 border-blue-500' : 'bg-white border-slate-300'
                                                    }`}
                                            />

                                            <div className="flex-1 p-4 border rounded-lg hover:bg-slate-50">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-2">
                                                        <Badge>{v.version}</Badge>
                                                        <span className="text-sm text-slate-500">{v.date}</span>
                                                    </div>
                                                    {i !== 0 && (
                                                        <Button variant="outline" size="sm">
                                                            <RotateCcw className="w-3 h-3 mr-1" />
                                                            還原
                                                        </Button>
                                                    )}
                                                </div>
                                                <p className="mt-2 text-slate-700">{v.changes}</p>
                                                <p className="mt-1 text-xs text-slate-400">by {v.author}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </main>
        </div>
    );
}
