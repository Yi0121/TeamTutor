'use client';

import { useEffect, useRef, useState } from 'react';
import { Loader2, Maximize2, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GeoGebraEmbedProps {
    appletId?: string; // For loading saved applets
    materialId?: string; // Alternative ID
    width?: number | string;
    height?: number | string;
    showToolbar?: boolean;
    showAlgebraInput?: boolean;
    showMenuBar?: boolean;
    enableShiftDragZoom?: boolean;
    capturingThreshold?: number;
    showToolBarHelp?: boolean;
    errorDialogsActive?: boolean;
    useBrowserForJS?: boolean;
    onLoad?: () => void;
    onError?: (error: any) => void;
    // Base64 encoded ggb file content (optional)
    ggbBase64?: string;
    // Initial construction commands
    commands?: string[];
}

declare global {
    interface Window {
        GGBApplet: any;
        renderGGBElement: (el: HTMLElement, callback: () => void) => void;
    }
}

export function GeoGebraEmbed({
    appletId = 'ggb-element',
    width = '100%',
    height = 600,
    showToolbar = false,
    showAlgebraInput = false,
    showMenuBar = false,
    enableShiftDragZoom = true,
    commands = [],
    ggbBase64,
}: GeoGebraEmbedProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const appletRef = useRef<any>(null);

    useEffect(() => {
        // Load GeoGebra script if not already loaded
        if (!document.getElementById('geogebra-script')) {
            const script = document.createElement('script');
            script.id = 'geogebra-script';
            script.src = 'https://www.geogebra.org/apps/deployggb.js';
            script.async = true;
            script.onload = () => initApplet();
            script.onerror = () => setError('Failed to load GeoGebra library');
            document.body.appendChild(script);
        } else {
            initApplet();
        }

        return () => {
            // Cleanup if necessary
        };
    }, []);

    const initApplet = () => {
        if (!containerRef.current || !window.GGBApplet) return;

        setLoading(true);
        setError(null);

        try {
            const parameters = {
                id: appletId,
                width: typeof width === 'number' ? width : 800, // Default for calculation, will be responsive
                height: typeof height === 'number' ? height : 600,
                showToolBar: showToolbar,
                borderColor: null,
                showMenuBar: showMenuBar,
                showAlgebraInput: showAlgebraInput,
                showResetIcon: true,
                enableLabelDrags: false,
                enableShiftDragZoom: enableShiftDragZoom,
                enableRightClick: true,
                capturingThreshold: null,
                showToolBarHelp: false,
                errorDialogsActive: true,
                useBrowserForJS: false,
                ggbBase64: ggbBase64,
                appletOnLoad: () => {
                    setLoading(false);
                    // Get applet instance
                    // @ts-ignore
                    const applet = window[appletId];
                    appletRef.current = applet;

                    // Execute initial commands
                    if (applet && commands.length > 0) {
                        commands.forEach(cmd => applet.evalCommand(cmd));
                    }
                }
            };

            const applet = new window.GGBApplet(parameters, true);
            applet.inject(containerRef.current);
        } catch (err: any) {
            console.error('GeoGebra init error:', err);
            setError(err.message || 'Failed to initialize GeoGebra');
            setLoading(false);
        }
    };

    const handleReload = () => {
        if (containerRef.current) {
            containerRef.current.innerHTML = '';
            initApplet();
        }
    };

    return (
        <div className="relative border border-slate-200 rounded-xl overflow-hidden bg-white">
            {/* Toolbar / Header */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-slate-50">
                <div className="flex items-center gap-2">
                    <img
                        src="https://www.geogebra.org/apps/icons/geogebra.svg"
                        alt="GeoGebra"
                        className="w-5 h-5"
                    />
                    <span className="text-sm font-medium text-slate-700">GeoGebraGraph</span>
                </div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600"
                        onClick={handleReload}
                        title="Reload"
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-slate-500 hover:text-blue-600"
                        title="Fullscreen"
                    >
                        <Maximize2 className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            {/* Container */}
            <div className="relative w-full overflow-hidden" style={{ height }}>
                {loading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-50 z-10">
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                            <p className="text-sm text-slate-500">Loading GeoGebra...</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="absolute inset-0 flex items-center justify-center bg-red-50 z-10">
                        <div className="text-center p-4">
                            <p className="text-red-600 font-medium mb-2">Error loading GeoGebra</p>
                            <p className="text-sm text-red-500 mb-4">{error}</p>
                            <Button onClick={handleReload} variant="outline" size="sm">
                                Try Again
                            </Button>
                        </div>
                    </div>
                )}

                <div
                    ref={containerRef}
                    className="w-full h-full"
                    id={`ggb-container-${appletId}`}
                />
            </div>
        </div>
    );
}
