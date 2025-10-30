'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { AudioSettings, VoiceGender, VoiceStyle, SupportedLanguage } from '@/lib/types';
import { Volume2, Music, Mic, Play, Pause, Loader2, Check, AlertCircle } from 'lucide-react';

// OpenAI TTS voices
const VOICE_OPTIONS = [
  { id: 'alloy', name: 'Alloy', gender: 'neutral' as VoiceGender, description: 'Balanced and versatile' },
  { id: 'echo', name: 'Echo', gender: 'male' as VoiceGender, description: 'Clear and professional' },
  { id: 'fable', name: 'Fable', gender: 'male' as VoiceGender, description: 'Warm and engaging' },
  { id: 'onyx', name: 'Onyx', gender: 'male' as VoiceGender, description: 'Deep and authoritative' },
  { id: 'nova', name: 'Nova', gender: 'female' as VoiceGender, description: 'Energetic and friendly' },
  { id: 'shimmer', name: 'Shimmer', gender: 'female' as VoiceGender, description: 'Bright and cheerful' },
];

// Background music tracks (placeholder - would be actual audio files)
const MUSIC_TRACKS = [
  { id: 'upbeat-corporate', name: 'Upbeat Corporate', duration: 120, genre: 'corporate' },
  { id: 'tech-inspire', name: 'Tech & Inspire', duration: 150, genre: 'technology' },
  { id: 'calm-focus', name: 'Calm Focus', duration: 180, genre: 'ambient' },
  { id: 'energetic-promo', name: 'Energetic Promo', duration: 90, genre: 'promotional' },
  { id: 'minimal-modern', name: 'Minimal Modern', duration: 120, genre: 'minimal' },
];

