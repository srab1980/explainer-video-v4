// Animation types - Extended with advanced animations
export type AnimationType = 
  | 'fade' 
  | 'slide' 
  | 'zoom' 
  | 'bounce'
  | 'morph'
  | 'particle'
  | 'path'
  | 'physics';

// Layout types
export type LayoutType = 
  | 'horizontal-row'
  | 'vertical-stack'
  | 'grid-2x2'
  | 'grid-3x3'
  | 'centered-large'
  | 'side-by-side'
  | 'scattered'
  | 'editorial'
  | 'golden-ratio'
  | 'rule-of-thirds';

// Illustration style types for AI generation
export type IllustrationStyle = 
  | 'modern-flat'     // Clean, minimalist, geometric
  | 'hand-drawn'      // Sketch-like, artistic, organic
  | 'corporate'       // Professional, polished, business-oriented
  | 'custom';         // User-defined style

// Easing functions for animations
export type EasingFunction = 
  | 'linear'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | 'spring'
  | 'bounce'
  | 'elastic';

// Visual effects for illustrations
export interface VisualEffects {
  // Gradient fills
  gradient?: {
    type: 'linear' | 'radial' | 'conic';
    colors: string[];
    angle?: number; // For linear gradients (0-360)
    centerX?: number; // For radial/conic (0-100)
    centerY?: number; // For radial/conic (0-100)
  };
  
  // Shadow effects
  shadow?: {
    type: 'drop' | 'inner';
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
    spread?: number;
  };
  
  // Glow effect
  glow?: {
    color: string;
    intensity: number; // 0-100
    size: number; // Blur radius
  };
  
  // Border/Stroke
  border?: {
    width: number;
    color: string;
    style: 'solid' | 'dashed' | 'dotted';
    radius?: number;
  };
  
  // Texture overlay
  texture?: {
    type: 'noise' | 'grain' | 'pattern';
    opacity: number; // 0-100
    scale: number;
  };
  
  // Depth/3D effect
  depth?: {
    enabled: boolean;
    perspective: number;
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
  };
}

// Advanced animation parameters
export interface AnimationParams {
  type: AnimationType;
  duration: number; // in seconds
  delay: number; // Stagger delay
  easing: EasingFunction;
  loop?: boolean;
  direction?: 'normal' | 'reverse' | 'alternate';
  
  // Particle-specific params
  particleCount?: number;
  particleSize?: number;
  particleColor?: string;
  
  // Path animation params
  pathPoints?: Array<{ x: number; y: number }>;
  pathType?: 'linear' | 'bezier' | 'curved';
  
  // Morph params
  morphTarget?: {
    size?: number;
    rotation?: number;
    position?: { x: number; y: number };
  };
}

// Layer information for advanced editing
export interface LayerInfo {
  zIndex: number;
  locked: boolean;
  visible: boolean;
  opacity: number; // 0-100
  blendMode?: 'normal' | 'multiply' | 'screen' | 'overlay';
  groupId?: string; // For grouping layers
}

// Illustration represents a visual element (icon or AI-generated image)
export interface Illustration {
  id: string;
  
  // Type: icon-based or AI-generated
  type: 'icon' | 'ai-generated';
  
  // Icon-based properties
  iconName?: string; // Name of the icon from Lucide/Heroicons
  iconLibrary?: 'lucide' | 'heroicons'; // Which library the icon comes from
  
  // AI-generated properties
  imageUrl?: string; // URL of DALL-E generated image
  imagePrompt?: string; // The prompt used to generate the image
  style?: IllustrationStyle; // Visual style used for generation
  customStyleDescription?: string; // For custom style
  
  // Common properties
  position: { x: number; y: number }; // Position in percentage (0-100)
  size: number; // Size in pixels
  color: string; // Hex color (for icons) or primary color (for AI images)
  rotation: number; // Rotation in degrees
  
