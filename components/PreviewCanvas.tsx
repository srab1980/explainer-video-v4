'use client';

import { useState, useEffect } from 'react';
import { useStore } from '@/lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Play, Pause, Sparkles, Maximize, X } from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import type { IllustrationAnimation, IllustrationAnimationType } from '@/lib/types';

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
  morph: {
    initial: { scale: 0.3, rotate: -180, opacity: 0 },
    animate: { scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', duration: 0.8 } },
    exit: { scale: 0.3, rotate: 180, opacity: 0 },
  },
  particle: {
    initial: { scale: 0, opacity: 0, y: 20 },
    animate: { scale: [0, 1.2, 1], opacity: [0, 1, 1], y: 0, transition: { duration: 0.6 } },
    exit: { scale: 0, opacity: 0, y: -20 },
  },
  path: {
    initial: { x: -100, y: -100, opacity: 0 },
    animate: { 
      x: [null, 50, 0], 
      y: [null, -50, 0], 
      opacity: 1, 
      transition: { duration: 1, ease: 'easeInOut' } 
    },
    exit: { x: 100, y: 100, opacity: 0 },
  },
  physics: {
    initial: { y: -200, opacity: 0, rotate: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      rotate: [0, -10, 10, -5, 5, 0],
      transition: { type: 'spring', stiffness: 300, damping: 15 } 
    },
    exit: { y: 200, opacity: 0, rotate: 180 },
  },
};

