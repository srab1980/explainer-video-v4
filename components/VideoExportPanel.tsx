'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { VideoRenderConfig, VideoFormat, VideoQuality, VideoPlatform, PlatformSpec } from '@/lib/types';
import { Download, Settings, Play, Loader2, Check, AlertCircle, Video, Film } from 'lucide-react';

// Platform specifications
const PLATFORM_SPECS: Record<VideoPlatform, PlatformSpec> = {
  youtube: {
    platform: 'youtube',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    maxDuration: 600, // 10 minutes
    recommendedBitrate: '8000k',
    recommendedFormat: 'mp4',
  },
  instagram: {
    platform: 'instagram',
    aspectRatio: '1:1',
    width: 1080,
    height: 1080,
    maxDuration: 60,
    recommendedBitrate: '3500k',
    recommendedFormat: 'mp4',
  },
  linkedin: {
    platform: 'linkedin',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    maxDuration: 600,
    recommendedBitrate: '5000k',
    recommendedFormat: 'mp4',
  },
  'instagram-story': {
    platform: 'instagram-story',
    aspectRatio: '9:16',
    width: 1080,
    height: 1920,
    maxDuration: 15,
    recommendedBitrate: '3500k',
    recommendedFormat: 'mp4',
  },
  twitter: {
    platform: 'twitter',
    aspectRatio: '16:9',
    width: 1280,
    height: 720,
    maxDuration: 140,
    recommendedBitrate: '5000k',
    recommendedFormat: 'mp4',
  },
  custom: {
    platform: 'custom',
    aspectRatio: '16:9',
    width: 1920,
    height: 1080,
    maxDuration: 3600,
    recommendedBitrate: '8000k',
    recommendedFormat: 'mp4',
  },
};

export default function VideoExportPanel() {
  const { currentProject, currentRenderJob, isRendering, renderProgress, startVideoRender, checkRenderStatus } = useStore();
  
  const [selectedPlatform, setSelectedPlatform] = useState<VideoPlatform>('youtube');
  const [selectedFormat, setSelectedFormat] = useState<VideoFormat>('mp4');
  const [selectedQuality, setSelectedQuality] = useState<VideoQuality>('1080p');
  const [includeSubtitles, setIncludeSubtitles] = useState(false);
  const [includeProgressBar, setIncludeProgressBar] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  if (!currentProject) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Video className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Create a storyboard first to export video</p>
      </div>
    );
  }

  const scenes = currentProject.scenes || [];
  if (scenes.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <Film className="mx-auto mb-3 h-12 w-12 text-gray-400" />
        <p>Add scenes to your storyboard to export video</p>
      </div>
    );
  }

  const platformSpec = PLATFORM_SPECS[selectedPlatform];
  const totalDuration = scenes.reduce((sum, scene) => sum + (scene.duration || 5), 0);

  const handleExportVideo = async () => {
    setError(null);
    
    try {
      const config: VideoRenderConfig = {
        format: selectedFormat,
        quality: selectedQuality,
        platform: selectedPlatform,
        customDimensions: platformSpec.platform === 'custom' ? { width: platformSpec.width, height: platformSpec.height } : undefined,
        fps: 30,
        codec: 'h264',
        bitrate: platformSpec.recommendedBitrate,
        audio: {
          voiceover: {
            enabled: true,
            voice: 'alloy', // OpenAI TTS default
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
        },
        includeSubtitles,
        subtitleLanguage: includeSubtitles ? 'en' : undefined,
        includeProgressBar,
        customIntro: {
          enabled: false,
          duration: 3,
        },
        customOutro: {
          enabled: false,
          duration: 3,
        },
      };

      await startVideoRender(config);
    } catch (err: any) {
      setError(err.message || 'Failed to start video render');
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="border-b border-gray-200 p-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Export Video</h2>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            Advanced
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-6">
        {/* Project Info */}
        <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-gray-600">Scenes</p>
              <p className="text-lg font-semibold text-gray-900">{scenes.length}</p>
            </div>
            <div>
              <p className="text-gray-600">Duration</p>
              <p className="text-lg font-semibold text-gray-900">{totalDuration}s</p>
            </div>
            <div>
              <p className="text-gray-600">Resolution</p>
              <p className="text-lg font-semibold text-gray-900">
                {platformSpec.width}x{platformSpec.height}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Export Platform
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(Object.keys(PLATFORM_SPECS) as VideoPlatform[]).map((platform) => (
              <button
                key={platform}
                onClick={() => setSelectedPlatform(platform)}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  selectedPlatform === platform
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <p className="text-sm font-medium capitalize">
                  {platform.replace('-', ' ')}
                </p>
                <p className="mt-1 text-xs text-gray-500">
                  {PLATFORM_SPECS[platform].aspectRatio}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Quality Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Video Quality
          </label>
          <div className="grid grid-cols-4 gap-3">
            {(['480p', '720p', '1080p', '4k'] as VideoQuality[]).map((quality) => (
              <button
                key={quality}
                onClick={() => setSelectedQuality(quality)}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  selectedQuality === quality
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <p className="text-sm font-medium">{quality.toUpperCase()}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Format Selection */}
        <div className="mb-6">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Output Format
          </label>
          <div className="grid grid-cols-3 gap-3">
            {(['mp4', 'webm', 'mov'] as VideoFormat[]).map((format) => (
              <button
                key={format}
                onClick={() => setSelectedFormat(format)}
                className={`rounded-lg border p-3 text-center transition-colors ${
                  selectedFormat === format
                    ? 'border-blue-500 bg-blue-50 text-blue-900'
                    : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                <p className="text-sm font-medium uppercase">{format}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Options */}
        <div className="mb-6 space-y-3">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeSubtitles}
              onChange={(e) => setIncludeSubtitles(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Subtitles</span>
          </label>
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={includeProgressBar}
              onChange={(e) => setIncludeProgressBar(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Include Progress Bar</span>
          </label>
        </div>

        {/* Render Progress */}
        {isRendering && currentRenderJob && (
          <div className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900">
                {currentRenderJob.currentStep}
              </span>
              <span className="text-sm text-blue-700">{renderProgress}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-blue-200">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${renderProgress}%` }}
              />
            </div>
            {currentRenderJob.estimatedTimeRemaining && (
              <p className="mt-2 text-xs text-blue-700">
                Estimated time remaining: {Math.ceil(currentRenderJob.estimatedTimeRemaining / 60)} minutes
              </p>
            )}
          </div>
        )}

        {/* Success Message */}
        {currentRenderJob?.status === 'completed' && currentRenderJob.outputUrl && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2 text-green-900">
              <Check className="h-5 w-5" />
              <span className="font-medium">Video exported successfully!</span>
            </div>
            <a
              href={currentRenderJob.outputUrl}
              download
              className="mt-3 inline-flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
            >
              <Download className="h-4 w-4" />
              Download Video
            </a>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2 text-red-900">
              <AlertCircle className="h-5 w-5" />
              <span className="font-medium">{error}</span>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-gray-200 p-4">
        <button
          onClick={handleExportVideo}
          disabled={isRendering || scenes.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-3 font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isRendering ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Rendering Video...
            </>
          ) : (
            <>
              <Play className="h-5 w-5" />
              Export Video
            </>
          )}
        </button>
        <p className="mt-2 text-center text-xs text-gray-500">
          Estimated time: {Math.ceil(totalDuration / 2)} - {Math.ceil(totalDuration)} minutes
        </p>
      </div>
    </div>
  );
}
