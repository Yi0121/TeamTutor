'use client';

import { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface BatchImportModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onImport?: (users: any[]) => void;
}

interface ParsedUser {
    name: string;
    email: string;
    role: 'student' | 'teacher';
    org: string;
    status: 'valid' | 'invalid';
    error?: string;
}

export function BatchImportModal({ open, onOpenChange, onImport }: BatchImportModalProps) {
    const [step, setStep] = useState<'upload' | 'preview' | 'importing' | 'complete'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [parsedData, setParsedData] = useState<ParsedUser[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
            // Simulate CSV parsing
            parseMockCSV(selectedFile);
        }
    };

    const parseMockCSV = async (file: File) => {
        // Mock parsing logic
        const mockUsers: ParsedUser[] = [
            { name: '張小美', email: 'may@ntcu.edu.tw', role: 'student', org: '數學系_112級', status: 'valid' },
            { name: '王大同', email: 'wang@ntcu.edu.tw', role: 'student', org: '數學系_112級', status: 'valid' },
            { name: '李教授', email: 'lee@ntcu.edu.tw', role: 'teacher', org: '數學系', status: 'valid' },
            { name: '陳無名', email: 'invalid_email', role: 'student', org: '資訊系', status: 'invalid', error: 'Email 格式錯誤' },
        ];

        setTimeout(() => {
            setParsedData(mockUsers);
            setStep('preview');
        }, 800);
    };

    const handleImport = async () => {
        setStep('importing');
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        if (onImport) {
            onImport(parsedData.filter(u => u.status === 'valid'));
        }
        setStep('complete');
    };

    const handleClose = () => {
        onOpenChange(false);
        // Reset state after transition
        setTimeout(() => {
            setStep('upload');
            setFile(null);
            setParsedData([]);
        }, 300);
    };

    const validCount = parsedData.filter(u => u.status === 'valid').length;
    const invalidCount = parsedData.filter(u => u.status === 'invalid').length;

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="max-w-3xl">
                <DialogHeader>
                    <DialogTitle>批次匯入使用者</DialogTitle>
                    <DialogDescription>
                        支援 CSV 格式匯入。請確保包含「姓名」、「Email」、「角色」與「所屬組織」欄位。
                    </DialogDescription>
                </DialogHeader>

                <div className="py-6 min-h-[300px]">
                    {step === 'upload' && (
                        <div
                            className="border-2 border-dashed border-slate-300 rounded-xl h-[300px] flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer"
                            onClick={() => fileInputRef.current?.click()}
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={handleFileSelect}
                            />
                            <div className="bg-blue-100 p-4 rounded-full mb-4">
                                <Upload className="w-8 h-8 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-700 mb-2">
                                點擊或拖曳檔案至此
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">
                                支援 .csv 檔案 (UTF-8 編碼)
                            </p>
                            <Button variant="outline" size="sm">
                                下載範例檔案
                            </Button>
                        </div>
                    )}

                    {step === 'preview' && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-sm">
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-green-600">
                                        <Check className="w-4 h-4" />
                                        <span>{validCount} 筆有效</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-red-600">
                                        <AlertCircle className="w-4 h-4" />
                                        <span>{invalidCount} 筆錯誤</span>
                                    </div>
                                </div>
                                <Button variant="ghost" size="sm" onClick={() => {
                                    setStep('upload');
                                    setFile(null);
                                }}>
                                    重新上傳
                                </Button>
                            </div>

                            <div className="border border-slate-200 rounded-lg overflow-hidden max-h-[250px] overflow-y-auto">
                                <table className="w-full text-sm text-left">
                                    <thead className="bg-slate-50 sticky top-0">
                                        <tr>
                                            <th className="px-4 py-2 font-medium text-slate-500">狀態</th>
                                            <th className="px-4 py-2 font-medium text-slate-500">姓名</th>
                                            <th className="px-4 py-2 font-medium text-slate-500">Email</th>
                                            <th className="px-4 py-2 font-medium text-slate-500">角色</th>
                                            <th className="px-4 py-2 font-medium text-slate-500">組織</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {parsedData.map((user, idx) => (
                                            <tr key={idx} className={user.status === 'invalid' ? 'bg-red-50' : ''}>
                                                <td className="px-4 py-2">
                                                    {user.status === 'valid' ? (
                                                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Pass</Badge>
                                                    ) : (
                                                        <Badge variant="outline" className="text-red-600 bg-red-50 border-red-200">{user.error || 'Error'}</Badge>
                                                    )}
                                                </td>
                                                <td className="px-4 py-2 text-slate-900">{user.name}</td>
                                                <td className="px-4 py-2 text-slate-600">{user.email}</td>
                                                <td className="px-4 py-2">
                                                    {user.role === 'student' ? '學生' : '教師'}
                                                </td>
                                                <td className="px-4 py-2 text-slate-600">{user.org}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {step === 'importing' && (
                        <div className="h-[300px] flex flex-col items-center justify-center">
                            <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
                            <h3 className="text-lg font-semibold text-slate-900">匯入中...</h3>
                            <p className="text-slate-500">正在建立使用者帳號與權限設定</p>
                        </div>
                    )}

                    {step === 'complete' && (
                        <div className="h-[300px] flex flex-col items-center justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <Check className="w-8 h-8 text-green-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-slate-900 mb-2">匯入完成</h3>
                            <p className="text-slate-500 mb-6">
                                成功匯入 {validCount} 筆使用者資料
                            </p>
                            <Button onClick={handleClose}>
                                關閉視窗
                            </Button>
                        </div>
                    )}
                </div>

                <DialogFooter>
                    {step === 'preview' && (
                        <>
                            <Button variant="outline" onClick={handleClose}>取消</Button>
                            <Button onClick={handleImport} disabled={validCount === 0}>
                                開始匯入 ({validCount} 筆)
                            </Button>
                        </>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
