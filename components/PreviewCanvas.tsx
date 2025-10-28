'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
import * as LucideIcons from 'lucide-react';

const animationVariants = {
  fade: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slide: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  zoom: {
    initial: { scale: 0.5, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 1.5, opacity: 0 },
  },
  bounce: {
    initial: { y: -50, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { type: 'spring', bounce: 0.5 } },
    exit: { y: 50, opacity: 0 },
  },
};

export default function PreviewCanvas() {
  const { currentProject, selectScene, selectedSceneId } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const scenes = currentProject?.scenes.sort((a, b) => a.order - b.order) || [];
  const currentScene = scenes[currentIndex];

  useEffect(() => {
    if (selectedSceneId) {
      const index = scenes.findIndex((s) => s.id === selectedSceneId);
      if (index !== -1) {
        setCurrentIndex(index);
      }
    }
  }, [selectedSceneId, scenes]);

  useEffect(() => {
    if (!isPlaying || !currentScene) return;

    const timer = setTimeout(() => {
      if (currentIndex < scenes.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsPlaying(false);
      }
    }, currentScene.duration * 1000);

    return () => clearTimeout(timer);
  }, [isPlaying, currentIndex, currentScene, scenes.length]);

  const goToNext = () => {
    if (currentIndex < scenes.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setIsPlaying(false);
    }
  };

  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setIsPlaying(false);
    }
  };

  if (!currentScene) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-border p-8">
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-gray-500">No scenes to display</p>
        </div>
      </div>
    );
  }

  const IconComponent = (LucideIcons as any)[currentScene.illustrations[0]?.iconName] || LucideIcons.Circle;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Canvas */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            className="absolute inset-0"
            style={{ backgroundColor: currentScene.backgroundColor }}
            {...animationVariants[currentScene.animation]}
            transition={{ duration: 0.5 }}
          >
            {/* Illustrations */}
            <div className="relative w-full h-full">
              {currentScene.illustrations.map((illustration) => {
                const Icon = (LucideIcons as any)[illustration.iconName] || LucideIcons.Circle;
                return (
                  <motion.div
                    key={illustration.id}
                    className="absolute"
                    style={{
                      left: `${illustration.position.x}%`,
                      top: `${illustration.position.y}%`,
                      transform: `translate(-50%, -50%) rotate(${illustration.rotation}deg)`,
                      color: illustration.color,
                    }}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <Icon size={illustration.size} strokeWidth={1.5} />
                  </motion.div>
                );
              })}
            </div>

            {/* Text Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
              <motion.h3
                className="text-2xl font-bold mb-2"
                style={{ color: currentScene.textColor }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                {currentScene.title}
              </motion.h3>
              <motion.p
                className="text-lg"
                style={{ color: currentScene.textColor, opacity: 0.9 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {currentScene.voiceover}
              </motion.p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Scene Counter */}
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
          {currentIndex + 1} / {scenes.length}
        </div>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-foreground">{currentScene.title}</h3>
            <p className="text-sm text-gray-600">{currentScene.description}</p>
          </div>
          <button
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-opacity-90 transition-all"
            onClick={() => selectScene(currentScene.id)}
          >
            Edit Scene
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={goToNext}
            disabled={currentIndex === scenes.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${((currentIndex + 1) / scenes.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
