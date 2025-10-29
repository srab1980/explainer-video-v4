'use client';

import { useState, useMemo, useEffect } from 'react';
import { useStore } from '@/lib/store';
import type { Scene, IllustrationStyle, VisualEffects } from '@/lib/types';
import * as LucideIcons from 'lucide-react';
import { Search, Plus, Trash2, Wand2, Layers, Sparkles, AlertCircle, X, ZoomIn, ZoomOut, RotateCw, ChevronLeft, ChevronRight } from 'lucide-react';
import Fuse from 'fuse.js';

interface IllustrationTabProps {
  scene: Scene;
}

// Get available Lucide icons
const lucideIconNames = Object.keys(LucideIcons).filter(
  (name) => name !== 'createLucideIcon' && name !== 'default'
);

const ILLUSTRATION_STYLES: Array<{ value: IllustrationStyle; label: string; description: string }> = [
  { value: 'modern-flat', label: 'Modern Flat', description: 'Clean, minimalist, geometric shapes' },
  { value: 'hand-drawn', label: 'Hand-Drawn', description: 'Sketch-like, artistic, organic' },
  { value: 'corporate', label: 'Corporate', description: 'Professional, polished, business' },
  { value: 'custom', label: 'Custom', description: 'Your own style description' },
];

export default function IllustrationTab({ scene }: IllustrationTabProps) {
  const { 
    updateIllustration, 
    addIllustration, 
    deleteIllustration,
    generateAIIllustration,
    isGeneratingImage,
    currentProject,
    selectedIllustrationIds,
    selectIllustrations,
    batchUpdateIllustrations,
  } = useStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIllustrationId, setSelectedIllustrationId] = useState<string | null>(null);
  const [showAIGenerator, setShowAIGenerator] = useState(false);
  const [aiPrompt, setAIPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<IllustrationStyle>('modern-flat');
  const [customStyleDesc, setCustomStyleDesc] = useState('');
  const [showEffectsPanel, setShowEffectsPanel] = useState(false);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{ illustration: any; index: number } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);

  // Fuzzy search setup
  const fuse = useMemo(
    () =>
      new Fuse(lucideIconNames, {
        threshold: 0.3,
        keys: [''],
      }),
    []
  );

  const filteredIcons = useMemo(() => {
    if (!searchQuery) return lucideIconNames.slice(0, 100);
    return fuse.search(searchQuery).map((result) => result.item).slice(0, 100);
  }, [searchQuery, fuse]);

  const handleAddIllustration = (iconName: string) => {
    addIllustration(scene.id, {
      type: 'icon',
      iconName,
      iconLibrary: 'lucide',
      position: { x: 50, y: 50 },
      size: 80,
      color: '#8B5CF6',
      rotation: 0,
      layer: {
        zIndex: scene.illustrations.length,
        locked: false,
        visible: true,
        opacity: 100,
      },
    });
  };

  const handleGenerateAI = async () => {
    if (!aiPrompt.trim()) return;
    
    setGenerationError(null);
    try {
      await generateAIIllustration(
        scene.id, 
        aiPrompt, 
        selectedStyle,
        selectedStyle === 'custom' ? customStyleDesc : undefined
      );
      setAIPrompt('');
      setShowAIGenerator(false);
    } catch (error: any) {
      setGenerationError(error.message || 'Failed to generate image');
    }
  };

  const handleOpenFullscreen = (illustration: any, index: number) => {
    setFullscreenImage({ illustration, index });
    setZoomLevel(100);
    setRotation(0);
  };

  const handleCloseFullscreen = () => {
    setFullscreenImage(null);
    setZoomLevel(100);
    setRotation(0);
  };

  const handlePrevious = () => {
    if (fullscreenImage && scene.illustrations.length > 1) {
      const newIndex = (fullscreenImage.index - 1 + scene.illustrations.length) % scene.illustrations.length;
      setFullscreenImage({
        illustration: scene.illustrations[newIndex],
        index: newIndex
      });
      setZoomLevel(100);
      setRotation(0);
    }
  };

  const handleNext = () => {
    if (fullscreenImage && scene.illustrations.length > 1) {
      const newIndex = (fullscreenImage.index + 1) % scene.illustrations.length;
      setFullscreenImage({
        illustration: scene.illustrations[newIndex],
        index: newIndex
      });
      setZoomLevel(100);
      setRotation(0);
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 400));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 25));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const selectedIllustration = scene.illustrations.find(
    (ill) => ill.id === selectedIllustrationId
  );

  const usageInfo = currentProject?.usageTracking;

  // Keyboard event handling for fullscreen modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenImage) return;
      
      switch (e.key) {
        case 'Escape':
          handleCloseFullscreen();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlePrevious();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleNext();
          break;
        case '+':
        case '=':
          e.preventDefault();
          handleZoomIn();
          break;
        case '-':
          e.preventDefault();
          handleZoomOut();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          handleRotate();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreenImage, scene.illustrations.length]);

  return (
    <div className="space-y-6">
      {/* Usage Tracking */}
      {usageInfo && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span className="text-sm text-blue-900">
            AI Images Generated: <strong>{usageInfo.dalleGenerations}</strong> total
          </span>
        </div>
      )}

      {/* AI Generator Button */}
      <div className="flex gap-2">
        <button
          className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all flex items-center justify-center gap-2 font-medium shadow-lg"
          onClick={() => setShowAIGenerator(!showAIGenerator)}
          disabled={isGeneratingImage}
        >
          <Wand2 className="w-5 h-5" />
          {isGeneratingImage ? 'Generating...' : 'Generate AI Illustration'}
        </button>
      </div>

      {/* AI Generator Panel */}
      {showAIGenerator && (
        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4 space-y-4">
          <h4 className="font-semibold text-purple-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            AI Illustration Generator
          </h4>

          {/* Style Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Illustration Style
            </label>
            <div className="grid grid-cols-2 gap-2">
              {ILLUSTRATION_STYLES.map((style) => (
                <button
                  key={style.value}
                  className={`p-3 rounded-lg border-2 text-left transition-all ${
                    selectedStyle === style.value
                      ? 'border-purple-500 bg-purple-100'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setSelectedStyle(style.value)}
                >
                  <div className="font-medium text-sm">{style.label}</div>
                  <div className="text-xs text-gray-600 mt-1">{style.description}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Style Description */}
          {selectedStyle === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Custom Style Description
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="e.g., watercolor painting style, soft colors..."
                value={customStyleDesc}
                onChange={(e) => setCustomStyleDesc(e.target.value)}
              />
            </div>
          )}

          {/* Prompt Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What do you want to illustrate?
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
              placeholder="e.g., a person using a smartphone, team collaboration, rocket launching..."
              rows={3}
              value={aiPrompt}
              onChange={(e) => setAIPrompt(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Tip: Scene context - {scene.description}
            </p>
          </div>

          {/* Error Display */}
          {generationError && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Generation Failed</p>
                <p className="text-xs text-red-700 mt-1">{generationError}</p>
              </div>
            </div>
          )}

          {/* Generate Button */}
          <button
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleGenerateAI}
            disabled={isGeneratingImage || !aiPrompt.trim() || (selectedStyle === 'custom' && !customStyleDesc.trim())}
          >
            {isGeneratingImage ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Generating with DALL-E 3...
              </span>
            ) : (
              'Generate Image'
            )}
          </button>
        </div>
      )}

      {/* Current Illustrations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Layers className="w-5 h-5" />
          Current Illustrations ({scene.illustrations.length})
        </h3>
        {scene.illustrations.length === 0 ? (
          <p className="text-sm text-gray-600 py-4 text-center bg-muted rounded-lg">
            No illustrations yet. Generate AI images or add icons from the library below.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {scene.illustrations.map((illustration, index) => {
              const isSelected = selectedIllustrationId === illustration.id;
              return (
                <div
                  key={illustration.id}
                  className={`relative p-4 border-2 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Click to select illustration */}
                  <div 
                    className="cursor-pointer w-full"
                    onClick={() => setSelectedIllustrationId(illustration.id)}
                  >
                  {/* Type Badge */}
                  <div className="absolute top-2 left-2">
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                      illustration.type === 'ai-generated'
                        ? 'bg-purple-100 text-purple-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {illustration.type === 'ai-generated' ? 'AI' : 'Icon'}
                    </span>
                  </div>

                  {/* Illustration Display */}
                  <div className="w-full h-24 flex items-center justify-center relative group">
                    {/* Click to view fullscreen */}
                    <div 
                      className="w-full h-full flex items-center justify-center cursor-pointer"
                      onClick={() => handleOpenFullscreen(illustration, index)}
                    >
                      {illustration.type === 'ai-generated' && illustration.imageUrl ? (
                        <img
                          src={illustration.imageUrl}
                          alt={illustration.imagePrompt || 'AI generated'}
                          className="max-w-full max-h-full object-contain rounded hover:scale-105 transition-transform"
                        />
                      ) : (
                        (() => {
                          const Icon = (LucideIcons as any)[illustration.iconName || 'Circle'] || LucideIcons.Circle;
                          return (
                            <Icon
                              size={40}
                              style={{ color: illustration.color }}
                              strokeWidth={1.5}
                              className="hover:scale-110 transition-transform"
                            />
                          );
                        })()
                      )}
                    </div>
                    
                    {/* Fullscreen Button */}
                    <button
                      className="absolute top-1 right-1 p-1 bg-black bg-opacity-50 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity hover:bg-opacity-70"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenFullscreen(illustration, index);
                      }}
                      title="View fullscreen"
                    >
                      <ZoomIn className="w-3 h-3" />
                    </button>
                  </div>

                  <span className="text-xs text-gray-600 truncate w-full text-center">
                    {illustration.type === 'ai-generated' 
                      ? `AI: ${illustration.style}` 
                      : illustration.iconName}
                  </span>

                  {/* Delete Button */}
                  <button
                    className="absolute top-2 right-2 p-1 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteIllustration(scene.id, illustration.id);
                      if (selectedIllustrationId === illustration.id) {
                        setSelectedIllustrationId(null);
                      }
                    }}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>

                    {/* Layer Controls */}
                    {illustration.layer && !illustration.layer.visible && (
                      <div className="absolute bottom-2 left-2">
                        <span className="px-2 py-0.5 text-xs bg-gray-600 text-white rounded-full">
                          Hidden
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Illustration Editor */}
      {selectedIllustration && (
        <div className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-foreground">Edit Illustration</h4>
            <button
              className="px-3 py-1 text-sm bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
              onClick={() => setShowEffectsPanel(!showEffectsPanel)}
            >
              {showEffectsPanel ? 'Basic' : 'Effects'}
            </button>
          </div>

          {!showEffectsPanel ? (
            <>
              {/* Basic Controls */}
              {/* Size */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Size: {selectedIllustration.size}px
                </label>
                <input
                  type="range"
                  min="40"
                  max={selectedIllustration.type === 'ai-generated' ? '600' : '200'}
                  step="10"
                  value={selectedIllustration.size}
                  onChange={(e) =>
                    updateIllustration(scene.id, selectedIllustration.id, {
                      size: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Color (for icons) */}
              {selectedIllustration.type === 'icon' && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Color
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-16 h-10 rounded-lg border border-border cursor-pointer"
                      value={selectedIllustration.color}
                      onChange={(e) =>
                        updateIllustration(scene.id, selectedIllustration.id, {
                          color: e.target.value,
                        })
                      }
                    />
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 font-mono text-sm"
                      value={selectedIllustration.color}
                      onChange={(e) =>
                        updateIllustration(scene.id, selectedIllustration.id, {
                          color: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              )}

              {/* Rotation */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Rotation: {selectedIllustration.rotation}°
                </label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  step="15"
                  value={selectedIllustration.rotation}
                  onChange={(e) =>
                    updateIllustration(scene.id, selectedIllustration.id, {
                      rotation: parseInt(e.target.value),
                    })
                  }
                  className="w-full"
                />
              </div>

              {/* Position */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    X: {selectedIllustration.position.x.toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedIllustration.position.x}
                    onChange={(e) =>
                      updateIllustration(scene.id, selectedIllustration.id, {
                        position: {
                          ...selectedIllustration.position,
                          x: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Y: {selectedIllustration.position.y.toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    step="1"
                    value={selectedIllustration.position.y}
                    onChange={(e) =>
                      updateIllustration(scene.id, selectedIllustration.id, {
                        position: {
                          ...selectedIllustration.position,
                          y: parseInt(e.target.value),
                        },
                      })
                    }
                    className="w-full"
                  />
                </div>
              </div>

              {/* Layer Controls */}
              {selectedIllustration.layer && (
                <div className="pt-4 border-t border-gray-300">
                  <h5 className="text-sm font-medium text-foreground mb-3">Layer Settings</h5>
                  
                  <div className="grid grid-cols-2 gap-3">
                    {/* Opacity */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Opacity: {selectedIllustration.layer.opacity}%
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={selectedIllustration.layer.opacity}
                        onChange={(e) =>
                          updateIllustration(scene.id, selectedIllustration.id, {
                            layer: {
                              ...selectedIllustration.layer!,
                              opacity: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>

                    {/* Z-Index */}
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Layer: {selectedIllustration.layer.zIndex}
                      </label>
                      <input
                        type="range"
                        min="0"
                        max="10"
                        value={selectedIllustration.layer.zIndex}
                        onChange={(e) =>
                          updateIllustration(scene.id, selectedIllustration.id, {
                            layer: {
                              ...selectedIllustration.layer!,
                              zIndex: parseInt(e.target.value),
                            },
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  </div>

                  {/* Toggle Controls */}
                  <div className="flex gap-2 mt-3">
                    <button
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedIllustration.layer.visible
                          ? 'bg-green-100 text-green-700 hover:bg-green-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      onClick={() =>
                        updateIllustration(scene.id, selectedIllustration.id, {
                          layer: {
                            ...selectedIllustration.layer!,
                            visible: !selectedIllustration.layer!.visible,
                          },
                        })
                      }
                    >
                      {selectedIllustration.layer.visible ? 'Visible' : 'Hidden'}
                    </button>
                    <button
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors ${
                        selectedIllustration.layer.locked
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                      }`}
                      onClick={() =>
                        updateIllustration(scene.id, selectedIllustration.id, {
                          layer: {
                            ...selectedIllustration.layer!,
                            locked: !selectedIllustration.layer!.locked,
                          },
                        })
                      }
                    >
                      {selectedIllustration.layer.locked ? 'Locked' : 'Unlocked'}
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Advanced visual effects coming soon: shadows, glows, gradients, and more!
              </p>
              {/* Effects panel will be expanded in future iterations */}
            </div>
          )}
        </div>
      )}

      {/* Icon Library */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3">
          Icon Library ({filteredIcons.length} available)
        </h3>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Search icons... (e.g. heart, user, star)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-8 gap-2 max-h-80 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
          {filteredIcons.map((iconName) => {
            const Icon = (LucideIcons as any)[iconName];
            if (!Icon) return null;
            return (
              <button
                key={iconName}
                className="p-3 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                onClick={() => handleAddIllustration(iconName)}
                title={iconName}
              >
                <Icon className="w-6 h-6 text-gray-600 group-hover:text-purple-600" strokeWidth={1.5} />
              </button>
            );
          })}
        </div>
      </div>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              handleCloseFullscreen();
            }
          }}
        >
          <div className="relative w-full h-full flex items-center justify-center p-4">
            
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
              onClick={handleCloseFullscreen}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Navigation Buttons */}
            {scene.illustrations.length > 1 && (
              <>
                <button
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
                  onClick={handlePrevious}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
                  onClick={handleNext}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <button
                className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 25}
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <span className="px-3 py-2 bg-black bg-opacity-50 text-white rounded text-sm">
                {zoomLevel}%
              </span>
              <button
                className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 400}
              >
                <ZoomIn className="w-5 h-5" />
              </button>
              <button
                className="p-2 bg-black bg-opacity-50 text-white rounded hover:bg-opacity-70 transition-all"
                onClick={handleRotate}
              >
                <RotateCw className="w-5 h-5" />
              </button>
            </div>

            {/* Image Counter */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-2 bg-black bg-opacity-50 text-white rounded text-sm">
              {fullscreenImage.index + 1} of {scene.illustrations.length}
            </div>

            {/* Image Display */}
            <div className="max-w-full max-h-full flex items-center justify-center overflow-hidden">
              {fullscreenImage.illustration.type === 'ai-generated' && fullscreenImage.illustration.imageUrl ? (
                <img
                  src={fullscreenImage.illustration.imageUrl}
                  alt={fullscreenImage.illustration.imagePrompt || 'AI generated'}
                  className="max-w-full max-h-full object-contain transition-transform duration-300"
                  style={{ 
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    maxWidth: zoomLevel > 100 ? 'none' : '100%',
                    maxHeight: zoomLevel > 100 ? 'none' : '100%'
                  }}
                  draggable={false}
                />
              ) : (
                (() => {
                  const Icon = (LucideIcons as any)[fullscreenImage.illustration.iconName || 'Circle'] || LucideIcons.Circle;
                  return (
                    <Icon
                      size={Math.min(400, zoomLevel * 4)}
                      style={{ 
                        color: fullscreenImage.illustration.color,
                        transform: `rotate(${rotation}deg)`,
                        filter: `brightness(${zoomLevel / 100})`
                      }}
                      strokeWidth={1.5}
                    />
                  );
                })()
              )}
            </div>

            {/* Image Info */}
            <div className="absolute bottom-4 right-4 max-w-xs">
              <div className="bg-black bg-opacity-50 text-white p-3 rounded-lg text-sm">
                <div className="font-medium mb-1">
                  {fullscreenImage.illustration.type === 'ai-generated' 
                    ? `AI Generated (${fullscreenImage.illustration.style})` 
                    : fullscreenImage.illustration.iconName}
                </div>
                {fullscreenImage.illustration.type === 'ai-generated' && fullscreenImage.illustration.imagePrompt && (
                  <div className="text-gray-300 text-xs">{fullscreenImage.illustration.imagePrompt}</div>
                )}
                <div className="text-gray-400 text-xs mt-1">
                  Size: {fullscreenImage.illustration.size}px | Rotation: {fullscreenImage.illustration.rotation}°
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
