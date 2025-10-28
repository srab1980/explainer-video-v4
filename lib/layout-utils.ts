import type { LayoutType, LayoutConfig } from './types';

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
  };

  return configs[type];
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
