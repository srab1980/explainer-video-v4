'use client';

import { useStore } from '@/lib/store';
import { getLayoutConfig, applyLayoutToIllustrations } from '@/lib/layout-utils';
import type { Scene, LayoutType } from '@/lib/types';
import { Check, Grid, Sparkles } from 'lucide-react';

interface LayoutTabProps {
  scene: Scene;
}

const layoutOptions: Array<{ type: LayoutType; label: string; description: string; category: 'basic' | 'smart' }> = [
  { type: 'horizontal-row', label: 'Horizontal Row', description: 'Icons arranged in a horizontal line', category: 'basic' },
  { type: 'vertical-stack', label: 'Vertical Stack', description: 'Icons stacked vertically', category: 'basic' },
  { type: 'grid-2x2', label: '2x2 Grid', description: 'Icons in a 2x2 grid pattern', category: 'basic' },
  { type: 'grid-3x3', label: '3x3 Grid', description: 'Icons in a 3x3 grid pattern', category: 'basic' },
  { type: 'centered-large', label: 'Centered Large', description: 'One large central icon with smaller ones around', category: 'basic' },
  { type: 'side-by-side', label: 'Side by Side', description: 'Two main icons side by side', category: 'basic' },
  { type: 'scattered', label: 'Scattered', description: 'Icons scattered organically', category: 'basic' },
  { type: 'editorial', label: 'Editorial', description: 'Magazine-style asymmetric layout', category: 'basic' },
  { type: 'golden-ratio', label: 'Golden Ratio', description: 'Professional composition using golden ratio', category: 'smart' },
  { type: 'rule-of-thirds', label: 'Rule of Thirds', description: 'Photography-inspired grid positioning', category: 'smart' },
];

export default function LayoutTab({ scene }: LayoutTabProps) {
  const { updateScene } = useStore();

  const handleLayoutChange = (layout: LayoutType) => {
    // Apply the layout to existing illustrations
    const updatedIllustrations = scene.illustrations.map((ill, index) => {
      const config = getLayoutConfig(layout, scene.illustrations.length);
      const position = config.positions[index];
      if (position) {
        return {
          ...ill,
          position: { x: position.x, y: position.y },
          size: position.size,
        };
      }
      return ill;
    });

    updateScene(scene.id, {
      layout,
      illustrations: updatedIllustrations,
    });
  };

  const basicLayouts = layoutOptions.filter(l => l.category === 'basic');
  const smartLayouts = layoutOptions.filter(l => l.category === 'smart');

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Choose Layout Style
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select how illustrations are positioned in the scene
        </p>
      </div>

      {/* Basic Layouts */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
          <Grid className="w-4 h-4" />
          Basic Layouts
        </h4>
        <div className="grid grid-cols-2 gap-4">
          {basicLayouts.map((option) => (
            <button
              key={option.type}
              className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                scene.layout === option.type
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => handleLayoutChange(option.type)}
            >
              {scene.layout === option.type && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <h4 className="font-medium text-foreground mb-1">{option.label}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>

              {/* Visual Preview */}
              <div className="mt-3 h-20 bg-gray-100 rounded relative overflow-hidden">
                {getLayoutConfig(option.type, 4).positions.map((pos, index) => (
                  <div
                    key={index}
                    className="absolute bg-purple-600 rounded-full opacity-30"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: `${pos.size / 5}px`,
                      height: `${pos.size / 5}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Smart Layouts */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h4 className="text-sm font-medium text-gray-700">Smart Layouts</h4>
          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
            Professional
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {smartLayouts.map((option) => (
            <button
              key={option.type}
              className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                scene.layout === option.type
                  ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              onClick={() => handleLayoutChange(option.type)}
            >
              {scene.layout === option.type && (
                <div className="absolute top-2 right-2">
                  <Check className="w-5 h-5 text-purple-600" />
                </div>
              )}
              <h4 className="font-medium text-foreground mb-1">{option.label}</h4>
              <p className="text-sm text-gray-600">{option.description}</p>

              {/* Visual Preview with guide lines */}
              <div className="mt-3 h-20 bg-gradient-to-br from-gray-50 to-gray-100 rounded relative overflow-hidden">
                {/* Guide lines for smart layouts */}
                {option.type === 'rule-of-thirds' && (
                  <>
                    <div className="absolute left-1/3 top-0 bottom-0 w-px bg-purple-300 opacity-30" />
                    <div className="absolute left-2/3 top-0 bottom-0 w-px bg-purple-300 opacity-30" />
                    <div className="absolute top-1/3 left-0 right-0 h-px bg-purple-300 opacity-30" />
                    <div className="absolute top-2/3 left-0 right-0 h-px bg-purple-300 opacity-30" />
                  </>
                )}
                {option.type === 'golden-ratio' && (
                  <>
                    <div className="absolute left-[61.8%] top-0 bottom-0 w-px bg-yellow-400 opacity-40" />
                    <div className="absolute top-[38.2%] left-0 right-0 h-px bg-yellow-400 opacity-40" />
                  </>
                )}

                {/* Position dots */}
                {getLayoutConfig(option.type, 4).positions.map((pos, index) => (
                  <div
                    key={index}
                    className="absolute bg-gradient-to-br from-purple-600 to-pink-600 rounded-full opacity-40"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                      width: `${pos.size / 5}px`,
                      height: `${pos.size / 5}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Smart layouts use professional composition principles for visually balanced scenes
        </p>
      </div>

      {/* Current Scene Info */}
      <div className="pt-4 border-t border-gray-200">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm">
          <p className="text-blue-900">
            <strong>Current scene:</strong> {scene.illustrations.length} illustration{scene.illustrations.length !== 1 ? 's' : ''} 
            {' '}using <strong>{scene.layout.replace('-', ' ')}</strong> layout
          </p>
        </div>
      </div>
    </div>
  );
}