// Helper function to create animation variants from IllustrationAnimation
const createIllustrationAnimationVariant = (animation: IllustrationAnimation) => {
  const { type, duration, easing, repeat, scaleParams, rotationParams, opacityParams, transformParams, effectsParams } = animation;
  
  // Map easing to framer-motion easing
  const easingMap: Record<string, any> = {
    'linear': 'linear',
    'ease-in': 'easeIn',
    'ease-out': 'easeOut',
    'ease-in-out': 'easeInOut',
    'spring': { type: 'spring', stiffness: 300, damping: 20 },
    'bounce': { type: 'spring', bounce: 0.5 },
    'elastic': { type: 'spring', stiffness: 100, damping: 10 }
  };
  
  const ease = easingMap[easing] || 'easeInOut';
  const repeatConfig = repeat === 'loop' ? Infinity : repeat === 'ping-pong' ? Infinity : 0;
  const repeatType = repeat === 'ping-pong' ? 'reverse' : 'loop';
  
  // Base transition config
  const transition: any = {
    duration,
    ease,
    repeat: repeatConfig,
    repeatType: repeatType as any
  };

  // Create animation based on type
  switch (type) {
    // Scale animations
    case 'scale-grow':
      return {
        initial: { scale: scaleParams?.from || 0.5 },
        animate: { scale: scaleParams?.to || 1 },
        transition
      };
    case 'scale-shrink':
      return {
        initial: { scale: scaleParams?.from || 1 },
        animate: { scale: scaleParams?.to || 0.5 },
        transition
      };
    case 'scale-pulse':
      return {
        initial: { scale: 1 },
        animate: { scale: [1, scaleParams?.to || 1.1, 1] },
        transition: { ...transition, repeat: Infinity }
      };
    case 'scale-breathe':
      return {
        initial: { scale: 1 },
        animate: { scale: [1, scaleParams?.to || 1.05, 1] },
        transition: { ...transition, duration: duration * 2, repeat: Infinity, repeatType: 'reverse' }
      };
    
    // Rotation animations
    case 'rotate-spin':
      return {
        initial: { rotate: 0 },
        animate: { rotate: rotationParams?.to || 360 },
        transition: { ...transition, repeat: Infinity, ease: 'linear' }
      };
    case 'rotate-wobble':
      return {
        initial: { rotate: 0 },
        animate: { rotate: [0, rotationParams?.to || 10, 0, rotationParams?.from || -10, 0] },
        transition: { ...transition, repeat: Infinity }
      };
    case 'rotate-tilt':
      return {
        initial: { rotate: 0 },
        animate: { rotate: rotationParams?.to || 15 },
        transition
      };
    case 'rotate-flip':
      return {
        initial: { rotateY: 0 },
        animate: { rotateY: 180 },
        transition
      };
    
    // Opacity animations
    case 'opacity-fade-in':
      return {
        initial: { opacity: opacityParams?.from || 0 },
        animate: { opacity: opacityParams?.to || 1 },
        transition
      };
    case 'opacity-fade-out':
      return {
        initial: { opacity: opacityParams?.from || 1 },
        animate: { opacity: opacityParams?.to || 0 },
        transition
      };
    case 'opacity-shimmer':
      return {
        initial: { opacity: 1 },
        animate: { opacity: [1, 0.5, 1] },
        transition: { ...transition, repeat: Infinity, duration: duration / 2 }
      };
    case 'opacity-ghost':
      return {
        initial: { opacity: 1 },
        animate: { opacity: [1, 0.3, 1] },
        transition: { ...transition, repeat: Infinity }
      };
    
    // Transform animations
    case 'transform-slide-in':
      const slideInDirection = transformParams?.direction || 'left';
      const slideInDistance = transformParams?.distance || 100;
      return {
        initial: { 
          x: slideInDirection === 'left' ? -slideInDistance : slideInDirection === 'right' ? slideInDistance : 0,
          y: slideInDirection === 'up' ? -slideInDistance : slideInDirection === 'down' ? slideInDistance : 0,
          opacity: 0
        },
        animate: { x: 0, y: 0, opacity: 1 },
        transition
      };
    case 'transform-slide-out':
      const slideOutDirection = transformParams?.direction || 'right';
      const slideOutDistance = transformParams?.distance || 100;
      return {
        initial: { x: 0, y: 0, opacity: 1 },
        animate: { 
          x: slideOutDirection === 'left' ? -slideOutDistance : slideOutDirection === 'right' ? slideOutDistance : 0,
          y: slideOutDirection === 'up' ? -slideOutDistance : slideOutDirection === 'down' ? slideOutDistance : 0,
          opacity: 0
        },
        transition
      };
    case 'transform-bounce':
      return {
        initial: { y: 0 },
        animate: { y: [0, -30, 0] },
        transition: { ...transition, repeat: Infinity }
      };
    case 'transform-elastic':
      return {
        initial: { scale: 0 },
        animate: { scale: 1 },
        transition: { ...transition, type: 'spring', stiffness: 200, damping: 10 }
      };
    
    // Continuous animations
    case 'continuous-float':
      return {
        initial: { y: 0 },
        animate: { y: [-10, 10, -10] },
        transition: { ...transition, repeat: Infinity, ease: 'easeInOut' }
      };
    case 'continuous-rotate':
      return {
        initial: { rotate: 0 },
        animate: { rotate: 360 },
        transition: { ...transition, repeat: Infinity, ease: 'linear' }
      };
    case 'continuous-pulse':
      return {
        initial: { scale: 1 },
        animate: { scale: [1, 1.1, 1] },
        transition: { ...transition, repeat: Infinity }
      };
    
    // Effects animations (use filters)
    case 'effects-glow':
      return {
        initial: { filter: 'drop-shadow(0 0 0px rgba(147, 51, 234, 0))' },
        animate: { 
          filter: [
            'drop-shadow(0 0 0px rgba(147, 51, 234, 0))',
            `drop-shadow(0 0 ${effectsParams?.radius || 20}px rgba(147, 51, 234, 0.8))`,
            'drop-shadow(0 0 0px rgba(147, 51, 234, 0))'
          ]
        },
        transition: { ...transition, repeat: Infinity }
      };
    case 'effects-shadow':
      return {
        initial: { filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))' },
        animate: { 
          filter: [
            'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))',
            `drop-shadow(${effectsParams?.radius || 10}px ${effectsParams?.radius || 10}px 20px rgba(0,0,0,0.5))`,
            'drop-shadow(2px 2px 4px rgba(0,0,0,0.2))'
          ]
        },
        transition: { ...transition, repeat: Infinity }
      };
    case 'effects-blur':
      return {
        initial: { filter: 'blur(0px)' },
        animate: { filter: [`blur(0px)`, `blur(${effectsParams?.radius || 5}px)`, `blur(0px)`] },
        transition: { ...transition, repeat: Infinity }
      };
    case 'effects-sharpen':
      return {
        initial: { filter: 'contrast(1)' },
        animate: { filter: ['contrast(1)', 'contrast(1.5)', 'contrast(1)'] },
        transition: { ...transition, repeat: Infinity }
      };
    
    default:
      return {
        initial: {},
        animate: {},
        transition
      };
  }
};

