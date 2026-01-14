'use client';

import {
    Save,
    FolderOpen,
    Download,
    Play,
    Undo2,
    Redo2,
    ZoomIn,
    ZoomOut,
    Maximize2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CanvasToolbarProps {
    onSave: () => void;
    onLoad: () => void;
    onExport: () => void;
    onPreview: () => void;
    onUndo: () => void;
    onRedo: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onFitView: () => void;
    canUndo?: boolean;
    canRedo?: boolean;
}

export function CanvasToolbar({
    onSave,
    onLoad,
    onExport,
    onPreview,
    onUndo,
    onRedo,
    onZoomIn,
    onZoomOut,
    onFitView,
    canUndo = false,
    canRedo = false,
}: CanvasToolbarProps) {
    return (
        <div className="flex items-center gap-1 p-2 bg-white border border-slate-200 rounded-lg shadow-sm">
            {/* File Operations */}
            <div className="flex items-center gap-1 pr-2 border-r border-slate-200">
                <Button variant="ghost" size="icon" onClick={onSave} title="儲存">
                    <Save className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onLoad} title="載入範本">
                    <FolderOpen className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onExport} title="匯出">
                    <Download className="w-4 h-4" />
                </Button>
            </div>

            {/* Preview */}
            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                <Button variant="ghost" size="icon" onClick={onPreview} title="預覽">
                    <Play className="w-4 h-4" />
                </Button>
            </div>

            {/* History */}
            <div className="flex items-center gap-1 px-2 border-r border-slate-200">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onUndo}
                    disabled={!canUndo}
                    title="復原"
                >
                    <Undo2 className="w-4 h-4" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={onRedo}
                    disabled={!canRedo}
                    title="重做"
                >
                    <Redo2 className="w-4 h-4" />
                </Button>
            </div>

            {/* Zoom */}
            <div className="flex items-center gap-1 pl-2">
                <Button variant="ghost" size="icon" onClick={onZoomOut} title="縮小">
                    <ZoomOut className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onZoomIn} title="放大">
                    <ZoomIn className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={onFitView} title="適應畫面">
                    <Maximize2 className="w-4 h-4" />
                </Button>
            </div>
        </div>
    );
}
