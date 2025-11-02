'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Play, Pause, SkipBack, SkipForward, Scissors, Copy, Trash2, Plus, ZoomIn, ZoomOut } from 'lucide-react';

interface TimelineClip {
  id: string;
  sceneId: string;
  sceneName: string;
  startTime: number; // in seconds
  duration: number;
  audioUrl?: string;
  color: string;
}

export default function AudioTimelineEditor() {
  const { currentProject } = useStore();
  const [clips, setClips] = useState<TimelineClip[]>([]);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoom, setZoom] = useState(1); // pixels per second
  const [selectedClipId, setSelectedClipId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);
  const timelineRef = useRef<HTMLDivElement>(null);
  const playheadRef = useRef<number | null>(null);

  // Initialize clips from project scenes
  useEffect(() => {
    if (!currentProject?.scenes) return;

    let cumulativeTime = 0;
    const initialClips: TimelineClip[] = currentProject.scenes.map((scene, index) => {
      const clip: TimelineClip = {
        id: scene.id,
        sceneId: scene.id,
        sceneName: scene.title || `Scene ${index + 1}`,
        startTime: cumulativeTime,
        duration: scene.duration || 5,
        color: `hsl(${(index * 360) / currentProject.scenes!.length}, 70%, 60%)`,
      };
      cumulativeTime += clip.duration;
      return clip;
    });

    setClips(initialClips);
  }, [currentProject]);

  // Playback loop
  useEffect(() => {
    if (!isPlaying) {
      if (playheadRef.current) {
        cancelAnimationFrame(playheadRef.current);
        playheadRef.current = null;
      }
      return;
    }

    const startTime = Date.now();
    const initialTime = currentTime;

    const animate = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newTime = initialTime + elapsed;

      const totalDuration = clips.reduce((sum, clip) => Math.max(sum, clip.startTime + clip.duration), 0);

      if (newTime >= totalDuration) {
        setIsPlaying(false);
        setCurrentTime(0);
        return;
      }

      setCurrentTime(newTime);
      playheadRef.current = requestAnimationFrame(animate);
    };

    playheadRef.current = requestAnimationFrame(animate);

    return () => {
      if (playheadRef.current) {
        cancelAnimationFrame(playheadRef.current);
      }
    };
  }, [isPlaying, currentTime, clips]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const skipToStart = () => {
    setCurrentTime(0);
    setIsPlaying(false);
  };

  const skipToEnd = () => {
    const totalDuration = clips.reduce((sum, clip) => Math.max(sum, clip.startTime + clip.duration), 0);
    setCurrentTime(totalDuration);
    setIsPlaying(false);
  };

  const handleTimelineClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!timelineRef.current) return;

    const rect = timelineRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const time = x / (zoom * 10); // 10 is base pixels per second
    setCurrentTime(time);
  };

  const handleClipMouseDown = (e: React.MouseEvent, clipId: string) => {
    e.stopPropagation();
    setSelectedClipId(clipId);
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedClipId) return;

    const deltaX = e.clientX - dragStartX;
    const deltaTime = deltaX / (zoom * 10);

    setClips((prevClips) =>
      prevClips.map((clip) => {
        if (clip.id === selectedClipId) {
          const newStartTime = Math.max(0, clip.startTime + deltaTime);
          return { ...clip, startTime: newStartTime };
        }
        return clip;
      })
    );

    setDragStartX(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const splitClip = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    const splitPoint = currentTime - clip.startTime;
    if (splitPoint <= 0 || splitPoint >= clip.duration) return;

    const newClips = clips.flatMap((c) => {
      if (c.id !== clipId) return c;

      return [
        { ...c, duration: splitPoint },
        {
          ...c,
          id: `${c.id}-split-${Date.now()}`,
          startTime: c.startTime + splitPoint,
          duration: c.duration - splitPoint,
        },
      ];
    });

    setClips(newClips);
  };

  const duplicateClip = (clipId: string) => {
    const clip = clips.find((c) => c.id === clipId);
    if (!clip) return;

    const newClip: TimelineClip = {
      ...clip,
      id: `${clip.id}-copy-${Date.now()}`,
      startTime: clip.startTime + clip.duration,
    };

    setClips([...clips, newClip]);
  };

  const deleteClip = (clipId: string) => {
    setClips(clips.filter((c) => c.id !== clipId));
    if (selectedClipId === clipId) {
      setSelectedClipId(null);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    const frames = Math.floor((time % 1) * 30); // 30 fps
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}:${frames.toString().padStart(2, '0')}`;
  };

  const totalDuration = clips.reduce((sum, clip) => Math.max(sum, clip.startTime + clip.duration), 0);
  const timelineWidth = totalDuration * zoom * 10;

  return (
    <div className="flex h-full flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Audio Timeline Editor</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setZoom(Math.max(0.5, zoom - 0.5))}
              className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
            >
              <ZoomOut className="h-5 w-5" />
            </button>
            <span className="min-w-[4rem] text-center text-sm">{Math.round(zoom * 100)}%</span>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.5))}
              className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
            >
              <ZoomIn className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Transport Controls */}
      <div className="border-b border-gray-700 bg-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={skipToStart}
              className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={togglePlay}
              className="rounded bg-purple-600 p-3 transition-colors hover:bg-purple-700"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
            </button>
            <button
              onClick={skipToEnd}
              className="rounded bg-gray-700 p-2 transition-colors hover:bg-gray-600"
            >
              <SkipForward className="h-5 w-5" />
            </button>
            <div className="ml-4 font-mono text-lg">{formatTime(currentTime)}</div>
          </div>

          {selectedClipId && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => splitClip(selectedClipId)}
                className="flex items-center space-x-1 rounded bg-gray-700 px-3 py-2 text-sm transition-colors hover:bg-gray-600"
              >
                <Scissors className="h-4 w-4" />
                <span>Split</span>
              </button>
              <button
                onClick={() => duplicateClip(selectedClipId)}
                className="flex items-center space-x-1 rounded bg-gray-700 px-3 py-2 text-sm transition-colors hover:bg-gray-600"
              >
                <Copy className="h-4 w-4" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={() => deleteClip(selectedClipId)}
                className="flex items-center space-x-1 rounded bg-red-600 px-3 py-2 text-sm transition-colors hover:bg-red-700"
              >
                <Trash2 className="h-4 w-4" />
                <span>Delete</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-auto">
        <div className="relative min-h-full p-4">
          {/* Time Ruler */}
          <div className="mb-2 flex h-8 border-b border-gray-700">
            {Array.from({ length: Math.ceil(totalDuration) + 1 }).map((_, i) => (
              <div
                key={i}
                className="relative border-l border-gray-600"
                style={{ width: `${zoom * 10}px` }}
              >
                <span className="absolute left-1 top-0 text-xs text-gray-400">{i}s</span>
              </div>
            ))}
          </div>

          {/* Timeline Tracks */}
          <div
            ref={timelineRef}
            className="relative"
            style={{ minWidth: `${timelineWidth}px`, height: '200px' }}
            onClick={handleTimelineClick}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            {/* Grid Lines */}
            {Array.from({ length: Math.ceil(totalDuration) * 4 + 1 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 h-full border-l border-gray-800"
                style={{ left: `${(i * zoom * 10) / 4}px` }}
              />
            ))}

            {/* Clips */}
            {clips.map((clip) => (
              <div
                key={clip.id}
                className={`absolute h-16 cursor-move rounded border-2 transition-all ${
                  selectedClipId === clip.id
                    ? 'border-purple-500 shadow-lg shadow-purple-500/50'
                    : 'border-transparent hover:border-purple-400'
                }`}
                style={{
                  left: `${clip.startTime * zoom * 10}px`,
                  width: `${clip.duration * zoom * 10}px`,
                  backgroundColor: clip.color,
                  top: '20px',
                }}
                onMouseDown={(e) => handleClipMouseDown(e, clip.id)}
              >
                <div className="flex h-full flex-col justify-center px-2">
                  <div className="truncate text-sm font-medium text-white">{clip.sceneName}</div>
                  <div className="text-xs text-white text-opacity-75">{clip.duration}s</div>
                </div>
              </div>
            ))}

            {/* Playhead */}
            <div
              className="absolute top-0 z-10 h-full w-0.5 bg-red-500"
              style={{ left: `${currentTime * zoom * 10}px` }}
            >
              <div className="absolute -left-2 -top-1 h-3 w-5 bg-red-500 rounded-b" />
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="border-t border-gray-700 bg-gray-800 p-3">
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span>{clips.length} clips</span>
          <span>Total: {formatTime(totalDuration)}</span>
        </div>
      </div>
    </div>
  );
}
