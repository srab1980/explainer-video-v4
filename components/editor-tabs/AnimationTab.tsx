'use client';

import { useStore } from '@/lib/store';
import type { Scene, AnimationType } from '@/lib/types';
import { Check, Zap, Sparkles, Wind, GitBranch, Waves } from 'lucide-react';
import { motion } from 'framer-motion';

interface AnimationTabProps {
  scene: Scene;
}

const animationOptions: Array<{ type: AnimationType; label: string; description: string; icon: any; category: 'basic' | 'advanced' }> = [
  { type: 'fade', label: 'Fade', description: 'Smooth fade in/out transition', icon: Zap, category: 'basic' },
  { type: 'slide', label: 'Slide', description: 'Slide in from the side', icon: Wind, category: 'basic' },
  { type: 'zoom', label: 'Zoom', description: 'Zoom in/out effect', icon: Sparkles, category: 'basic' },
  { type: 'bounce', label: 'Bounce', description: 'Bouncy spring animation', icon: Waves, category: 'basic' },
  { type: 'morph', label: 'Morph', description: 'Transform with rotation and scale', icon: GitBranch, category: 'advanced' },
  { type: 'particle', label: 'Particle', description: 'Particle burst effect', icon: Sparkles, category: 'advanced' },
  { type: 'path', label: 'Path', description: 'Follow curved path', icon: GitBranch, category: 'advanced' },
  { type: 'physics', label: 'Physics', description: 'Physics-based spring motion', icon: Waves, category: 'advanced' },
];

export default function AnimationTab({ scene }: AnimationTabProps) {
  const { updateScene } = useStore();

  const basicAnimations = animationOptions.filter(a => a.category === 'basic');
  const advancedAnimations = animationOptions.filter(a => a.category === 'advanced');

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

      {/* Basic Animations */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Basic Animations</h4>
        <div className="grid grid-cols-2 gap-4">
          {basicAnimations.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                  scene.animation === option.type
                    ? 'border-purple-500 bg-purple-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => updateScene(scene.id, { animation: option.type })}
              >
                {scene.animation === option.type && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-purple-600" />
                  <h4 className="font-medium text-foreground">{option.label}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                {/* Animation Preview */}
                <div className="h-16 bg-gray-100 rounded relative overflow-hidden flex items-center justify-center">
                  {option.type === 'fade' && (
                    <motion.div
                      className="w-8 h-8 bg-purple-600 rounded"
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {option.type === 'slide' && (
                    <motion.div
                      className="w-8 h-8 bg-purple-600 rounded"
                      animate={{ x: [-20, 0, -20] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {option.type === 'zoom' && (
                    <motion.div
                      className="w-8 h-8 bg-purple-600 rounded"
                      animate={{ scale: [0.5, 1, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {option.type === 'bounce' && (
                    <motion.div
                      className="w-8 h-8 bg-purple-600 rounded"
                      animate={{ y: [-10, 0, -10] }}
                      transition={{ duration: 1, repeat: Infinity, type: 'spring', bounce: 0.5 }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advanced Animations */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <h4 className="text-sm font-medium text-gray-700">Advanced Animations</h4>
          <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full font-medium">
            New
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {advancedAnimations.map((option) => {
            const Icon = option.icon;
            return (
              <button
                key={option.type}
                className={`relative p-4 border-2 rounded-lg text-left transition-all ${
                  scene.animation === option.type
                    ? 'border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50'
                    : 'border-gray-200 hover:border-purple-300'
                }`}
                onClick={() => updateScene(scene.id, { animation: option.type })}
              >
                {scene.animation === option.type && (
                  <div className="absolute top-2 right-2">
                    <Check className="w-5 h-5 text-purple-600" />
                  </div>
                )}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-purple-600" />
                  <h4 className="font-medium text-foreground">{option.label}</h4>
                </div>
                <p className="text-sm text-gray-600 mb-3">{option.description}</p>

                {/* Animation Preview */}
                <div className="h-16 bg-gradient-to-br from-gray-50 to-gray-100 rounded relative overflow-hidden flex items-center justify-center">
                  {option.type === 'morph' && (
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded"
                      animate={{ 
                        scale: [0.5, 1, 0.5],
                        rotate: [-90, 0, -90]
                      }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  {option.type === 'particle' && (
                    <div className="relative">
                      {[0, 1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          className="absolute w-2 h-2 bg-purple-600 rounded-full"
                          animate={{
                            x: [0, Math.cos(i * Math.PI / 2) * 15],
                            y: [0, Math.sin(i * Math.PI / 2) * 15],
                            scale: [0, 1, 0],
                            opacity: [0, 1, 0]
                          }}
                          transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            delay: i * 0.1
                          }}
                        />
                      ))}
                    </div>
                  )}
                  {option.type === 'path' && (
                    <motion.div
                      className="w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full"
                      animate={{
                        x: [-15, 15, -15],
                        y: [0, -10, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  )}
                  {option.type === 'physics' && (
                    <motion.div
                      className="w-8 h-8 bg-gradient-to-br from-purple-600 to-pink-600 rounded"
                      animate={{
                        y: [-15, 0, -15],
                        rotate: [-5, 5, -5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        type: 'spring',
                        stiffness: 300,
                        damping: 10
                      }}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Duration Control */}
      <div className="pt-4 border-t border-gray-200">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Scene Duration</h4>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min="3"
            max="15"
            step="1"
            value={scene.duration}
            onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) })}
            className="flex-1"
          />
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="3"
              max="15"
              value={scene.duration}
              onChange={(e) => updateScene(scene.id, { duration: parseInt(e.target.value) })}
              className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
            />
            <span className="text-sm text-gray-600">seconds</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Optimal range: 3-10 seconds per scene for viewer engagement
        </p>
      </div>
    </div>
  );
}