export default function AudioProductionPanel() {
  const { currentProject, audioSettings, setAudioSettings, generateVoiceover } = useStore();
  
  const [localSettings, setLocalSettings] = useState<AudioSettings>(audioSettings || {
    voiceover: {
      enabled: true,
      voice: 'alloy',
      gender: 'neutral',
      style: 'professional',
      speed: 1.0,
      pitch: 0,
      volume: 80,
    },
    backgroundMusic: {
      enabled: false,
      volume: 30,
      fadeIn: 1,
      fadeOut: 1,
      loop: true,
    },
    soundEffects: {
      enabled: true,
      transitionSounds: true,
      volume: 50,
    },
  });

  const [isGeneratingPreview, setIsGeneratingPreview] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Volume2 className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a project first to configure audio</p>
      </div>
    );
  }

  const handleVoiceoverToggle = (enabled: boolean) => {
    const updated = { ...localSettings, voiceover: { ...localSettings.voiceover, enabled } };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleVoiceChange = (voice: string) => {
    const voiceInfo = VOICE_OPTIONS.find(v => v.id === voice);
    const updated = {
      ...localSettings,
      voiceover: {
        ...localSettings.voiceover,
        voice,
        gender: voiceInfo?.gender || 'neutral',
      },
    };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleSpeedChange = (speed: number) => {
    const updated = { ...localSettings, voiceover: { ...localSettings.voiceover, speed } };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleVoiceoverVolumeChange = (volume: number) => {
    const updated = { ...localSettings, voiceover: { ...localSettings.voiceover, volume } };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleMusicToggle = (enabled: boolean) => {
    const updated = { ...localSettings, backgroundMusic: { ...localSettings.backgroundMusic, enabled } };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleMusicVolumeChange = (volume: number) => {
    const updated = { ...localSettings, backgroundMusic: { ...localSettings.backgroundMusic, volume } };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleMusicSelect = (trackName: string) => {
    const updated = {
      ...localSettings,
      backgroundMusic: {
        ...localSettings.backgroundMusic,
        trackName,
        trackUrl: `/audio/${trackName}.mp3`, // Placeholder
      },
    };
    setLocalSettings(updated);
    setAudioSettings(updated);
  };

  const handleGeneratePreview = async () => {
    if (!currentProject.scenes || currentProject.scenes.length === 0) {
      setError('No scenes available to generate preview');
      return;
    }

    setIsGeneratingPreview(true);
    setError(null);

    try {
      const firstScene = currentProject.scenes[0];
      const text = firstScene.voiceover || firstScene.description;
      
      const audioUrl = await generateVoiceover(text, localSettings.voiceover.voice, 'en');
      setPreviewUrl(audioUrl);
    } catch (err: any) {
      setError(err.message || 'Failed to generate voiceover preview');
    } finally {
      setIsGeneratingPreview(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Audio Production</h2>
        <p className="mt-1 text-sm text-gray-600">Configure voiceover and background music</p>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Voiceover Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-blue-600" />
              <h3 className="font-semibold text-gray-900">AI Voiceover</h3>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={localSettings.voiceover.enabled}
                onChange={(e) => handleVoiceoverToggle(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300"></div>
            </label>
          </div>

          {localSettings.voiceover.enabled && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {/* Voice Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Voice Character
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {VOICE_OPTIONS.map((voice) => (
                    <button
                      key={voice.id}
                      onClick={() => handleVoiceChange(voice.id)}
                      className={`rounded-lg border p-3 text-left transition-colors ${
                        localSettings.voiceover.voice === voice.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <p className="text-sm font-medium text-gray-900">{voice.name}</p>
                      <p className="text-xs text-gray-600">{voice.description}</p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Speed Control */}
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Speaking Speed</span>
                  <span className="text-gray-600">{localSettings.voiceover.speed.toFixed(1)}x</span>
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="2.0"
                  step="0.1"
                  value={localSettings.voiceover.speed}
                  onChange={(e) => handleSpeedChange(parseFloat(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
                <div className="mt-1 flex justify-between text-xs text-gray-500">
                  <span>Slow (0.5x)</span>
                  <span>Fast (2.0x)</span>
                </div>
              </div>

              {/* Volume Control */}
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Voiceover Volume</span>
                  <span className="text-gray-600">{localSettings.voiceover.volume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.voiceover.volume}
                  onChange={(e) => handleVoiceoverVolumeChange(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
              </div>

              {/* Preview Button */}
              <button
                onClick={handleGeneratePreview}
                disabled={isGeneratingPreview}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-blue-500 bg-white px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 disabled:opacity-50"
              >
                {isGeneratingPreview ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating Preview...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Generate Preview
                  </>
                )}
              </button>

              {previewUrl && (
                <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                  <div className="flex items-center gap-2 text-sm text-green-900">
                    <Check className="h-4 w-4" />
                    <span>Preview generated successfully!</span>
                  </div>
                  <audio controls src={previewUrl} className="mt-2 w-full" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Background Music Section */}
        <div className="mb-8">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Music className="h-5 w-5 text-purple-600" />
              <h3 className="font-semibold text-gray-900">Background Music</h3>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={localSettings.backgroundMusic.enabled}
                onChange={(e) => handleMusicToggle(e.target.checked)}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-purple-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300"></div>
            </label>
          </div>

          {localSettings.backgroundMusic.enabled && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              {/* Music Track Selection */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Select Track
                </label>
                <div className="space-y-2">
                  {MUSIC_TRACKS.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => handleMusicSelect(track.id)}
                      className={`flex w-full items-center justify-between rounded-lg border p-3 text-left transition-colors ${
                        localSettings.backgroundMusic.trackName === track.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-300 bg-white hover:bg-gray-50'
                      }`}
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900">{track.name}</p>
                        <p className="text-xs text-gray-600 capitalize">{track.genre} • {track.duration}s</p>
                      </div>
                      {localSettings.backgroundMusic.trackName === track.id && (
                        <Check className="h-5 w-5 text-purple-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Music Volume */}
              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Music Volume</span>
                  <span className="text-gray-600">{localSettings.backgroundMusic.volume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.backgroundMusic.volume}
                  onChange={(e) => handleMusicVolumeChange(parseInt(e.target.value))}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
              </div>

              {/* Loop Option */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.backgroundMusic.loop}
                  onChange={(e) => {
                    const updated = {
                      ...localSettings,
                      backgroundMusic: { ...localSettings.backgroundMusic, loop: e.target.checked },
                    };
                    setLocalSettings(updated);
                    setAudioSettings(updated);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">Loop music throughout video</span>
              </label>
            </div>
          )}
        </div>

        {/* Sound Effects Section */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="h-5 w-5 text-green-600" />
              <h3 className="font-semibold text-gray-900">Sound Effects</h3>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={localSettings.soundEffects.enabled}
                onChange={(e) => {
                  const updated = {
                    ...localSettings,
                    soundEffects: { ...localSettings.soundEffects, enabled: e.target.checked },
                  };
                  setLocalSettings(updated);
                  setAudioSettings(updated);
                }}
                className="peer sr-only"
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-200 after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:border after:border-gray-300 after:bg-white after:transition-all after:content-[''] peer-checked:bg-green-600 peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300"></div>
            </label>
          </div>

          {localSettings.soundEffects.enabled && (
            <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={localSettings.soundEffects.transitionSounds}
                  onChange={(e) => {
                    const updated = {
                      ...localSettings,
                      soundEffects: { ...localSettings.soundEffects, transitionSounds: e.target.checked },
                    };
                    setLocalSettings(updated);
                    setAudioSettings(updated);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-gray-700">Transition sound effects</span>
              </label>

              <div>
                <label className="mb-2 flex items-center justify-between text-sm font-medium text-gray-700">
                  <span>Effects Volume</span>
                  <span className="text-gray-600">{localSettings.soundEffects.volume}%</span>
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={localSettings.soundEffects.volume}
                  onChange={(e) => {
                    const updated = {
                      ...localSettings,
                      soundEffects: { ...localSettings.soundEffects, volume: parseInt(e.target.value) },
                    };
                    setLocalSettings(updated);
                    setAudioSettings(updated);
                  }}
                  className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                />
              </div>
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              <span className="text-sm">{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