  // Advanced features
  effects?: VisualEffects;
  animationParams?: AnimationParams;
  layer?: LayerInfo;
  
  // Metadata
  createdAt?: Date;
  updatedAt?: Date;
}

// Scene represents a single storyboard scene
export interface Scene {
  id: string;
  title: string;
  description: string;
  duration: number; // Duration in seconds
  voiceover: string; // Text to be spoken
  keywords: string[]; // Keywords extracted from the scene
  layout: LayoutType;
  animation: AnimationType;
  illustrations: Illustration[];
  backgroundColor: string; // Hex color or gradient
  textColor: string; // Hex color
  order: number; // Order in the timeline
  
  // Advanced scene properties
  backgroundGradient?: {
    type: 'linear' | 'radial';
    colors: string[];
    angle?: number;
  };
  
  // Default illustration style for this scene
  defaultIllustrationStyle?: IllustrationStyle;
}

// Project represents the entire storyboard project
export interface Project {
  id: string;
  name: string;
  script: string; // Original script text
  scenes: Scene[];
  createdAt: Date;
  updatedAt: Date;
  
  // Project-wide settings
  defaultIllustrationStyle?: IllustrationStyle;
  colorPalette?: string[]; // Custom color palette for the project
  usageTracking?: {
    dalleGenerations: number; // Track DALL-E API usage
    lastReset: Date;
  };
}

// Layout configuration for positioning illustrations
export interface LayoutConfig {
  type: LayoutType;
  positions: Array<{ x: number; y: number; size: number }>;
}

// API request/response types
export interface GenerateScenesRequest {
  script: string;
  illustrationStyle?: IllustrationStyle;
  useAIImages?: boolean;
}

export interface GenerateScenesResponse {
  scenes: Omit<Scene, 'id' | 'order'>[];
  error?: string;
}

// DALL-E image generation types
export interface GenerateImageRequest {
  prompt: string;
  style: IllustrationStyle;
  customStyleDescription?: string;
  size?: '1024x1024' | '1792x1024' | '1024x1792';
  quality?: 'standard' | 'hd';
}

export interface GenerateImageResponse {
  imageUrl: string;
  prompt: string;
  error?: string;
}

// Style preset for consistent look
export interface StylePreset {
  id: string;
  name: string;
  illustrationStyle: IllustrationStyle;
  colorPalette: string[];
  defaultEffects?: VisualEffects;
  defaultAnimation?: AnimationParams;
}

// Store state type
export interface StoreState {
  // State
  currentProject: Project | null;
  selectedSceneId: string | null;
  selectedIllustrationIds: string[]; // Multi-select for batch editing
  isGenerating: boolean;
  isGeneratingImage: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // UI state
  showGridGuides: boolean;
  snapToGrid: boolean;
  gridSize: number;
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => void;
  updateProjectName: (name: string) => void;
  updateScript: (script: string) => void;
  generateScenes: (script: string, options?: { useAIImages?: boolean; style?: IllustrationStyle }) => Promise<void>;
  
  addScene: (scene: Omit<Scene, 'id' | 'order'>) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (sceneId: string) => void;
  reorderScenes: (sceneIds: string[]) => void;
  duplicateScene: (sceneId: string) => void;
  
  addIllustration: (sceneId: string, illustration: Omit<Illustration, 'id'>) => void;
  updateIllustration: (sceneId: string, illustrationId: string, updates: Partial<Illustration>) => void;
  deleteIllustration: (sceneId: string, illustrationId: string) => void;
  generateAIIllustration: (sceneId: string, prompt: string, style: IllustrationStyle, customStyleDescription?: string) => Promise<void>;
  
  // Multi-select actions
  selectIllustrations: (illustrationIds: string[]) => void;
  batchUpdateIllustrations: (sceneId: string, illustrationIds: string[], updates: Partial<Illustration>) => void;
  
  selectScene: (sceneId: string | null) => void;
  
  // UI settings
  toggleGridGuides: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
