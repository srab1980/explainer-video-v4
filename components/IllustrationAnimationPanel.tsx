'use client';

import React, { useState } from 'react';
import {
  IllustrationAnimation,
  IllustrationAnimationType,
  EasingFunction,
  RepeatMode,
  AnimationTrigger,
  TransparentBackgroundConfig,
  BackgroundRemovalMethod
} from '@/lib/types';
import { Sparkles, Play, Trash2, Plus, Settings } from 'lucide-react';

interface IllustrationAnimationPanelProps {
  illustrationId: string;
  animations: IllustrationAnimation[];
  transparentBgConfig?: TransparentBackgroundConfig;
  onAddAnimation: (animation: Omit<IllustrationAnimation, 'id'>) => void;
  onUpdateAnimation: (animationId: string, updates: Partial<IllustrationAnimation>) => void;
  onRemoveAnimation: (animationId: string) => void;
  onUpdateTransparentBg: (config: TransparentBackgroundConfig) => void;
  onPreviewAnimation: (animationId: string) => void;
}

const animationTypes: { value: IllustrationAnimationType; label: string; category: string }[] = [
  // Scale animations
  { value: 'scale-grow', label: 'Grow', category: 'Scale' },
  { value: 'scale-shrink', label: 'Shrink', category: 'Scale' },
  { value: 'scale-pulse', label: 'Pulse', category: 'Scale' },
  { value: 'scale-breathe', label: 'Breathe', category: 'Scale' },
  
  // Rotation animations
  { value: 'rotate-spin', label: 'Spin', category: 'Rotation' },
  { value: 'rotate-wobble', label: 'Wobble', category: 'Rotation' },
  { value: 'rotate-tilt', label: 'Tilt', category: 'Rotation' },
  { value: 'rotate-flip', label: 'Flip', category: 'Rotation' },
  
  // Opacity animations
  { value: 'opacity-fade-in', label: 'Fade In', category: 'Opacity' },
  { value: 'opacity-fade-out', label: 'Fade Out', category: 'Opacity' },
  { value: 'opacity-shimmer', label: 'Shimmer', category: 'Opacity' },
  { value: 'opacity-ghost', label: 'Ghost', category: 'Opacity' },
  
  // Transform animations
  { value: 'transform-slide-in', label: 'Slide In', category: 'Transform' },
  { value: 'transform-slide-out', label: 'Slide Out', category: 'Transform' },
  { value: 'transform-bounce', label: 'Bounce', category: 'Transform' },
  { value: 'transform-elastic', label: 'Elastic', category: 'Transform' },
  
  // Continuous animations
  { value: 'continuous-float', label: 'Float', category: 'Continuous' },
  { value: 'continuous-rotate', label: 'Rotate', category: 'Continuous' },
  { value: 'continuous-pulse', label: 'Pulse', category: 'Continuous' },
  
  // Effects
  { value: 'effects-glow', label: 'Glow', category: 'Effects' },
  { value: 'effects-shadow', label: 'Shadow', category: 'Effects' },
  { value: 'effects-blur', label: 'Blur', category: 'Effects' },
  { value: 'effects-sharpen', label: 'Sharpen', category: 'Effects' }
];

const easingFunctions: EasingFunction[] = [
  'linear', 'ease-in', 'ease-out', 'ease-in-out', 'spring', 'bounce', 'elastic'
];

const repeatModes: RepeatMode[] = ['none', 'loop', 'ping-pong'];
const triggers: AnimationTrigger[] = ['auto', 'hover', 'click', 'timeline'];
const bgRemovalMethods: BackgroundRemovalMethod[] = ['ai-based', 'color-based', 'edge-based', 'manual'];

