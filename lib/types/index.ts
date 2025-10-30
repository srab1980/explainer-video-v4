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

// PHASE 1: Voice-to-Script AI
export type SupportedLanguage = 'en' | 'es' | 'fr' | 'de' | 'zh' | 'ja' | 'ko' | 'it' | 'pt';

export interface VoiceInput {
  audioBlob: Blob;
  language: SupportedLanguage;
  transcription: string;
  confidence: number;
  timestamp: number;
}

export interface VoiceCommand {
  command: 'next_scene' | 'previous_scene' | 'add_scene' | 'delete_scene' | 'play' | 'pause';
  timestamp: number;
  executed: boolean;
}

export interface VoiceToScriptRequest {
  audioData: string; // Base64 encoded audio
  language: SupportedLanguage;
}

export interface VoiceToScriptResponse {
  transcription: string;
  confidence: number;
  language: SupportedLanguage;
  duration: number;
  error?: string;
}

// PHASE 2: Smart Story Optimization
export interface CharacterCheck {
  character: string;
  appearances: number[];
  consistencyScore: number;
  issues: string[];
}

export interface IndustryComparison {
  averagePacing: number;
  averageDuration: number;
  idealSceneCount: { min: number; max: number };
  genre: string;
}

export interface StoryAnalysis {
  pacingScore: number; // 0-100
  flowOptimization: string[];
  characterConsistency: CharacterCheck[];
  industryBenchmark: IndustryComparison;
  suggestions: string[];
  deadTimeDetection: { sceneId: string; duration: number; reason: string }[];
}

export interface AnalyzeStoryRequest {
  script: string;
  scenes: Scene[];
  genre?: string;
}

export interface AnalyzeStoryResponse {
  analysis: StoryAnalysis;
  error?: string;
}

export interface OptimizeScenesRequest {
  scenes: Scene[];
  targetDuration?: number;
}

export interface OptimizeScenesResponse {
  optimizedScenes: Scene[];
  changes: {
    sceneId: string;
    type: 'merge' | 'split' | 'adjust_timing';
    reason: string;
    before: number;
    after: number;
  }[];
  error?: string;
}

// PHASE 3: Intelligent Scene Transitions
export interface TransitionSuggestion {
  type: AnimationType;
  duration: number;
  reasoning: string;
  musicSync?: boolean;
  continuityScore: number;
  moodAlignment: number;
}

export interface SmartTransitionsRequest {
  scenes: Scene[];
  musicBpm?: number;
}

export interface SmartTransitionsResponse {
  suggestions: { sceneId: string; transition: TransitionSuggestion }[];
  error?: string;
}

// PHASE 4: AI Suggestions Engine
export type AISuggestionType = 'creative' | 'visual' | 'accessibility' | 'template' | 'character';

export interface AISuggestion {
  id: string;
  type: AISuggestionType;
  title: string;
  description: string;
  implementation: any;
  confidence: number;
  impact: 'low' | 'medium' | 'high';
}

export interface AISuggestionsRequest {
  scene: Scene;
  projectContext?: {
    genre?: string;
    targetAudience?: string;
    purpose?: string;
  };
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
  error?: string;
}

// PHASE 5: Multi-Language Support
export interface TranslationRequest {
  text: string;
  sourceLanguage: SupportedLanguage;
  targetLanguage: SupportedLanguage;
  context?: 'script' | 'scene_title' | 'description' | 'voiceover';
}

export interface TranslationResponse {
  translatedText: string;
  confidence: number;
  culturalAdaptations?: string[];
  error?: string;
}

export interface CulturalAdaptation {
  element: string;
  originalValue: string;
  suggestedValue: string;
  reasoning: string;
}

// ========================================
// VIDEO PRODUCTION & EXPORT SYSTEM
// ========================================

// Video export formats
export type VideoFormat = 'mp4' | 'webm' | 'mov';
export type VideoQuality = '480p' | '720p' | '1080p' | '4k';
export type VideoPlatform = 'youtube' | 'instagram' | 'linkedin' | 'instagram-story' | 'twitter' | 'custom';

// Platform-specific video specifications
export interface PlatformSpec {
  platform: VideoPlatform;
  aspectRatio: string; // e.g., '16:9', '1:1', '9:16'
  width: number;
  height: number;
  maxDuration: number; // in seconds
  recommendedBitrate: string;
  recommendedFormat: VideoFormat;
}

// Audio settings
export type VoiceGender = 'male' | 'female' | 'neutral';
export type VoiceStyle = 'professional' | 'friendly' | 'energetic' | 'calm' | 'authoritative';

export interface AudioSettings {
  voiceover: {
    enabled: boolean;
    voice: string; // OpenAI TTS voice ID
    gender: VoiceGender;
    style: VoiceStyle;
    speed: number; // 0.5 - 2.0
    pitch: number; // -12 to +12 semitones
    volume: number; // 0-100
  };
  backgroundMusic: {
    enabled: boolean;
    trackUrl?: string;
    trackName?: string;
    volume: number; // 0-100
    fadeIn: number; // seconds
    fadeOut: number; // seconds
    loop: boolean;
  };
  soundEffects: {
    enabled: boolean;
    transitionSounds: boolean;
    volume: number; // 0-100
  };
}

// Industry template types
export type IndustryTemplate = 
  | 'saas-product-demo'
  | 'product-launch'
  | 'educational-tutorial'
  | 'service-explanation'
  | 'startup-pitch'
  | 'company-culture'
  | 'testimonial'
  | 'how-it-works'
  | 'feature-highlight'
  | 'custom';

export interface TemplatePreset {
  id: string;
  name: string;
  industry: IndustryTemplate;
  description: string;
  thumbnail?: string;
  
