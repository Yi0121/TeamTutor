'use client';

import { useState } from 'react';
import { X, Plus, Trash2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface ToolParameter {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'object';
    description: string;
    required: boolean;
}

interface ToolDefinition {
    name: string;
    description: string;
    icon: string;
    category: string;
    parameters: ToolParameter[];
}

interface AddToolModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSave?: (tool: ToolDefinition) => void;
}

const ICON_OPTIONS = ['🔧', '📐', '🔍', '🐍', '🧮', '📊', '📝', '🌐', '🎨', '📁'];
const CATEGORY_OPTIONS = [
    { value: 'math', label: '數學工具' },
    { value: 'code', label: '程式碼' },
    { value: 'research', label: '研究搜尋' },
    { value: 'visualization', label: '視覺化' },
    { value: 'utility', label: '實用工具' },
];

export function AddToolModal({ open, onOpenChange, onSave }: AddToolModalProps) {
    const [toolDef, setToolDef] = useState<ToolDefinition>({
        name: '',
        description: '',
        icon: '🔧',
        category: 'utility',
        parameters: [],
    });

    const [newParam, setNewParam] = useState<ToolParameter>({
        name: '',
        type: 'string',
        description: '',
        required: false,
    });

    const handleAddParameter = () => {
        if (!newParam.name.trim()) return;

        setToolDef((prev) => ({
            ...prev,
            parameters: [...prev.parameters, { ...newParam }],
        }));

        setNewParam({
            name: '',
            type: 'string',
            description: '',
            required: false,
        });
    };

    const handleRemoveParameter = (index: number) => {
        setToolDef((prev) => ({
            ...prev,
            parameters: prev.parameters.filter((_, i) => i !== index),
        }));
    };

    const handleSave = () => {
        if (!toolDef.name.trim() || !toolDef.description.trim()) return;

        if (onSave) {
            onSave(toolDef);
        }

        // Reset form
        setToolDef({
            name: '',
            description: '',
            icon: '🔧',
            category: 'utility',
            parameters: [],
        });

        onOpenChange(false);
    };

    const isValid = toolDef.name.trim() && toolDef.description.trim();

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5" />
                        新增自訂工具
                    </DialogTitle>
                    <DialogDescription>
                        定義新的 MCP 工具，供代理人在對話中呼叫
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">基本資訊</h3>

                        <div className="grid grid-cols-[auto_1fr] gap-4">
                            {/* Icon Selector */}
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-1">
                                    圖示
                                </label>
                                <div className="flex flex-wrap gap-1 p-2 border rounded-lg max-w-[140px]">
                                    {ICON_OPTIONS.map((icon) => (
                                        <button
                                            key={icon}
                                            type="button"
                                            onClick={() =>
                                                setToolDef((prev) => ({ ...prev, icon }))
                                            }
                                            className={`w-8 h-8 flex items-center justify-center text-lg rounded hover:bg-slate-100 transition-colors ${toolDef.icon === icon
                                                    ? 'bg-blue-100 ring-2 ring-blue-500'
                                                    : ''
                                                }`}
                                        >
                                            {icon}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Name & Category */}
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        工具名稱 *
                                    </label>
                                    <Input
                                        value={toolDef.name}
                                        onChange={(e) =>
                                            setToolDef((prev) => ({
                                                ...prev,
                                                name: e.target.value,
                                            }))
                                        }
                                        placeholder="例如: custom_search"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">
                                        類別
                                    </label>
                                    <select
                                        value={toolDef.category}
                                        onChange={(e) =>
                                            setToolDef((prev) => ({
                                                ...prev,
                                                category: e.target.value,
                                            }))
                                        }
                                        className="w-full h-10 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {CATEGORY_OPTIONS.map((cat) => (
                                            <option key={cat.value} value={cat.value}>
                                                {cat.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                描述 *
                            </label>
                            <Textarea
                                value={toolDef.description}
                                onChange={(e) =>
                                    setToolDef((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="描述工具的功能與用途..."
                                rows={3}
                            />
                        </div>
                    </div>

                    {/* Parameters */}
                    <div className="space-y-4">
                        <h3 className="font-medium text-slate-900">參數定義</h3>

                        {/* Existing Parameters */}
                        {toolDef.parameters.length > 0 && (
                            <div className="space-y-2">
                                {toolDef.parameters.map((param, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-sm text-slate-900">
                                                    {param.name}
                                                </span>
                                                <Badge variant="outline" className="text-xs">
                                                    {param.type}
                                                </Badge>
                                                {param.required && (
                                                    <Badge className="text-xs bg-red-100 text-red-700">
                                                        必填
                                                    </Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-500 mt-1">
                                                {param.description || '無描述'}
                                            </p>
                                        </div>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="text-slate-400 hover:text-red-500"
                                            onClick={() => handleRemoveParameter(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add New Parameter */}
                        <div className="p-4 border border-dashed border-slate-300 rounded-lg space-y-3">
                            <p className="text-sm font-medium text-slate-600">新增參數</p>
                            <div className="grid grid-cols-2 gap-3">
                                <Input
                                    value={newParam.name}
                                    onChange={(e) =>
                                        setNewParam((prev) => ({
                                            ...prev,
                                            name: e.target.value,
                                        }))
                                    }
                                    placeholder="參數名稱"
                                />
                                <select
                                    value={newParam.type}
                                    onChange={(e) =>
                                        setNewParam((prev) => ({
                                            ...prev,
                                            type: e.target.value as ToolParameter['type'],
                                        }))
                                    }
                                    className="h-10 px-3 border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="string">string</option>
                                    <option value="number">number</option>
                                    <option value="boolean">boolean</option>
                                    <option value="object">object</option>
                                </select>
                            </div>
                            <Input
                                value={newParam.description}
                                onChange={(e) =>
                                    setNewParam((prev) => ({
                                        ...prev,
                                        description: e.target.value,
                                    }))
                                }
                                placeholder="參數描述"
                            />
                            <div className="flex items-center justify-between">
                                <label className="flex items-center gap-2 text-sm text-slate-600">
                                    <input
                                        type="checkbox"
                                        checked={newParam.required}
                                        onChange={(e) =>
                                            setNewParam((prev) => ({
                                                ...prev,
                                                required: e.target.checked,
                                            }))
                                        }
                                        className="w-4 h-4 rounded border-slate-300"
                                    />
                                    必填參數
                                </label>
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddParameter}
                                    disabled={!newParam.name.trim()}
                                >
                                    <Plus className="w-4 h-4 mr-1" />
                                    新增
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end gap-3 pt-4 border-t">
                    <Button variant="outline" onClick={() => onOpenChange(false)}>
                        取消
                    </Button>
                    <Button onClick={handleSave} disabled={!isValid}>
                        <Save className="w-4 h-4 mr-2" />
                        儲存工具
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export default AddToolModal;