export default function IllustrationAnimationPanel({
  illustrationId,
  animations,
  transparentBgConfig,
  onAddAnimation,
  onUpdateAnimation,
  onRemoveAnimation,
  onUpdateTransparentBg,
  onPreviewAnimation
}: IllustrationAnimationPanelProps) {
  const [activeTab, setActiveTab] = useState<'animations' | 'transparent'>('animations');
  const [selectedAnimation, setSelectedAnimation] = useState<string | null>(null);
  const [showAddAnimation, setShowAddAnimation] = useState(false);
  
  // New animation form state
  const [newAnimationType, setNewAnimationType] = useState<IllustrationAnimationType>('scale-pulse');
  const [newDuration, setNewDuration] = useState(1);
  const [newDelay, setNewDelay] = useState(0);
  const [newEasing, setNewEasing] = useState<EasingFunction>('ease-in-out');
  const [newRepeat, setNewRepeat] = useState<RepeatMode>('loop');
  const [newTrigger, setNewTrigger] = useState<AnimationTrigger>('auto');

  const handleAddAnimation = () => {
    const animation: Omit<IllustrationAnimation, 'id'> = {
      type: newAnimationType,
      duration: newDuration,
      delay: newDelay,
      easing: newEasing,
      repeat: newRepeat,
      trigger: newTrigger
    };
    
    onAddAnimation(animation);
    setShowAddAnimation(false);
    
    // Reset form
    setNewAnimationType('scale-pulse');
    setNewDuration(1);
    setNewDelay(0);
    setNewEasing('ease-in-out');
    setNewRepeat('loop');
    setNewTrigger('auto');
  };

  const groupedAnimationTypes = animationTypes.reduce((acc, anim) => {
    if (!acc[anim.category]) {
      acc[anim.category] = [];
    }
    acc[anim.category].push(anim);
    return acc;
  }, {} as Record<string, typeof animationTypes>);

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex gap-2 border-b border-gray-700">
        <button
          onClick={() => setActiveTab('animations')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'animations'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Animations
        </button>
        <button
          onClick={() => setActiveTab('transparent')}
          className={`px-4 py-2 font-medium transition-colors ${
            activeTab === 'transparent'
              ? 'text-purple-400 border-b-2 border-purple-400'
              : 'text-gray-400 hover:text-gray-300'
          }`}
        >
          Transparent Background
        </button>
      </div>

      {/* Animations Tab */}
      {activeTab === 'animations' && (
        <div className="space-y-4">
          {/* Add Animation Button */}
          <button
            onClick={() => setShowAddAnimation(!showAddAnimation)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Animation
          </button>

          {/* Add Animation Form */}
          {showAddAnimation && (
            <div className="bg-gray-800 rounded-lg p-4 space-y-4">
              <h3 className="font-semibold text-white">New Animation</h3>
              
              {/* Animation Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Animation Type
                </label>
                <select
                  value={newAnimationType}
                  onChange={(e) => setNewAnimationType(e.target.value as IllustrationAnimationType)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  {Object.entries(groupedAnimationTypes).map(([category, anims]) => (
                    <optgroup key={category} label={category}>
                      {anims.map((anim) => (
                        <option key={anim.value} value={anim.value}>
                          {anim.label}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
              </div>

              {/* Duration and Delay */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Duration (s)
                  </label>
                  <input
                    type="number"
                    value={newDuration}
                    onChange={(e) => setNewDuration(parseFloat(e.target.value))}
                    min="0.1"
                    max="10"
                    step="0.1"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Delay (s)
                  </label>
                  <input
                    type="number"
                    value={newDelay}
                    onChange={(e) => setNewDelay(parseFloat(e.target.value))}
                    min="0"
                    max="10"
                    step="0.1"
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Easing */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Easing
                </label>
                <select
                  value={newEasing}
                  onChange={(e) => setNewEasing(e.target.value as EasingFunction)}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  {easingFunctions.map((easing) => (
                    <option key={easing} value={easing}>
                      {easing}
                    </option>
                  ))}
                </select>
              </div>

              {/* Repeat and Trigger */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Repeat
                  </label>
                  <select
                    value={newRepeat}
                    onChange={(e) => setNewRepeat(e.target.value as RepeatMode)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  >
                    {repeatModes.map((mode) => (
                      <option key={mode} value={mode}>
                        {mode}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Trigger
                  </label>
                  <select
                    value={newTrigger}
                    onChange={(e) => setNewTrigger(e.target.value as AnimationTrigger)}
                    className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                  >
                    {triggers.map((trigger) => (
                      <option key={trigger} value={trigger}>
                        {trigger}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => setShowAddAnimation(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddAnimation}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Add Animation
                </button>
              </div>
            </div>
          )}

          {/* Animation List */}
          <div className="space-y-2">
            {animations.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                No animations added yet. Click "Add Animation" to get started.
              </div>
            ) : (
              animations.map((animation) => (
                <div
                  key={animation.id}
                  className="bg-gray-800 rounded-lg p-4 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-purple-400" />
                        <span className="font-medium text-white">
                          {animationTypes.find(t => t.value === animation.type)?.label || animation.type}
                        </span>
                      </div>
                      <div className="text-sm text-gray-400 mt-1">
                        {animation.duration}s • {animation.easing} • {animation.repeat}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onPreviewAnimation(animation.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded transition-colors"
                        title="Preview"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onRemoveAnimation(animation.id)}
                        className="p-2 bg-red-600 hover:bg-red-700 text-white rounded transition-colors"
                        title="Remove"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Transparent Background Tab */}
      {activeTab === 'transparent' && (
        <div className="space-y-4">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between bg-gray-800 rounded-lg p-4">
            <span className="font-medium text-white">Enable Transparent Background</span>
            <button
              onClick={() => onUpdateTransparentBg({
                ...transparentBgConfig,
                enabled: !transparentBgConfig?.enabled,
                method: transparentBgConfig?.method || 'ai-based'
              })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                transparentBgConfig?.enabled ? 'bg-purple-600' : 'bg-gray-600'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  transparentBgConfig?.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {transparentBgConfig?.enabled && (
            <>
              {/* Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Removal Method
                </label>
                <select
                  value={transparentBgConfig.method}
                  onChange={(e) => onUpdateTransparentBg({
                    ...transparentBgConfig,
                    method: e.target.value as BackgroundRemovalMethod
                  })}
                  className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                >
                  {bgRemovalMethods.map((method) => (
                    <option key={method} value={method}>
                      {method.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </option>
                  ))}
                </select>
              </div>

              {/* Color-based settings */}
              {transparentBgConfig.method === 'color-based' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Target Color
                    </label>
                    <input
                      type="color"
                      value={transparentBgConfig.targetColor || '#FFFFFF'}
                      onChange={(e) => onUpdateTransparentBg({
                        ...transparentBgConfig,
                        targetColor: e.target.value
                      })}
                      className="w-full h-10 rounded border border-gray-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Tolerance: {transparentBgConfig.tolerance || 30}
                    </label>
                    <input
                      type="range"
                      value={transparentBgConfig.tolerance || 30}
                      onChange={(e) => onUpdateTransparentBg({
                        ...transparentBgConfig,
                        tolerance: parseInt(e.target.value)
                      })}
                      min="0"
                      max="100"
                      className="w-full"
                    />
                  </div>
                </div>
              )}

              {/* Edge-based settings */}
              {transparentBgConfig.method === 'edge-based' && (
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Edge Threshold: {transparentBgConfig.edgeThreshold || 50}
                  </label>
                  <input
                    type="range"
                    value={transparentBgConfig.edgeThreshold || 50}
                    onChange={(e) => onUpdateTransparentBg({
                      ...transparentBgConfig,
                      edgeThreshold: parseInt(e.target.value)
                    })}
                    min="0"
                    max="100"
                    className="w-full"
                  />
                </div>
              )}

              {/* AI-based settings */}
              {transparentBgConfig.method === 'ai-based' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      AI Model
                    </label>
                    <select
                      value={transparentBgConfig.aiModel || 'standard'}
                      onChange={(e) => onUpdateTransparentBg({
                        ...transparentBgConfig,
                        aiModel: e.target.value as 'standard' | 'high-quality'
                      })}
                      className="w-full bg-gray-700 text-white rounded px-3 py-2 border border-gray-600 focus:border-purple-500 focus:outline-none"
                    >
                      <option value="standard">Standard</option>
                      <option value="high-quality">High Quality</option>
                    </select>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-300">Preserve Details</span>
                    <button
                      onClick={() => onUpdateTransparentBg({
                        ...transparentBgConfig,
                        preserveDetails: !transparentBgConfig.preserveDetails
                      })}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        transparentBgConfig.preserveDetails ? 'bg-purple-600' : 'bg-gray-600'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          transparentBgConfig.preserveDetails ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              )}

              {/* Post-processing options */}
              <div className="space-y-4 pt-4 border-t border-gray-700">
                <h4 className="font-medium text-white">Post-Processing</h4>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-300">Smooth Edges</span>
                  <button
                    onClick={() => onUpdateTransparentBg({
                      ...transparentBgConfig,
                      smoothEdges: !transparentBgConfig.smoothEdges
                    })}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      transparentBgConfig.smoothEdges ? 'bg-purple-600' : 'bg-gray-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        transparentBgConfig.smoothEdges ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {transparentBgConfig.smoothEdges && (
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Feather Amount: {transparentBgConfig.featherAmount || 0}px
                    </label>
                    <input
                      type="range"
                      value={transparentBgConfig.featherAmount || 0}
                      onChange={(e) => onUpdateTransparentBg({
                        ...transparentBgConfig,
                        featherAmount: parseInt(e.target.value)
                      })}
                      min="0"
                      max="20"
                      className="w-full"
                    />
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