  // Template styling
  defaultColors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  
  defaultAnimations: AnimationType[];
  defaultLayout: LayoutType;
  defaultDuration: number; // seconds per scene
  
  // Template-specific settings
  includesIntro: boolean;
  includesOutro: boolean;
  textStyle: {
    titleFont: string;
    bodyFont: string;
    titleSize: number;
    bodySize: number;
  };
}

// Brand identity configuration
export interface BrandIdentity {
  id: string;
  name: string;
  
  // Colors
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    custom: string[]; // Additional brand colors
  };
  
  // Typography
  typography: {
    headingFont: string;
    bodyFont: string;
    fontSizes: {
      h1: number;
      h2: number;
      body: number;
      caption: number;
    };
  };
  
  // Logo
  logo?: {
    url: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center';
    size: number; // 0-100
    opacity: number; // 0-100
  };
  
  // Watermark
  watermark?: {
    text?: string;
    imageUrl?: string;
    position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    opacity: number; // 0-100
  };
}

// Video rendering configuration
export interface VideoRenderConfig {
  // Output settings
  format: VideoFormat;
  quality: VideoQuality;
  platform: VideoPlatform;
  customDimensions?: {
    width: number;
    height: number;
  };
  
  // Frame settings
  fps: 30 | 60;
  codec: 'h264' | 'h265' | 'vp9';
  bitrate?: string; // e.g., '5000k'
  
  // Audio settings
  audio: AudioSettings;
  
  // Brand and template
  brand?: BrandIdentity;
  template?: IndustryTemplate;
  
  // Advanced options
  includeSubtitles: boolean;
  subtitleLanguage?: SupportedLanguage;
  includeProgressBar: boolean;
  
  // Intro/Outro
  customIntro?: {
    enabled: boolean;
    duration: number;
    text?: string;
    imageUrl?: string;
  };
  customOutro?: {
    enabled: boolean;
    duration: number;
    text?: string;
    callToAction?: string;
    ctaUrl?: string;
  };
}

// Video rendering job
export interface VideoRenderJob {
  id: string;
  projectId: string;
  config: VideoRenderConfig;
  status: 'pending' | 'processing' | 'rendering' | 'encoding' | 'completed' | 'failed';
  progress: number; // 0-100
  currentStep: string;
  startTime: number;
  endTime?: number;
  outputUrl?: string;
  error?: string;
  estimatedTimeRemaining?: number; // in seconds
}

// Motion graphics text animation
export type TextAnimationType = 
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'type-writer'
  | 'letter-by-letter'
  | 'word-by-word'
  | 'scale-in'
  | 'bounce-in'
  | 'rotate-in'
  | 'blur-in';

export interface TextAnimationConfig {
  type: TextAnimationType;
  duration: number; // seconds
  delay: number; // seconds
  easing: EasingFunction;
  stagger?: number; // for letter-by-letter, word-by-word
}

// Advanced transition effects
export type TransitionEffect =
  | 'fade'
  | 'dissolve'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'circle-wipe'
  | 'zoom-in'
  | 'zoom-out'
  | 'slide-left'
  | 'slide-right'
  | 'rotate'
  | 'blur'
  | 'pixelate';

export interface TransitionConfig {
  effect: TransitionEffect;
  duration: number; // seconds
  easing: EasingFunction;
}

// API request/response types for video production
export interface RenderVideoRequest {
  projectId: string;
  config: VideoRenderConfig;
}

export interface RenderVideoResponse {
  jobId: string;
  estimatedDuration: number; // seconds
  error?: string;
}

export interface VideoJobStatusResponse {
  job: VideoRenderJob;
  error?: string;
}

export interface GenerateVoiceoverRequest {
  text: string;
  voice: string;
  speed: number;
  language: SupportedLanguage;
}

export interface GenerateVoiceoverResponse {
  audioUrl: string;
  duration: number; // seconds
  error?: string;
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
  
  // Enhanced AI state
  currentLanguage: SupportedLanguage;
  isRecording: boolean;
  isTranscribing: boolean;
  isAnalyzing: boolean;
  storyAnalysis: StoryAnalysis | null;
  aiSuggestions: Map<string, AISuggestion[]>; // sceneId -> suggestions
  
  // Video Production state
  currentRenderJob: VideoRenderJob | null;
  isRendering: boolean;
  renderProgress: number; // 0-100
  audioSettings: AudioSettings;
  selectedTemplate: IndustryTemplate | null;
  selectedBrand: BrandIdentity | null;
  videoConfig: VideoRenderConfig | null;
  
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
  
  // Enhanced AI actions
  transcribeVoice: (audioBlob: Blob, language: SupportedLanguage) => Promise<string>;
  analyzeStory: () => Promise<void>;
  generateAISuggestions: (sceneId: string) => Promise<void>;
  applySmartTransitions: () => Promise<void>;
  translateProject: (targetLanguage: SupportedLanguage) => Promise<void>;
  setLanguage: (language: SupportedLanguage) => void;
  
  // UI settings
  toggleGridGuides: () => void;
  toggleSnapToGrid: () => void;
  setGridSize: (size: number) => void;
  
  // Video Production actions
  setVideoConfig: (config: VideoRenderConfig) => void;
  setAudioSettings: (settings: AudioSettings) => void;
  setTemplate: (template: IndustryTemplate) => void;
  setBrand: (brand: BrandIdentity) => void;
  startVideoRender: (config: VideoRenderConfig) => Promise<string>; // returns jobId
  checkRenderStatus: (jobId: string) => Promise<VideoRenderJob>;
  cancelRender: (jobId: string) => Promise<void>;
  generateVoiceover: (text: string, voice: string, language: SupportedLanguage) => Promise<string>; // returns audioUrl
  
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
