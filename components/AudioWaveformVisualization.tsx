'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface AudioWaveformProps {
  audioUrl: string;
  title?: string;
  color?: string;
  height?: number;
  autoPlay?: boolean;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
}

export default function AudioWaveformVisualization({
  audioUrl,
  title,
  color = '#8B5CF6',
  height = 100,
  autoPlay = false,
  onTimeUpdate,
}: AudioWaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [waveformData, setWaveformData] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const animationRef = useRef<number | null>(null);

  // Load audio and generate waveform
  useEffect(() => {
    if (!audioUrl) return;

    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      setIsLoading(false);
      if (autoPlay) {
        audio.play();
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      if (onTimeUpdate) {
        onTimeUpdate(audio.currentTime, audio.duration);
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      audio.currentTime = 0;
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);

    // Generate waveform data (simplified - in production, use Web Audio API for accurate analysis)
    generateWaveform();

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [audioUrl, autoPlay, onTimeUpdate]);

  // Generate waveform visualization data
  const generateWaveform = async () => {
    try {
      // In production, use Web Audio API for accurate waveform
      // For now, generate simulated waveform
      const bars = 200;
      const data: number[] = [];
      
      for (let i = 0; i < bars; i++) {
        // Simulate varied amplitude
        const amplitude = Math.sin(i * 0.05) * 0.5 + 0.5;
        const randomVariation = Math.random() * 0.3;
        data.push(amplitude * 0.8 + randomVariation * 0.2);
      }
      
      setWaveformData(data);
    } catch (error) {
      console.error('Error generating waveform:', error);
    }
  };

  // Draw waveform on canvas
  useEffect(() => {
    if (!canvasRef.current || waveformData.length === 0) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const barWidth = width / waveformData.length;
      const progress = duration > 0 ? currentTime / duration : 0;

      waveformData.forEach((amplitude, i) => {
        const barHeight = amplitude * height * 0.8;
        const x = i * barWidth;
        const y = (height - barHeight) / 2;

        // Gradient for played portion
        const isPlayed = i / waveformData.length < progress;
        
        if (isPlayed) {
          ctx.fillStyle = color;
        } else {
          ctx.fillStyle = `${color}40`; // 25% opacity
        }

        ctx.fillRect(x, y, barWidth - 1, barHeight);
      });

      // Draw progress line
      const progressX = width * progress;
      ctx.strokeStyle = '#FF006E';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(progressX, 0);
      ctx.lineTo(progressX, height);
      ctx.stroke();
    };

    draw();
    
    if (isPlaying) {
      animationRef.current = requestAnimationFrame(draw);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [waveformData, currentTime, duration, isPlaying, color]);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const audio = audioRef.current;
    const canvas = canvasRef.current;
    if (!audio || !canvas || duration === 0) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percentage = x / rect.width;
    audio.currentTime = percentage * duration;
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      {/* Header */}
      {title && (
        <div className="mb-3 flex items-center justify-between">
          <h4 className="font-medium text-gray-900">{title}</h4>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span>{formatTime(currentTime)}</span>
            <span>/</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      )}

      {/* Waveform Canvas */}
      <div className="relative mb-3">
        <canvas
          ref={canvasRef}
          width={800}
          height={height}
          onClick={handleSeek}
          className="w-full cursor-pointer rounded bg-gray-50"
          style={{ height: `${height}px` }}
        />
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-75">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-purple-600 border-t-transparent" />
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center space-x-4">
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          disabled={isLoading}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-700 disabled:opacity-50"
        >
          {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5 ml-0.5" />}
        </button>

        {/* Volume Control */}
        <div className="flex flex-1 items-center space-x-2">
          <button
            onClick={toggleMute}
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            {isMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="flex-1"
          />
          <span className="min-w-[3rem] text-sm text-gray-600">{Math.round(volume * 100)}%</span>
        </div>
      </div>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
    </div>
  );
}
