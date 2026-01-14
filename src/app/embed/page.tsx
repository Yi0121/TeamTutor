'use client';

import { useState } from 'react';
import {
    Code,
    MessageCircle,
    Palette,
    Globe,
    Key,
    Copy,
    Check,
    Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

type EmbedType = 'iframe' | 'bubble';

export default function EmbedSettingsPage() {
    const [embedType, setEmbedType] = useState<EmbedType>('iframe');
    const [theme, setTheme] = useState<'light' | 'dark'>('light');
    const [primaryColor, setPrimaryColor] = useState('#3b82f6');
    const [allowedDomains, setAllowedDomains] = useState('example.com\nlocalhost');
    const [copied, setCopied] = useState(false);

    const generateEmbedCode = () => {
        if (embedType === 'iframe') {
            return `<iframe
  src="https://teamtutor.app/embed/classroom/demo"
  width="100%"
  height="600"
  frameborder="0"
  allow="microphone; camera"
  style="border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);"
></iframe>`;
        } else {
            return `<script src="https://teamtutor.app/embed/bubble.js"></script>
<script>
  TeamTutor.init({
    position: 'bottom-right',
    theme: '${theme}',
    primaryColor: '${primaryColor}'
  });
</script>`;
        }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generateEmbedCode());
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Code className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">嵌入設定</h1>
                            <p className="text-slate-500">將 TeamTutor 嵌入您的網站或應用程式</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-6 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Settings Panel (Left) */}
                    <div className="space-y-6">
                        {/* Embed Type */}
                        <Card>
                            <CardHeader>
                                <CardTitle>嵌入類型</CardTitle>
                                <CardDescription>選擇嵌入方式</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => setEmbedType('iframe')}
                                        className={`p-4 border-2 rounded-xl text-left transition-all ${embedType === 'iframe'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <Code className="w-8 h-8 text-blue-500 mb-2" />
                                        <h3 className="font-medium">iFrame</h3>
                                        <p className="text-sm text-slate-500">完整嵌入整個課堂介面</p>
                                    </button>
                                    <button
                                        onClick={() => setEmbedType('bubble')}
                                        className={`p-4 border-2 rounded-xl text-left transition-all ${embedType === 'bubble'
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-slate-200 hover:border-slate-300'
                                            }`}
                                    >
                                        <MessageCircle className="w-8 h-8 text-purple-500 mb-2" />
                                        <h3 className="font-medium">Bubble Chat</h3>
                                        <p className="text-sm text-slate-500">浮動對話氣泡 (右下角)</p>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Appearance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Palette className="w-5 h-5" />
                                    外觀設定
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium text-slate-700">主題</label>
                                    <div className="flex gap-2 mt-2">
                                        <button
                                            onClick={() => setTheme('light')}
                                            className={`flex-1 p-3 rounded-lg border-2 ${theme === 'light' ? 'border-blue-500' : 'border-slate-200'
                                                }`}
                                        >
                                            淺色
                                        </button>
                                        <button
                                            onClick={() => setTheme('dark')}
                                            className={`flex-1 p-3 rounded-lg border-2 ${theme === 'dark' ? 'border-blue-500' : 'border-slate-200'
                                                }`}
                                        >
                                            深色
                                        </button>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-slate-700">主色調</label>
                                    <div className="flex items-center gap-3 mt-2">
                                        <input
                                            type="color"
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="w-12 h-12 rounded-lg border cursor-pointer"
                                        />
                                        <Input
                                            value={primaryColor}
                                            onChange={(e) => setPrimaryColor(e.target.value)}
                                            className="font-mono"
                                        />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Allowed Domains */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Globe className="w-5 h-5" />
                                    允許的網域
                                </CardTitle>
                                <CardDescription>每行一個網域，限制嵌入來源</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <textarea
                                    value={allowedDomains}
                                    onChange={(e) => setAllowedDomains(e.target.value)}
                                    rows={4}
                                    className="w-full p-3 border rounded-lg font-mono text-sm"
                                    placeholder="example.com"
                                />
                            </CardContent>
                        </Card>

                        {/* Token Management */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Key className="w-5 h-5" />
                                    Token 管理
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                    <div>
                                        <p className="font-medium text-slate-900">Public Token</p>
                                        <code className="text-xs text-slate-500">pk_live_abc123...</code>
                                    </div>
                                    <Badge variant="outline" className="bg-green-50 text-green-700">有效</Badge>
                                </div>
                                <Button variant="outline" className="w-full">
                                    重新產生 Token
                                </Button>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Preview & Code (Right) */}
                    <div className="space-y-6">
                        {/* Live Preview */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Eye className="w-5 h-5" />
                                    即時預覽
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div
                                    className={`rounded-xl border overflow-hidden ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'
                                        }`}
                                    style={{ height: 400 }}
                                >
                                    {embedType === 'iframe' ? (
                                        <div className="h-full flex flex-col">
                                            <div
                                                className="h-12 flex items-center px-4 border-b"
                                                style={{ backgroundColor: primaryColor }}
                                            >
                                                <span className="text-white font-medium">TeamTutor Classroom</span>
                                            </div>
                                            <div className="flex-1 flex items-center justify-center text-slate-400">
                                                [iFrame 預覽區域]
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="h-full relative">
                                            <div className="absolute bottom-4 right-4">
                                                <div
                                                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-lg cursor-pointer"
                                                    style={{ backgroundColor: primaryColor }}
                                                >
                                                    <MessageCircle className="w-6 h-6 text-white" />
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Embed Code */}
                        <Card>
                            <CardHeader>
                                <CardTitle>嵌入程式碼</CardTitle>
                                <CardDescription>複製以下程式碼到您的網站</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="relative">
                                    <pre className="p-4 bg-slate-900 text-green-400 rounded-lg text-sm overflow-x-auto">
                                        {generateEmbedCode()}
                                    </pre>
                                    <Button
                                        size="sm"
                                        className="absolute top-2 right-2"
                                        onClick={handleCopy}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="w-4 h-4 mr-1" />
                                                已複製
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="w-4 h-4 mr-1" />
                                                複製
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    );
}
