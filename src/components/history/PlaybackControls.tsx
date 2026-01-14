import React from 'react';
import {
    Play,
    Pause,
    SkipBack,
    SkipForward,
    FastForward,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface PlaybackControlsProps {
    isPlaying: boolean;
    currentEventIndex: number;
    totalEvents: number;
    playbackSpeed: number;
    currentTime: string;
    onPlayPause: () => void;
    onNext: () => void;
    onPrevious: () => void;
    onSeek: (index: number) => void;
    onSpeedChange: (speed: string) => void;
}

export default function PlaybackControls({
    isPlaying,
    currentEventIndex,
    totalEvents,
    playbackSpeed,
    currentTime,
    onPlayPause,
    onNext,
    onPrevious,
    onSeek,
    onSpeedChange,
}: PlaybackControlsProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Main Controls Row */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon" onClick={onPrevious} disabled={currentEventIndex <= 0}>
                        <SkipBack className="w-4 h-4" />
                    </Button>

                    <Button
                        size="icon"
                        className="h-12 w-12 rounded-full shadow-md bg-blue-600 hover:bg-blue-700"
                        onClick={onPlayPause}
                    >
                        {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
                    </Button>

                    <Button variant="outline" size="icon" onClick={onNext} disabled={currentEventIndex >= totalEvents - 1}>
                        <SkipForward className="w-4 h-4" />
                    </Button>
                </div>

                <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg px-3 py-1.5 shadow-sm">
                    <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Speed</span>
                    <Select value={playbackSpeed.toString()} onValueChange={onSpeedChange}>
                        <SelectTrigger className="h-7 w-[70px] border-none shadow-none text-xs bg-transparent focus:ring-0 px-0">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="0.5">0.5x</SelectItem>
                            <SelectItem value="1">1.0x</SelectItem>
                            <SelectItem value="1.5">1.5x</SelectItem>
                            <SelectItem value="2">2.0x</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            {/* Scrubber Row */}
            <div className="flex items-center gap-3">
                <span className="text-xs font-mono text-slate-500 w-10">{currentTime}</span>
                <Slider
                    value={[currentEventIndex]}
                    max={totalEvents - 1}
                    step={1}
                    onValueChange={(vals: number[]) => onSeek(vals[0])}
                    className="flex-1 cursor-pointer"
                />
                <span className="text-xs font-mono text-slate-400 w-10 text-right">
                    {Math.round((currentEventIndex / Math.max(totalEvents - 1, 1)) * 100)}%
                </span>
            </div>
        </div>
    );
}
