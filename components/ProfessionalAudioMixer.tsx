'use client';

import { useState } from 'react';
import { Volume2, Music, Mic, Headphones, Settings, Play, Pause, RotateCcw } from 'lucide-react';
import type { AudioMixerTrack } from '@/lib/types';

interface AudioTrack {
  id: string;
  name: string;
  type: 'voiceover' | 'music' | 'sfx' | 'master';
  volume: number; // 0-100
  muted: boolean;
  solo: boolean;
}

interface AudioMixerProps {
  tracks: AudioTrack[];
  onTrackUpdate: (id: string, updates: Partial<AudioTrack>) => void;
  onReset: () => void;
  audioSettings?: {
    fadeIn: number;
    fadeOut: number;
    ducking: boolean;
    duckingAmount: number;
    noiseReduction: boolean;
    normalize: boolean;
  };
  onSettingsUpdate?: (settings: any) => void;
}

export default function ProfessionalAudioMixer({
  tracks,
  onTrackUpdate,
  onReset,
  audioSettings = {
    fadeIn: 1,
    fadeOut: 1,
    ducking: true,
    duckingAmount: 30,
    noiseReduction: false,
    normalize: true,
  },
  onSettingsUpdate,
}: AudioMixerProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [localSettings, setLocalSettings] = useState(audioSettings);

  const getTrackIcon = (type: string) => {
    switch (type) {
      case 'voiceover':
        return <Mic className="w-4 h-4" />;
      case 'music':
        return <Music className="w-4 h-4" />;
      case 'sfx':
        return <Volume2 className="w-4 h-4" />;
      case 'master':
        return <Headphones className="w-4 h-4" />;
      default:
        return <Volume2 className="w-4 h-4" />;
    }
  };

  const handleVolumeChange = (id: string, volume: number) => {
    onTrackUpdate(id, { volume });
  };

  const handleMuteToggle = (id: string, currentlyMuted: boolean) => {
    onTrackUpdate(id, { muted: !currentlyMuted });
  };

  const handleSoloToggle = (id: string, currentlySolo: boolean) => {
    onTrackUpdate(id, { solo: !currentlySolo });
  };

  const handleSettingChange = (key: string, value: any) => {
    const updated = { ...localSettings, [key]: value };
    setLocalSettings(updated);
    onSettingsUpdate?.(updated);
  };

  const anySolo = tracks.some(t => t.solo);

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Headphones className="w-5 h-5 text-purple-600" />
            Audio Mixer
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Advanced
            </button>
            <button
              onClick={onReset}
              className="px-3 py-1.5 text-sm rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Advanced Settings */}
      {showAdvanced && (
        <div className="bg-white border-b border-gray-200 p-4 space-y-4">
          <h4 className="font-medium text-gray-900 mb-3">Advanced Audio Settings</h4>

          {/* Fade In/Out */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fade In Duration (seconds)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={localSettings.fadeIn}
                onChange={(e) => handleSettingChange('fadeIn', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Fade Out Duration (seconds)
              </label>
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                value={localSettings.fadeOut}
                onChange={(e) => handleSettingChange('fadeOut', parseFloat(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Audio Ducking */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                Audio Ducking (Lower music during voiceover)
              </label>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={localSettings.ducking}
                  onChange={(e) => handleSettingChange('ducking', e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            {localSettings.ducking && (
              <div>
                <label className="block text-xs text-gray-600 mb-1">
                  Ducking Amount: {localSettings.duckingAmount}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="70"
                  value={localSettings.duckingAmount}
                  onChange={(e) => handleSettingChange('duckingAmount', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
              </div>
            )}
          </div>

          {/* Noise Reduction */}
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-gray-700">
              Voice Noise Reduction
            </label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.noiseReduction}
                onChange={(e) => handleSettingChange('noiseReduction', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {/* Normalize Audio */}
          <div className="flex items-center justify-between">
            <div>
              <label className="text-sm font-medium text-gray-700">Audio Normalization</label>
              <p className="text-xs text-gray-500 mt-0.5">Automatically balance overall volume</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={localSettings.normalize}
                onChange={(e) => handleSettingChange('normalize', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>
        </div>
      )}

      {/* Mixer Tracks */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {tracks.map(track => {
            const isMuted = anySolo ? !track.solo : track.muted;
            
            return (
              <div
                key={track.id}
                className={`bg-white rounded-lg border-2 p-4 transition-all ${
                  track.type === 'master'
                    ? 'border-purple-600 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                } ${isMuted ? 'opacity-50' : ''}`}
              >
                {/* Track Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className={`p-2 rounded-lg ${
                      track.type === 'voiceover' ? 'bg-blue-100 text-blue-600' :
                      track.type === 'music' ? 'bg-purple-100 text-purple-600' :
                      track.type === 'sfx' ? 'bg-green-100 text-green-600' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {getTrackIcon(track.type)}
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-gray-900">{track.name}</h4>
                      <p className="text-xs text-gray-500 capitalize">{track.type}</p>
                    </div>
                  </div>
                </div>

                {/* Volume Fader */}
                <div className="mb-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-700">Volume</span>
                    <span className="text-xs font-bold text-purple-600">{track.volume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={track.volume}
                    onChange={(e) => handleVolumeChange(track.id, parseInt(e.target.value))}
                    disabled={isMuted}
                    className="w-full h-24 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-purple-600 slider-vertical"
                    style={{
                      WebkitAppearance: 'slider-vertical',
                    } as React.CSSProperties}
                  />
                  <div className="h-2 mt-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        isMuted ? 'bg-gray-400' : 'bg-purple-600'
                      }`}
                      style={{ width: `${track.volume}%` }}
                    />
                  </div>
                </div>

                {/* Controls */}
                {track.type !== 'master' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMuteToggle(track.id, track.muted)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        track.muted
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {track.muted ? 'Muted' : 'Mute'}
                    </button>
                    <button
                      onClick={() => handleSoloToggle(track.id, track.solo)}
                      className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        track.solo
                          ? 'bg-yellow-500 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {track.solo ? 'Solo' : 'Solo'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Meter/Info Bar */}
      <div className="bg-white border-t border-gray-200 p-3">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div className="flex gap-4">
            <span>Tracks: {tracks.filter(t => t.type !== 'master').length}</span>
            <span>Muted: {tracks.filter(t => t.muted).length}</span>
            <span>Solo: {tracks.filter(t => t.solo).length}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-gray-500">Master Volume:</span>
            <span className="font-bold text-purple-600">
              {tracks.find(t => t.type === 'master')?.volume || 100}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
