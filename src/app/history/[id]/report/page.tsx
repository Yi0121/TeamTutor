'use client';

import { useState, useRef } from 'react';
import {
    FileText,
    Save,
    ArrowLeft,
    CheckCircle2,
    HelpCircle,
    ChevronDown,
    ChevronUp,
    Download,
    Share2,
    MessageSquare,
    Loader2
} from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion';

// Mock AI Analysis Data
const MOCK_AI_REPORT = {
    overview: {
        score: 85,
        summary: "這堂課程中，您成功引導學生從生活實例（便利商店價格）理解未知數的概念。對話節奏掌握得宜，能適時讓學生發言。對於學習緩慢的學生（AI Peer B），您展現了耐心並使用鷹架策略。",
        strengths: [
            "善用生活化情境引起動機",
            "具備差異化教學意識，針對不同程度學生給予回應",
            "數學概念解釋清晰，並結合圖表輔助"
        ],
        improvements: [
            "可以增加更多「讓學生互評」的機會",
            "在解釋移項法則時，可以讓學生多做一個類題再推進"
        ]
    },
    metrics: {
        teacherTalkTime: "35%",
        studentTalkTime: "65%",
        questionCount: 12,
        feedbackCount: 8,
        scaffoldingCount: 5
    }
};

export default function ReflectionReportPage() {
    const params = useParams();
    const router = useRouter();
    const reportRef = useRef<HTMLDivElement>(null);
    const [activeTab, setActiveTab] = useState<'report' | 'reflection'>('reflection');
    const [reflectionData, setReflectionData] = useState({
        objective: '',
        summary: '',
        selfEvaluation: '',
        insight: '',
        nextStep: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [isExporting, setIsExporting] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setIsSaving(false);
        // Show success toast (mock)
        alert('省思日誌已儲存');
    };

    const handleExportPDF = async () => {
        setIsExporting(true);
        try {
            const html2canvas = (await import('html2canvas')).default;
            const jsPDF = (await import('jspdf')).default;

            if (!reportRef.current) {
                alert('無法找到報告區域');
                return;
            }

            // Capture the content
            const canvas = await html2canvas(reportRef.current, {
                scale: 2,
                useCORS: true,
                backgroundColor: '#ffffff',
            });

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = pageWidth - 20; // 10mm margin on each side
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            let heightLeft = imgHeight;
            let position = 10; // Top margin

            // Add first page
            pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            // Add additional pages if needed
            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            // Download the PDF
            pdf.save(`教學省思報告_${params.id}_${new Date().toISOString().split('T')[0]}.pdf`);
        } catch (error) {
            console.error('PDF 匯出失敗:', error);
            alert('PDF 匯出失敗，請稍後再試');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 pb-20">
            {/* Header */}
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href={`/history/${params.id}`}>
                                <Button variant="ghost" size="icon">
                                    <ArrowLeft className="w-5 h-5 text-slate-500" />
                                </Button>
                            </Link>
                            <div>
                                <h1 className="text-xl font-bold text-slate-900">教學省思與分析報告</h1>
                                <p className="text-xs text-slate-500">針對「函數與方程式基礎」的課後分析</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleExportPDF}
                                disabled={isExporting}
                            >
                                {isExporting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        匯出中...
                                    </>
                                ) : (
                                    <>
                                        <Download className="w-4 h-4 mr-2" />
                                        匯出 PDF
                                    </>
                                )}
                            </Button>
                            <Button onClick={handleSave} disabled={isSaving} size="sm">
                                {isSaving ? '儲存中...' : (
                                    <>
                                        <Save className="w-4 h-4 mr-2" />
                                        儲存日誌
                                    </>
                                )}
                            </Button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-5xl mx-auto px-6 py-8" ref={reportRef}>
                {/* Tabs */}
                <div className="flex space-x-1 rounded-xl bg-slate-200 p-1 mb-8 w-fit mx-auto">
                    <button
                        onClick={() => setActiveTab('reflection')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'reflection'
                            ? 'bg-white text-slate-900 shadow'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        📝 教學省思日誌
                    </button>
                    <button
                        onClick={() => setActiveTab('report')}
                        className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'report'
                            ? 'bg-white text-slate-900 shadow'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                            }`}
                    >
                        AI 分析報告
                    </button>
                </div>

                {activeTab === 'report' ? (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        {/* Overall Score Card */}
                        <Card className="bg-linear-to-br from-blue-50 to-indigo-50 border-blue-100">
                            <CardContent className="p-8 flex items-center gap-8">
                                <div className="text-center shrink-0">
                                    <div className="text-5xl font-bold text-blue-600 mb-2">{MOCK_AI_REPORT.overview.score}</div>
                                    <div className="text-sm font-medium text-blue-700 bg-blue-100 px-3 py-1 rounded-full">
                                        綜合評分
                                    </div>
                                </div>
                                <div className="flex-1 border-l border-blue-200 pl-8">
                                    <h3 className="font-semibold text-slate-900 text-lg mb-2">總結評論</h3>
                                    <p className="text-slate-700 leading-relaxed">
                                        {MOCK_AI_REPORT.overview.summary}
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Analysis Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Strengths */}
                            <Card className="border-green-100 bg-green-50/30">
                                <CardHeader>
                                    <CardTitle className="text-green-700 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        做得很好的地方
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {MOCK_AI_REPORT.overview.strengths.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700">
                                                <span className="text-green-600 mt-1">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>

                            {/* Improvements */}
                            <Card className="border-amber-100 bg-amber-50/30">
                                <CardHeader>
                                    <CardTitle className="text-amber-700 flex items-center gap-2">
                                        <HelpCircle className="w-5 h-5" />
                                        建議改進方向
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ul className="space-y-3">
                                        {MOCK_AI_REPORT.overview.improvements.map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-slate-700">
                                                <span className="text-amber-600 mt-1">•</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Metrics */}
                        <Card>
                            <CardHeader>
                                <CardTitle>互動數據統計</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">{MOCK_AI_REPORT.metrics.teacherTalkTime}</div>
                                        <div className="text-xs text-slate-500 mt-1">教師發話佔比</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">{MOCK_AI_REPORT.metrics.studentTalkTime}</div>
                                        <div className="text-xs text-slate-500 mt-1">學生發話佔比</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">{MOCK_AI_REPORT.metrics.questionCount}</div>
                                        <div className="text-xs text-slate-500 mt-1">提問次數</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">{MOCK_AI_REPORT.metrics.feedbackCount}</div>
                                        <div className="text-xs text-slate-500 mt-1">回饋次數</div>
                                    </div>
                                    <div className="p-4 bg-slate-50 rounded-lg text-center">
                                        <div className="text-2xl font-bold text-slate-900">{MOCK_AI_REPORT.metrics.scaffoldingCount}</div>
                                        <div className="text-xs text-slate-500 mt-1">鷹架引導</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <Card>
                            <CardHeader>
                                <CardTitle>教學目標檢核</CardTitle>
                                <CardDescription>回顧您在教案中設定的目標，檢視達成情形。</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        1. 本節課的主要教學目標是否達成？（請具體說明）
                                    </label>
                                    <Textarea
                                        placeholder="例如：大部分學生能理解移項法則，但在正負號變號時仍有部分混淆..."
                                        className="min-h-[100px]"
                                        value={reflectionData.objective}
                                        onChange={e => setReflectionData({ ...reflectionData, objective: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>教學歷程反思</CardTitle>
                                <CardDescription>深入思考教學過程中的亮點與挑戰。</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        2. 摘要說明本節課的教學流程與重點。
                                    </label>
                                    <Textarea
                                        placeholder="簡述引起動機、發展活動、綜合活動的實施情形..."
                                        className="min-h-[100px]"
                                        value={reflectionData.summary}
                                        onChange={e => setReflectionData({ ...reflectionData, summary: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        3. 自我評鑑：您覺得今天表現最好的地方是什麼？有什麼突發狀況？
                                    </label>
                                    <Textarea
                                        placeholder="我覺得在處理學生錯誤迷思時..."
                                        className="min-h-[100px]"
                                        value={reflectionData.selfEvaluation}
                                        onChange={e => setReflectionData({ ...reflectionData, selfEvaluation: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>改進與展望</CardTitle>
                                <CardDescription>規劃未來的專業成長方向。</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        4. 透過本次教學，您獲得了什麼新的教學洞見或啟發？
                                    </label>
                                    <Textarea
                                        placeholder="我發現使用視覺化工具對於..."
                                        className="min-h-[100px]"
                                        value={reflectionData.insight}
                                        onChange={e => setReflectionData({ ...reflectionData, insight: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">
                                        5. 下一步的改進計畫為何？
                                    </label>
                                    <Textarea
                                        placeholder="下次我會嘗試..."
                                        className="min-h-[100px]"
                                        value={reflectionData.nextStep}
                                        onChange={e => setReflectionData({ ...reflectionData, nextStep: e.target.value })}
                                    />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Supervisor Feedback Section */}
                        <Card className="bg-slate-50 border-dashed border-2 border-slate-300">
                            <CardHeader>
                                <CardTitle className="text-slate-600 flex items-center gap-2">
                                    <MessageSquare className="w-5 h-5" />
                                    指導教授回饋
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-center py-8 text-slate-400 text-sm">
                                    目前尚無指導教授回饋
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </main>
        </div>
    );
}
