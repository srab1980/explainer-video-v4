'use client';

import { useStore } from '@/lib/store';
import { getLayoutConfig, applyLayoutToIllustrations } from '@/lib/layout-utils';
import type { Scene, LayoutType } from '@/lib/types';
import { Check } from 'lucide-react';

interface LayoutTabProps {
  scene: Scene;
}

const layoutOptions: Array<{ type: LayoutType; label: string; description: string }> = [
  { type: 'horizontal-row', label: 'Horizontal Row', description: 'Icons arranged in a horizontal line' },
  { type: 'vertical-stack', label: 'Vertical Stack', description: 'Icons stacked vertically' },
  { type: 'grid-2x2', label: '2x2 Grid', description: 'Icons in a 2x2 grid pattern' },
  { type: 'grid-3x3', label: '3x3 Grid', description: 'Icons in a 3x3 grid pattern' },
  { type: 'centered-large', label: 'Centered Large', description: 'One large central icon with smaller ones around' },
  { type: 'side-by-side', label: 'Side by Side', description: 'Two main icons side by side' },
  { type: 'scattered', label: 'Scattered', description: 'Icons scattered organically' },
  { type: 'editorial', label: 'Editorial', description: 'Magazine-style asymmetric layout' },
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

      <div className="grid grid-cols-2 gap-4">
        {layoutOptions.map((option) => (
          <button
            key={option.type}
            className={`relative p-4 border-2 rounded-lg text-left transition-all ${
              scene.layout === option.type
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => handleLayoutChange(option.type)}
          >
            {scene.layout === option.type && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-primary" />
              </div>
            )}
            <h4 className="font-medium text-foreground mb-1">{option.label}</h4>
            <p className="text-sm text-gray-600">{option.description}</p>

            {/* Visual Preview */}
            <div className="mt-3 h-20 bg-gray-100 rounded relative overflow-hidden">
              {getLayoutConfig(option.type, 4).positions.map((pos, index) => (
                <div
                  key={index}
                  className="absolute bg-primary rounded-full opacity-30"
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
  );
}
