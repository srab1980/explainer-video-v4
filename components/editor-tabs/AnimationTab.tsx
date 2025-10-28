'use client';

import { useStore } from '@/lib/store';
import type { Scene, AnimationType } from '@/lib/types';
import { Check, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimationTabProps {
  scene: Scene;
}

const animationOptions: Array<{ type: AnimationType; label: string; description: string }> = [
  { type: 'fade', label: 'Fade', description: 'Smooth fade in/out transition' },
  { type: 'slide', label: 'Slide', description: 'Slide in from the side' },
  { type: 'zoom', label: 'Zoom', description: 'Zoom in/out effect' },
  { type: 'bounce', label: 'Bounce', description: 'Bouncy spring animation' },
];

export default function AnimationTab({ scene }: AnimationTabProps) {
  const { updateScene } = useStore();

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-1">
          Choose Animation Type
        </h3>
        <p className="text-sm text-gray-600 mb-4">
          Select how the scene transitions in and out
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {animationOptions.map((option) => (
          <button
            key={option.type}
            className={`relative p-4 border-2 rounded-lg text-left transition-all ${
              scene.animation === option.type
                ? 'border-primary bg-primary bg-opacity-5'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => updateScene(scene.id, { animation: option.type })}
          >
            {scene.animation === option.type && (
              <div className="absolute top-2 right-2">
                <Check className="w-5 h-5 text-primary" />
              </div>
            )}
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-accent" />
              <h4 className="font-medium text-foreground">{option.label}</h4>
            </div>
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>

            {/* Animation Preview */}
            <div className="h-16 bg-gray-100 rounded relative overflow-hidden flex items-center justify-center">
              {option.type === 'fade' && (
                <motion.div
                  className="w-8 h-8 bg-primary rounded"
                  animate={{ opacity: [0, 1, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {option.type === 'slide' && (
                <motion.div
                  className="w-8 h-8 bg-primary rounded"
                  animate={{ x: [-20, 0, -20] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {option.type === 'zoom' && (
                <motion.div
                  className="w-8 h-8 bg-primary rounded"
                  animate={{ scale: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              )}
              {option.type === 'bounce' && (
                <motion.div
                  className="w-8 h-8 bg-primary rounded"
                  animate={{ y: [-10, 0, -10] }}
                  transition={{ duration: 1, repeat: Infinity, type: 'spring', bounce: 0.5 }}
                />
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