export default function PreviewCanvas() {
  const { currentProject, selectScene, selectedSceneId } = useStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

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

  // Check if scene has AI-generated images
  const hasAIImages = currentScene.illustrations.some(ill => ill.type === 'ai-generated');

  // Get animation variant based on scene animation type
  const animationVariant = animationVariants[currentScene.animation] || animationVariants.fade;

  return (
    <div className="bg-white rounded-xl shadow-lg border border-border overflow-hidden">
      {/* Canvas */}
      <div className="relative aspect-video bg-gray-900 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentScene.id}
            className="absolute inset-0"
            style={{ 
              background: currentScene.backgroundGradient 
                ? `linear-gradient(${currentScene.backgroundGradient.angle || 180}deg, ${currentScene.backgroundGradient.colors.join(', ')})`
                : currentScene.backgroundColor 
            }}
            {...animationVariant}
            transition={{ duration: 0.5 }}
          >
            {/* Illustrations */}
            <div className="relative w-full h-full">
              {currentScene.illustrations
                .filter(ill => ill.layer?.visible !== false)
                .sort((a, b) => (a.layer?.zIndex || 0) - (b.layer?.zIndex || 0))
                .map((illustration, idx) => {
                  // Get custom animation params or use scene default
                  const illustrationAnimation = illustration.animationParams?.type 
                    ? animationVariants[illustration.animationParams.type] 
                    : animationVariant;

                  const delay = illustration.animationParams?.delay || (idx * 0.1);
                  const duration = illustration.animationParams?.duration || 0.3;

                  // Get illustration-specific animations
                  const illustrationAnimations = illustration.illustrationAnimations || [];
                  
                  // If there are illustration-specific animations, use the first one (primary)
                  // In the future, we could layer multiple animations
                  const primaryAnimation = illustrationAnimations.length > 0 
                    ? createIllustrationAnimationVariant(illustrationAnimations[0])
                    : null;

                  // Use primary animation if available, otherwise use scene animation
                  const finalAnimation = primaryAnimation || illustrationAnimation;
                  const finalDelay = primaryAnimation 
                    ? (illustrationAnimations[0].delay || 0)
                    : delay;
                  const finalDuration = primaryAnimation 
                    ? (illustrationAnimations[0].duration || 1)
                    : duration;

                  return (
                    <motion.div
                      key={illustration.id}
                      className="absolute"
                      style={{
                        left: `${illustration.position.x}%`,
                        top: `${illustration.position.y}%`,
                        transform: `translate(-50%, -50%) rotate(${illustration.rotation}deg)`,
                        opacity: (illustration.layer?.opacity || 100) / 100,
                        zIndex: illustration.layer?.zIndex || 0,
                      }}
                      initial={finalAnimation.initial}
                      animate={finalAnimation.animate}
                      transition={{ 
                        ...(('transition' in finalAnimation && finalAnimation.transition) || {}),
                        delay: finalDelay,
                        duration: finalDuration
                      }}
                    >
                      {illustration.type === 'ai-generated' && (illustration.imageUrl || illustration.transparentImageUrl) ? (
                        <div className="relative group">
                          <img
                            src={illustration.transparentBackground?.enabled && illustration.transparentImageUrl 
                              ? illustration.transparentImageUrl 
                              : illustration.imageUrl}
                            alt={illustration.imagePrompt || 'AI generated illustration'}
                            style={{
                              width: `${illustration.size}px`,
                              height: `${illustration.size}px`,
                              objectFit: 'contain',
                              filter: illustration.effects?.shadow 
                                ? `drop-shadow(${illustration.effects.shadow.offsetX}px ${illustration.effects.shadow.offsetY}px ${illustration.effects.shadow.blur}px ${illustration.effects.shadow.color})`
                                : undefined,
                            }}
                            className="rounded-lg"
                          />
                          {/* AI Badge */}
                          <div className="absolute -top-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <div className="bg-purple-600 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              AI
                            </div>
                          </div>
                          {/* Transparent Background Badge */}
                          {illustration.transparentBackground?.enabled && illustration.transparentImageUrl && (
                            <div className="absolute -bottom-2 -right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <div className="bg-green-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                                PNG
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        (() => {
                          const Icon = (LucideIcons as any)[illustration.iconName || 'Circle'] || LucideIcons.Circle;
                          return (
                            <Icon 
                              size={illustration.size} 
                              strokeWidth={1.5}
                              style={{
                                color: illustration.color,
                                filter: illustration.effects?.shadow 
                                  ? `drop-shadow(${illustration.effects.shadow.offsetX}px ${illustration.effects.shadow.offsetY}px ${illustration.effects.shadow.blur}px ${illustration.effects.shadow.color})`
                                  : illustration.effects?.glow
                                  ? `drop-shadow(0 0 ${illustration.effects.glow.size}px ${illustration.effects.glow.color})`
                                  : undefined,
                              }}
                            />
                          );
                        })()
                      )}
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
        <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
          {currentIndex + 1} / {scenes.length}
          {hasAIImages && (
            <Sparkles className="w-3 h-3 text-purple-300" />
          )}
        </div>

        {/* Style Badge */}
        {currentScene.defaultIllustrationStyle && hasAIImages && (
          <div className="absolute top-4 right-16 bg-purple-600/90 text-white px-3 py-1 rounded-full text-xs font-medium">
            {currentScene.defaultIllustrationStyle.replace('-', ' ')}
          </div>
        )}

        {/* Fullscreen Button */}
        <button
          className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
          onClick={() => setIsFullscreen(true)}
          title="View fullscreen"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      {/* Controls */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-4">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              {currentScene.title}
              {hasAIImages && (
                <span className="px-2 py-0.5 text-xs bg-purple-100 text-purple-700 rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  AI Enhanced
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-600">{currentScene.description}</p>
          </div>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-medium"
            onClick={() => selectScene(currentScene.id)}
          >
            Edit Scene
          </button>
        </div>

        {/* Navigation */}
        <div className="flex items-center gap-4">
          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={goToPrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsPlaying(!isPlaying)}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5" />
            )}
          </button>

          <button
            className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            onClick={goToNext}
            disabled={currentIndex === scenes.length - 1}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ width: 0 }}
                animate={{ width: `${((currentIndex + 1) / scenes.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          <div className="text-sm text-gray-600">
            {currentScene.duration}s
          </div>
        </div>
      </div>

      {/* Fullscreen Preview Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex flex-col">
            
            {/* Close Button */}
            <button
              className="absolute top-4 right-4 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all z-10"
              onClick={() => setIsFullscreen(false)}
            >
              <X className="w-6 h-6" />
            </button>

            {/* Fullscreen Canvas */}
            <div className="flex-1 relative aspect-video mx-8 mt-8 bg-gray-900 rounded-lg overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentScene.id}
                  className="absolute inset-0"
                  style={{ 
                    background: currentScene.backgroundGradient 
                      ? `linear-gradient(${currentScene.backgroundGradient.angle || 180}deg, ${currentScene.backgroundGradient.colors.join(', ')})`
                      : currentScene.backgroundColor 
                  }}
                  {...animationVariant}
                  transition={{ duration: 0.5 }}
                >
                  {/* Illustrations */}
                  <div className="relative w-full h-full">
                    {currentScene.illustrations
                      .filter(ill => ill.layer?.visible !== false)
                      .sort((a, b) => (a.layer?.zIndex || 0) - (b.layer?.zIndex || 0))
                      .map((illustration, idx) => {
                        const illustrationAnimation = illustration.animationParams?.type 
                          ? animationVariants[illustration.animationParams.type] 
                          : animationVariant;

                        const delay = illustration.animationParams?.delay || (idx * 0.1);
                        const duration = illustration.animationParams?.duration || 0.3;

                        // Get illustration-specific animations (fullscreen view)
                        const illustrationAnimations = illustration.illustrationAnimations || [];
                        const primaryAnimation = illustrationAnimations.length > 0 
                          ? createIllustrationAnimationVariant(illustrationAnimations[0])
                          : null;

                        const finalAnimation = primaryAnimation || illustrationAnimation;
                        const finalDelay = primaryAnimation 
                          ? (illustrationAnimations[0].delay || 0)
                          : delay;
                        const finalDuration = primaryAnimation 
                          ? (illustrationAnimations[0].duration || 1)
                          : duration;

                        return (
                          <motion.div
                            key={illustration.id}
                            className="absolute"
                            style={{
                              left: `${illustration.position.x}%`,
                              top: `${illustration.position.y}%`,
                              transform: `translate(-50%, -50%) rotate(${illustration.rotation}deg)`,
                              opacity: (illustration.layer?.opacity || 100) / 100,
                              zIndex: illustration.layer?.zIndex || 0,
                            }}
                            initial={finalAnimation.initial}
                            animate={finalAnimation.animate}
                            transition={{ 
                              ...(('transition' in finalAnimation && finalAnimation.transition) || {}),
                              delay: finalDelay,
                              duration: finalDuration
                            }}
                          >
                            {illustration.type === 'ai-generated' && (illustration.imageUrl || illustration.transparentImageUrl) ? (
                              <div className="relative group">
                                <img
                                  src={illustration.transparentBackground?.enabled && illustration.transparentImageUrl 
                                    ? illustration.transparentImageUrl 
                                    : illustration.imageUrl}
                                  alt={illustration.imagePrompt || 'AI generated illustration'}
                                  style={{
                                    width: `${illustration.size * 1.5}px`,
                                    height: `${illustration.size * 1.5}px`,
                                    objectFit: 'contain',
                                    filter: illustration.effects?.shadow 
                                      ? `drop-shadow(${illustration.effects.shadow.offsetX}px ${illustration.effects.shadow.offsetY}px ${illustration.effects.shadow.blur}px ${illustration.effects.shadow.color})`
                                      : undefined,
                                  }}
                                  className="rounded-lg"
                                />
                                {/* AI Badge */}
                                <div className="absolute -top-3 -right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <div className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                    <Sparkles className="w-4 h-4" />
                                    AI
                                  </div>
                                </div>
                              </div>
                            ) : (
                              (() => {
                                const Icon = (LucideIcons as any)[illustration.iconName || 'Circle'] || LucideIcons.Circle;
                                return (
                                  <Icon 
                                    size={illustration.size * 1.5} 
                                    strokeWidth={1.5}
                                    style={{
                                      color: illustration.color,
                                      filter: illustration.effects?.shadow 
                                        ? `drop-shadow(${illustration.effects.shadow.offsetX}px ${illustration.effects.shadow.offsetY}px ${illustration.effects.shadow.blur}px ${illustration.effects.shadow.color})`
                                        : illustration.effects?.glow
                                        ? `drop-shadow(0 0 ${illustration.effects.glow.size}px ${illustration.effects.glow.color})`
                                        : undefined,
                                    }}
                                  />
                                );
                              })()
                            )}
                          </motion.div>
                        );
                      })}
                  </div>

                  {/* Text Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-12">
                    <motion.h3
                      className="text-4xl font-bold mb-4"
                      style={{ color: currentScene.textColor }}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      {currentScene.title}
                    </motion.h3>
                    <motion.p
                      className="text-2xl"
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
            </div>

            {/* Scene Info */}
            <div className="mx-8 mb-8 mt-4 bg-black/50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-white text-xl font-semibold">{currentScene.title}</h4>
                  <p className="text-gray-300 text-sm">{currentScene.description}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">
                    {currentIndex + 1} of {scenes.length}
                  </span>
                  <span className="text-gray-300 text-sm">
                    {currentScene.duration}s
                  </span>
                  {hasAIImages && (
                    <span className="px-3 py-1 bg-purple-600/90 text-white rounded-full text-sm flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      AI Enhanced
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
