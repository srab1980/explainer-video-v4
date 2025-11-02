'use client';

import { useState, useRef, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { Plus, Volume2, VolumeX, Trash2, Play, Pause, Download, Upload, Music, Mic, Zap } from 'lucide-react';
import AudioWaveformVisualization from './AudioWaveformVisualization';

interface AudioTrack {
  id: string;
  name: string;
  type: 'voiceover' | 'music' | 'sfx';
  url: string;
  volume: number;
  muted: boolean;
  solo: boolean;
  fadeIn: number;
  fadeOut: number;
  startTime: number; // offset in timeline
  duration: number;
}

export default function MultiTrackAudioMixer() {
  const { currentProject } = useStore();
  const [tracks, setTracks] = useState<AudioTrack[]>([
    {
      id: 'track-1',
      name: 'Voiceover',
      type: 'voiceover',
      url: '',
      volume: 80,
      muted: false,
      solo: false,
      fadeIn: 0,
      fadeOut: 0,
      startTime: 0,
      duration: 0,
    },
    {
      id: 'track-2',
      name: 'Background Music',
      type: 'music',
      url: '',
      volume: 30,
      muted: false,
      solo: false,
      fadeIn: 1,
      fadeOut: 1,
      startTime: 0,
      duration: 0,
    },
  ]);

  const [masterVolume, setMasterVolume] = useState(100);
  const [masterMuted, setMasterMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showAddTrack, setShowAddTrack] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedTrackType, setSelectedTrackType] = useState<'voiceover' | 'music' | 'sfx'>('music');

  const addTrack = (type: 'voiceover' | 'music' | 'sfx', name: string, url: string) => {
    const newTrack: AudioTrack = {
      id: `track-${Date.now()}`,
      name,
      type,
      url,
      volume: type === 'voiceover' ? 80 : type === 'music' ? 30 : 50,
      muted: false,
      solo: false,
      fadeIn: type === 'music' ? 1 : 0,
      fadeOut: type === 'music' ? 1 : 0,
      startTime: 0,
      duration: 0,
    };
    setTracks([...tracks, newTrack]);
  };

  const removeTrack = (trackId: string) => {
    setTracks(tracks.filter((t) => t.id !== trackId));
  };

  const updateTrack = (trackId: string, updates: Partial<AudioTrack>) => {
    setTracks(tracks.map((t) => (t.id === trackId ? { ...t, ...updates } : t)));
  };

  const toggleMute = (trackId: string) => {
    setTracks(
      tracks.map((t) => (t.id === trackId ? { ...t, muted: !t.muted } : t))
    );
  };

  const toggleSolo = (trackId: string) => {
    const track = tracks.find((t) => t.id === trackId);
    if (!track) return;

    // If turning solo on, mute all others
    if (!track.solo) {
      setTracks(
        tracks.map((t) => ({
          ...t,
          solo: t.id === trackId,
          muted: t.id !== trackId,
        }))
      );
    } else {
      // If turning solo off, unmute all
      setTracks(tracks.map((t) => ({ ...t, solo: false, muted: false })));
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    addTrack(selectedTrackType, file.name, url);
    setShowAddTrack(false);
  };

  const exportMix = async () => {
    // In production, this would use Web Audio API to mix tracks and export
    alert('Export functionality would be implemented here using Web Audio API');
  };

  const getTrackIcon = (type: AudioTrack['type']) => {
    switch (type) {
      case 'voiceover':
        return <Mic className="h-5 w-5" />;
      case 'music':
        return <Music className="h-5 w-5" />;
      case 'sfx':
        return <Zap className="h-5 w-5" />;
    }
  };

  const getTrackColor = (type: AudioTrack['type']) => {
    switch (type) {
      case 'voiceover':
        return 'bg-blue-100 text-blue-600';
      case 'music':
        return 'bg-purple-100 text-purple-600';
      case 'sfx':
        return 'bg-green-100 text-green-600';
    }
  };

  return (
    <div className="flex h-full flex-col bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Multi-Track Audio Mixer</h2>
            <p className="text-sm text-gray-500">Mix voiceover, music, and sound effects</p>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowAddTrack(!showAddTrack)}
              className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
            >
              <Plus className="h-5 w-5" />
              <span>Add Track</span>
            </button>
            <button
              onClick={exportMix}
              className="flex items-center space-x-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
            >
              <Download className="h-5 w-5" />
              <span>Export Mix</span>
            </button>
          </div>
        </div>

        {/* Add Track Panel */}
        {showAddTrack && (
          <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
            <h3 className="mb-3 font-medium">Add New Track</h3>
            <div className="flex items-end space-x-3">
              <div className="flex-1">
                <label className="mb-1 block text-sm text-gray-700">Track Type</label>
                <select
                  value={selectedTrackType}
                  onChange={(e) => setSelectedTrackType(e.target.value as any)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                >
                  <option value="voiceover">Voiceover</option>
                  <option value="music">Background Music</option>
                  <option value="sfx">Sound Effects</option>
                </select>
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 rounded-lg bg-purple-600 px-4 py-2 text-white transition-colors hover:bg-purple-700"
              >
                <Upload className="h-5 w-5" />
                <span>Upload Audio</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>
          </div>
        )}
      </div>

      {/* Master Controls */}
      <div className="border-b border-gray-200 bg-white p-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-600 text-white transition-colors hover:bg-purple-700"
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
          </button>

          <div className="flex-1">
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-medium">Master Volume</span>
              <span className="text-gray-600">{masterVolume}%</span>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setMasterMuted(!masterMuted)}
                className={`transition-colors ${
                  masterMuted ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {masterMuted ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={masterVolume}
                onChange={(e) => setMasterVolume(Number(e.target.value))}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tracks */}
      <div className="flex-1 overflow-y-auto p-4">
        {tracks.length === 0 ? (
          <div className="flex h-full items-center justify-center text-gray-500">
            <div className="text-center">
              <Music className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p>No audio tracks yet</p>
              <button
                onClick={() => setShowAddTrack(true)}
                className="mt-3 text-purple-600 hover:text-purple-700"
              >
                Add your first track
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {tracks.map((track) => (
              <div key={track.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
                {/* Track Header */}
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`rounded-lg p-2 ${getTrackColor(track.type)}`}>
                      {getTrackIcon(track.type)}
                    </div>
                    <div>
                      <h4 className="font-medium">{track.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{track.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeTrack(track.id)}
                    className="text-red-600 transition-colors hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                {/* Waveform (if URL exists) */}
                {track.url && (
                  <div className="mb-3">
                    <AudioWaveformVisualization
                      audioUrl={track.url}
                      height={60}
                      color={track.type === 'voiceover' ? '#3B82F6' : track.type === 'music' ? '#8B5CF6' : '#10B981'}
                    />
                  </div>
                )}

                {/* Track Controls */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Volume */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Volume</label>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleMute(track.id)}
                        className={`transition-colors ${
                          track.muted ? 'text-red-600' : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        {track.muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={track.volume}
                        onChange={(e) => updateTrack(track.id, { volume: Number(e.target.value) })}
                        className="flex-1"
                        disabled={track.muted}
                      />
                      <span className="min-w-[3rem] text-sm text-gray-600">{track.volume}%</span>
                    </div>
                  </div>

                  {/* Solo */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Solo</label>
                    <button
                      onClick={() => toggleSolo(track.id)}
                      className={`w-full rounded border px-3 py-2 text-sm font-medium transition-colors ${
                        track.solo
                          ? 'border-yellow-500 bg-yellow-50 text-yellow-700'
                          : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {track.solo ? 'Soloed' : 'Solo'}
                    </button>
                  </div>

                  {/* Fade In */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Fade In (s)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={track.fadeIn}
                      onChange={(e) => updateTrack(track.id, { fadeIn: Number(e.target.value) })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>

                  {/* Fade Out */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Fade Out (s)</label>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={track.fadeOut}
                      onChange={(e) => updateTrack(track.id, { fadeOut: Number(e.target.value) })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>

                  {/* Start Time */}
                  <div>
                    <label className="mb-1 block text-sm text-gray-700">Start Time (s)</label>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      value={track.startTime}
                      onChange={(e) => updateTrack(track.id, { startTime: Number(e.target.value) })}
                      className="w-full rounded border border-gray-300 px-3 py-2"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Timeline Footer */}
      <div className="border-t border-gray-200 bg-white p-3">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{tracks.length} tracks</span>
          <span>Time: {currentTime.toFixed(1)}s</span>
        </div>
      </div>
    </div>
  );
}
