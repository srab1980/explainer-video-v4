import type { LayoutType, LayoutConfig } from './types';

// Golden ratio constant
const PHI = 1.618033988749895;

export const getLayoutConfig = (type: LayoutType, count: number = 4): LayoutConfig => {
  const configs: Record<LayoutType, LayoutConfig> = {
    'horizontal-row': {
      type: 'horizontal-row',
      positions: Array.from({ length: count }, (_, i) => ({
        x: (100 / (count + 1)) * (i + 1),
        y: 50,
        size: 80,
      })),
    },
    'vertical-stack': {
      type: 'vertical-stack',
      positions: Array.from({ length: count }, (_, i) => ({
        x: 50,
        y: (100 / (count + 1)) * (i + 1),
        size: 80,
      })),
    },
    'grid-2x2': {
      type: 'grid-2x2',
      positions: [
        { x: 33, y: 33, size: 80 },
        { x: 67, y: 33, size: 80 },
        { x: 33, y: 67, size: 80 },
        { x: 67, y: 67, size: 80 },
      ].slice(0, count),
    },
    'grid-3x3': {
      type: 'grid-3x3',
      positions: [
        { x: 25, y: 25, size: 60 },
        { x: 50, y: 25, size: 60 },
        { x: 75, y: 25, size: 60 },
        { x: 25, y: 50, size: 60 },
        { x: 50, y: 50, size: 60 },
        { x: 75, y: 50, size: 60 },
        { x: 25, y: 75, size: 60 },
        { x: 50, y: 75, size: 60 },
        { x: 75, y: 75, size: 60 },
      ].slice(0, count),
    },
    'centered-large': {
      type: 'centered-large',
      positions: [
        { x: 50, y: 50, size: 150 },
        { x: 20, y: 20, size: 60 },
        { x: 80, y: 20, size: 60 },
        { x: 20, y: 80, size: 60 },
        { x: 80, y: 80, size: 60 },
      ].slice(0, count),
    },
    'side-by-side': {
      type: 'side-by-side',
      positions: count === 2
        ? [
            { x: 35, y: 50, size: 100 },
            { x: 65, y: 50, size: 100 },
          ]
        : Array.from({ length: count }, (_, i) => ({
            x: (100 / (count + 1)) * (i + 1),
            y: 50,
            size: 100,
          })),
    },
    scattered: {
      type: 'scattered',
      positions: [
        { x: 25, y: 30, size: 70 },
        { x: 65, y: 25, size: 85 },
        { x: 40, y: 65, size: 75 },
        { x: 75, y: 70, size: 80 },
        { x: 20, y: 75, size: 65 },
        { x: 85, y: 40, size: 70 },
      ].slice(0, count),
    },
    editorial: {
      type: 'editorial',
      positions: [
        { x: 30, y: 40, size: 120 },
        { x: 70, y: 30, size: 70 },
        { x: 75, y: 65, size: 80 },
        { x: 25, y: 75, size: 60 },
      ].slice(0, count),
    },
    'golden-ratio': {
      type: 'golden-ratio',
      positions: [
        // Main focal point at golden ratio intersection (61.8%, 38.2%)
        { x: 61.8, y: 38.2, size: 120 },
        // Secondary element at complementary position
        { x: 38.2, y: 61.8, size: 80 },
        // Tertiary elements following golden spiral
        { x: 23.6, y: 23.6, size: 60 },
        { x: 76.4, y: 76.4, size: 70 },
        // Additional elements along golden ratio lines
        { x: 38.2, y: 38.2, size: 65 },
        { x: 61.8, y: 61.8, size: 75 },
      ].slice(0, count),
    },
    'rule-of-thirds': {
      type: 'rule-of-thirds',
      positions: [
        // Primary intersections (33.3%, 66.7%)
        { x: 33.3, y: 33.3, size: 100 },
        { x: 66.7, y: 33.3, size: 100 },
        { x: 33.3, y: 66.7, size: 100 },
        { x: 66.7, y: 66.7, size: 100 },
        // Along grid lines for additional elements
        { x: 50, y: 33.3, size: 80 },
        { x: 50, y: 66.7, size: 80 },
        { x: 33.3, y: 50, size: 80 },
        { x: 66.7, y: 50, size: 80 },
      ].slice(0, count),
    },
  };

  return configs[type] || configs['centered-large'];
};

export const applyLayoutToIllustrations = (
  illustrations: Array<{ iconName: string; iconLibrary: 'lucide' | 'heroicons'; color: string }>,
  layout: LayoutType
) => {
  const config = getLayoutConfig(layout, illustrations.length);
  return illustrations.map((ill, index) => ({
    ...ill,
    position: config.positions[index] || { x: 50, y: 50, size: 80 },
    size: config.positions[index]?.size || 80,
    rotation: 0,
  }));
};

// Helper function to calculate golden ratio based position
export const calculateGoldenRatioPosition = (
  canvasWidth: number,
  canvasHeight: number,
  primary: boolean = true
): { x: number; y: number } => {
  if (primary) {
    // Primary focal point at golden ratio intersection
    return {
      x: (canvasWidth / PHI),
      y: (canvasHeight / PHI),
    };
  } else {
    // Secondary focal point
    return {
      x: canvasWidth - (canvasWidth / PHI),
      y: canvasHeight - (canvasHeight / PHI),
    };
  }
};

// Helper function to snap position to grid
export const snapToGrid = (
  position: { x: number; y: number },
  gridSize: number
): { x: number; y: number } => {
  return {
    x: Math.round(position.x / gridSize) * gridSize,
    y: Math.round(position.y / gridSize) * gridSize,
  };
};

// Helper function to check if position follows rule of thirds
export const isOnThirdsLine = (
  position: { x: number; y: number },
  tolerance: number = 5
): boolean => {
  const thirds = [33.3, 50, 66.7];
  const xOnLine = thirds.some(line => Math.abs(position.x - line) < tolerance);
  const yOnLine = thirds.some(line => Math.abs(position.y - line) < tolerance);
  return xOnLine || yOnLine;
};
