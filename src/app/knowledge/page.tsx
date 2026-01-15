'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
    Database,
    Upload,
    Search,
    FileText,
    CheckCircle,
    Clock,
    Trash2,
    Plus,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import mockData from '../../../mock_data.json';
import type { KnowledgeBase } from '@/types';

const knowledgeBases = mockData.knowledgeBases as KnowledgeBase[];

export default function KnowledgePage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<string[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        setIsSearching(true);
        // Simulate search
        setTimeout(() => {
            setSearchResults([
                '一元一次方程式是指未知數的最高次方為一次的方程式，形如 ax + b = 0',
                '解一元一次方程式的步驟：移項、合併同類項、係數化為1',
                '方程式的解就是使等式成立的未知數的值',
            ]);
            setIsSearching(false);
        }, 800);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                                <Database className="w-6 h-6 text-blue-600" />
                                RAG 知識庫管理
                            </h1>
                            <p className="text-slate-500 mt-1">管理向量資料庫與檢索增強生成知識</p>
                        </div>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            新增知識庫
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
                {/* Knowledge Base Cards */}
                <section>
                    <h2 className="text-lg font-semibold text-slate-900 mb-4">知識庫列表</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {knowledgeBases.map((kb) => (
                            <KnowledgeBaseCard key={kb.id} kb={kb} />
                        ))}
                    </div>
                </section>

                {/* Upload Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Upload className="w-5 h-5 text-green-600" />
                        文件上傳
                    </h2>

                    <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center hover:border-blue-400 hover:bg-blue-50/50 transition-colors cursor-pointer">
                        <Upload className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <p className="text-slate-600 font-medium">拖曳文件至此處或點擊上傳</p>
                        <p className="text-slate-400 text-sm mt-1">
                            支援 PDF, DOCX, TXT, HTML 格式
                        </p>
                        <Button variant="outline" className="mt-4">
                            選擇文件
                        </Button>
                    </div>

                    {/* Processing Queue (Mock) */}
                    <div className="mt-6">
                        <h3 className="text-sm font-medium text-slate-700 mb-3">處理佇列</h3>
                        <div className="space-y-2">
                            <ProcessingItem
                                name="高中數學公式總整理.pdf"
                                status="processing"
                                progress={65}
                            />
                            <ProcessingItem
                                name="函數概念講義.docx"
                                status="completed"
                                progress={100}
                            />
                        </div>
                    </div>
                </section>

                {/* Search Test Section */}
                <section className="bg-white rounded-xl border border-slate-200 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <Search className="w-5 h-5 text-purple-600" />
                        檢索測試
                    </h2>

                    <div className="flex gap-2 mb-4">
                        <Textarea
                            placeholder="輸入測試查詢，例如：什麼是一元一次方程式？"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            rows={2}
                            className="flex-1"
                        />
                        <Button onClick={handleSearch} disabled={isSearching}>
                            {isSearching ? '搜尋中...' : '搜尋'}
                        </Button>
                    </div>

                    {searchResults.length > 0 && (
                        <div className="space-y-3">
                            <h3 className="text-sm font-medium text-slate-700">檢索結果</h3>
                            {searchResults.map((result, index) => (
                                <div
                                    key={index}
                                    className="p-3 bg-slate-50 rounded-lg border border-slate-200"
                                >
                                    <div className="flex items-start gap-2">
                                        <Badge variant="outline" className="shrink-0">
                                            #{index + 1}
                                        </Badge>
                                        <p className="text-sm text-slate-700">{result}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}

function KnowledgeBaseCard({ kb }: { kb: KnowledgeBase }) {
    return (
        <Link href={`/knowledge/${kb.id}`}>
            <div className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-blue-400 transition-all cursor-pointer h-full">
                <div className="flex items-start justify-between mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                        <Database className="w-5 h-5 text-blue-600" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-slate-400 hover:text-red-500"
                        onClick={(e) => e.preventDefault()}
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>

                <h3 className="font-semibold text-slate-900 mb-1">{kb.name}</h3>
                <p className="text-sm text-slate-500 mb-4">{kb.description}</p>

                <div className="flex items-center gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <FileText className="w-4 h-4" />
                        <span>{kb.documentCount} 文件</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Database className="w-4 h-4" />
                        <span>{kb.chunkCount} chunks</span>
                    </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-400">
                    最後更新：{new Date(kb.lastUpdated).toLocaleDateString('zh-TW')}
                </div>
            </div>
        </Link>
    );
}

function ProcessingItem({
    name,
    status,
    progress,
}: {
    name: string;
    status: 'processing' | 'completed';
    progress: number;
}) {
    return (
        <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
            {status === 'completed' ? (
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
            ) : (
                <Clock className="w-5 h-5 text-amber-500 shrink-0 animate-pulse" />
            )}
            <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">{name}</p>
                {status === 'processing' && (
                    <div className="mt-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-blue-500 rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                )}
            </div>
            <span className="text-xs text-slate-500">
                {status === 'completed' ? '完成' : `${progress}%`}
            </span>
        </div>
    );
}
