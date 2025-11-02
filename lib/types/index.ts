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

// Illustration-specific animation types
export type IllustrationAnimationType =
  | 'scale-grow'
  | 'scale-shrink'
  | 'scale-pulse'
  | 'scale-breathe'
  | 'rotate-spin'
  | 'rotate-wobble'
  | 'rotate-tilt'
  | 'rotate-flip'
  | 'opacity-fade-in'
  | 'opacity-fade-out'
  | 'opacity-shimmer'
  | 'opacity-ghost'
  | 'transform-slide-in'
  | 'transform-slide-out'
  | 'transform-bounce'
  | 'transform-elastic'
  | 'continuous-float'
  | 'continuous-rotate'
  | 'continuous-pulse'
  | 'effects-glow'
  | 'effects-shadow'
  | 'effects-blur'
  | 'effects-sharpen';

// Background removal methods
export type BackgroundRemovalMethod = 
  | 'ai-based'      // Use AI model to detect and remove background
  | 'color-based'   // Remove solid color backgrounds
  | 'edge-based'    // Use edge detection
  | 'manual';       // User-controlled masking

// Trigger types for illustration animations
export type AnimationTrigger = 
  | 'auto'          // Automatic when scene starts
  | 'hover'         // On hover (interactive)
  | 'click'         // On click (interactive)
  | 'timeline';     // Based on timeline position

// Repeat modes for illustration animations
export type RepeatMode = 
  | 'none'          // Play once
  | 'loop'          // Repeat continuously
  | 'ping-pong';    // Alternate direction

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

// Illustration-specific animation configuration
export interface IllustrationAnimation {
  id: string;
  type: IllustrationAnimationType;
  duration: number; // in seconds
  delay: number; // Start delay in seconds
  easing: EasingFunction;
  repeat: RepeatMode;
  trigger: AnimationTrigger;
  
  // Animation-specific parameters
  scaleParams?: {
    from: number;  // Starting scale (0-2)
    to: number;    // Ending scale (0-2)
    frequency?: number; // For pulse/breathe effects
  };
  
  rotationParams?: {
    from: number;  // Starting rotation in degrees
    to: number;    // Ending rotation in degrees
    axis?: 'x' | 'y' | 'z'; // For 3D rotations
  };
  
  opacityParams?: {
    from: number;  // Starting opacity (0-100)
    to: number;    // Ending opacity (0-100)
    frequency?: number; // For shimmer effects
  };
  
  transformParams?: {
    fromPosition?: { x: number; y: number };
    toPosition?: { x: number; y: number };
    distance?: number; // For slide animations
    direction?: 'up' | 'down' | 'left' | 'right';
  };
  
  effectsParams?: {
    intensity: number; // 0-100
    radius?: number;   // For glow/shadow/blur
    color?: string;    // For glow/shadow
  };
}

// Transparent background configuration
export interface TransparentBackgroundConfig {
  enabled: boolean;
  method: BackgroundRemovalMethod;
  
  // Color-based removal settings
  targetColor?: string; // Hex color to remove
  tolerance?: number;   // Color matching tolerance (0-100)
  
  // Edge-based removal settings
  edgeThreshold?: number; // Edge detection sensitivity (0-100)
  
  // AI-based removal settings
  aiModel?: 'standard' | 'high-quality'; // Quality level
  preserveDetails?: boolean; // Preserve fine details
  
  // Manual masking settings (for future implementation)
  maskPath?: string; // Path to mask file or SVG path data
  
  // Processing options
  smoothEdges?: boolean; // Apply anti-aliasing to edges
  featherAmount?: number; // Edge feathering (0-20 pixels)
}

// Animation keyframe for timeline-based animations
export interface AnimationKeyframe {
  time: number; // Time in seconds from start
  properties: {
    position?: { x: number; y: number };
    scale?: number;
    rotation?: number;
    opacity?: number;
  };
  easing?: EasingFunction;
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
  animationParams?: AnimationParams; // Scene-level animation
  layer?: LayerInfo;
  
  // Transparent background support
  transparentBackground?: TransparentBackgroundConfig;
  transparentImageUrl?: string; // URL of processed transparent PNG
  
  // Illustration-specific animations
  illustrationAnimations?: IllustrationAnimation[]; // Multiple animations per illustration
  animationKeyframes?: AnimationKeyframe[]; // Timeline-based keyframes
  
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

// Transparent background generation types
export interface RemoveBackgroundRequest {
  imageUrl: string; // Source image URL or data URI
  method: BackgroundRemovalMethod;
  config?: Partial<TransparentBackgroundConfig>;
}

export interface RemoveBackgroundResponse {
  transparentImageUrl: string; // URL to transparent PNG
  originalImageUrl: string;
  method: BackgroundRemovalMethod;
  processingTime?: number; // Time taken in ms
  error?: string;
}

// Illustration animation export types
export interface IllustrationAnimationExport {
  illustrationId: string;
  animations: IllustrationAnimation[];
  keyframes?: AnimationKeyframe[];
  exportFormat: 'css' | 'js' | 'json';
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

// Advanced Video Production Types

// Transitions
export type TransitionType =
  | 'fade'
  | 'dissolve'
  | 'slide-left'
  | 'slide-right'
  | 'slide-up'
  | 'slide-down'
  | 'wipe-left'
  | 'wipe-right'
  | 'wipe-up'
  | 'wipe-down'
  | 'zoom-in'
  | 'zoom-out'
  | 'pan-left'
  | 'pan-right'
  | 'crossfade'
  | 'push-left'
  | 'push-right';

export interface SceneTransition {
  id: string;
  type: TransitionType;
  duration: number; // in seconds
  easing?: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out';
}

// Video Effects
export type VideoFilterType =
  | 'none'
  | 'vintage'
  | 'cinematic'
  | 'corporate'
  | 'social'
  | 'black-white'
  | 'sepia'
  | 'vibrant'
  | 'cool'
  | 'warm';

export interface ColorCorrection {
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
  saturation: number; // -100 to 100
  hue: number; // -180 to 180
  temperature: number; // -100 to 100 (cool to warm)
  tint: number; // -100 to 100 (green to magenta)
}

export interface VideoEffect {
  id: string;
  type: 'filter' | 'color-correction' | 'blur' | 'sharpen' | 'vignette' | 'lens-distortion';
  enabled: boolean;
  filter?: VideoFilterType;
  filterIntensity?: number; // 0-100
  colorCorrection?: ColorCorrection;
  blurAmount?: number; // 0-20
  blurType?: 'gaussian' | 'motion' | 'radial';
  vignetteIntensity?: number; // 0-100
  vignetteFeather?: number; // 0-100
  lensDistortion?: number; // -100 to 100
}

// Text and Graphics Overlays
export interface TextOverlay {
  id: string;
  text: string;
  position: { x: number; y: number }; // percentage 0-100
  fontSize: number;
  fontFamily: string;
  color: string;
  backgroundColor?: string;
  padding?: number;
  alignment: 'left' | 'center' | 'right';
  animation?: {
    type: 'none' | 'typewriter' | 'fade-in' | 'slide-in' | 'bounce';
    duration: number;
    delay: number;
  };
  startTime: number;
  endTime: number;
  layer: number;
}

export interface LogoOverlay {
  id: string;
  imageUrl: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center' | 'custom';
  customPosition?: { x: number; y: number };
  size: number; // percentage of video width
  opacity: number; // 0-100
  startTime: number;
  endTime: number;
  animation?: {
    type: 'none' | 'fade-in' | 'slide-in' | 'zoom-in';
    duration: number;
  };
}

export interface LowerThird {
  id: string;
  title: string;
  subtitle?: string;
  style: 'modern' | 'classic' | 'minimal' | 'bold' | 'elegant';
  position: 'bottom' | 'top' | 'middle';
  color: string;
  startTime: number;
  duration: number;
  animation: {
    in: 'slide' | 'fade' | 'wipe';
    out: 'slide' | 'fade' | 'wipe';
    duration: number;
  };
}

// Audio Library Types
export interface AudioTrack {
  id: string;
  name: string;
  category: 'corporate' | 'tech' | 'modern' | 'ambient' | 'energetic' | 'calm' | 'dramatic' | 'minimal';
  mood: 'upbeat' | 'professional' | 'creative' | 'dramatic' | 'minimal' | 'inspiring' | 'calm' | 'energetic';
  duration: number; // in seconds
  bpm?: number;
  key?: string;
  url: string;
  tags: string[];
  description?: string;
}

export interface SoundEffect {
  id: string;
  name: string;
  category: 'interface' | 'ambient' | 'impact' | 'transition' | 'ui-feedback';
  subcategory?: string;
  duration: number;
  url: string;
  tags: string[];
  description?: string;
}

export interface AudioMixerTrack {
  id: string;
  name: string;
  type: 'voiceover' | 'music' | 'sfx' | 'master';
  volume: number; // 0-100
  muted: boolean;
  solo: boolean;
  audioUrl?: string;
}

export interface AdvancedAudioSettings {
  fadeIn: number; // seconds
  fadeOut: number; // seconds
  ducking: boolean; // auto-lower music during speech
  duckingAmount: number; // 0-100
  noiseReduction: boolean;
  normalize: boolean; // auto-balance volume
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

// ========================================
// PHASE 4: INTERACTIVE & ENGAGING ELEMENTS
// ========================================

// Interactive hotspot types
export type HotspotType = 
  | 'button'
  | 'link'
  | 'info'
  | 'product'
  | 'cta'
  | 'social'
  | 'custom';

export type HotspotAction = 
  | 'open-url'
  | 'show-info'
  | 'pause-video'
  | 'skip-to-scene'
  | 'show-form'
  | 'track-event';

export interface InteractiveHotspot {
  id: string;
  sceneId: string;
  type: HotspotType;
  
  // Position and appearance
  position: { x: number; y: number }; // percentage 0-100
  size: { width: number; height: number }; // pixels
  shape: 'rectangle' | 'circle' | 'custom';
  
  // Content
  label: string;
  icon?: string;
  description?: string;
  
  // Styling
  backgroundColor: string;
  textColor: string;
  borderColor?: string;
  borderWidth?: number;
  opacity: number; // 0-100
  
  // Animation
  hoverEffect?: {
    scale?: number;
    opacity?: number;
    backgroundColor?: string;
  };
  pulseAnimation?: boolean;
  
  // Action
  action: HotspotAction;
  actionData: {
    url?: string;
    targetSceneId?: string;
    message?: string;
    eventName?: string;
    formId?: string;
  };
  
  // Timing
  appearTime: number; // seconds from scene start
  disappearTime?: number; // seconds from scene start
  
  // Tracking
  clicks: number;
  impressions: number;
}

// Call-to-action types
export type CTAStyle = 
  | 'button'
  | 'banner'
  | 'overlay'
  | 'floating'
  | 'end-screen';

export interface AnimatedCTA {
  id: string;
  sceneId: string;
  style: CTAStyle;
  
  // Content
  headline: string;
  subheadline?: string;
  buttonText: string;
  
  // Styling
  theme: {
    backgroundColor: string;
    textColor: string;
    buttonColor: string;
    buttonTextColor: string;
  };
  
  // Animation
  entranceAnimation: AnimationType;
  exitAnimation: AnimationType;
  timing: {
    appearTime: number; // seconds from scene start
    duration: number; // how long it stays visible
  };
  
  // Action
  action: {
    type: 'url' | 'form' | 'social' | 'download';
    url?: string;
    formId?: string;
    platform?: string;
  };
  
  // Tracking
  views: number;
  clicks: number;
  conversionRate: number;
}

// A/B Testing types
export interface VideoVariant {
  id: string;
  projectId: string;
  name: string;
  description: string;
  
  // Variations
  changes: {
    sceneId: string;
    changedElements: {
      type: 'text' | 'animation' | 'hotspot' | 'cta' | 'layout' | 'color';
      before: any;
      after: any;
    }[];
  }[];
  
  // Status
  status: 'draft' | 'active' | 'paused' | 'completed';
  trafficAllocation: number; // 0-100 percentage
  
  // Metrics
  metrics: {
    views: number;
    completionRate: number;
    avgWatchTime: number;
    clickThroughRate: number;
    conversions: number;
    engagement: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface ABTest {
  id: string;
  projectId: string;
  name: string;
  description: string;
  
  // Variants
  controlVariant: VideoVariant;
  testVariants: VideoVariant[];
  
  // Configuration
  status: 'draft' | 'running' | 'paused' | 'completed';
  startDate?: Date;
  endDate?: Date;
  goal: {
    type: 'views' | 'completion' | 'clicks' | 'conversions' | 'engagement';
    target: number;
  };
  
  // Results
  winner?: string; // variant ID
  confidenceLevel?: number; // 0-100
  
  createdAt: Date;
  updatedAt: Date;
}

// Engagement analytics
export interface EngagementMetrics {
  sceneId: string;
  
  // Viewing metrics
  views: number;
  uniqueViews: number;
  avgWatchTime: number;
  completionRate: number;
  dropOffRate: number;
  rewatchRate: number;
  
  // Interaction metrics
  hotspotsClicked: { [hotspotId: string]: number };
  ctaClicks: { [ctaId: string]: number };
  pausePoints: { time: number; count: number }[];
  skipPoints: { time: number; count: number }[];
  
  // Heatmap data
  clickHeatmap: { x: number; y: number; count: number }[];
  attentionHeatmap: { x: number; y: number; duration: number }[];
  
  lastUpdated: Date;
}

// ========================================
// PHASE 5: COLLABORATIVE PRODUCTION WORKFLOW
// ========================================

// User roles and permissions
export type UserRole = 'owner' | 'admin' | 'editor' | 'reviewer' | 'viewer';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: UserRole;
  
  // Permissions
  permissions: {
    canEdit: boolean;
    canComment: boolean;
    canApprove: boolean;
    canPublish: boolean;
    canInvite: boolean;
    canManageTeam: boolean;
  };
  
  // Status
  status: 'active' | 'invited' | 'inactive';
  lastActive?: Date;
  joinedAt: Date;
}

// Comments and feedback
export type CommentType = 'general' | 'suggestion' | 'issue' | 'approval';
export type CommentStatus = 'open' | 'resolved' | 'archived';

export interface Comment {
  id: string;
  projectId: string;
  sceneId: string;
  
  // Author
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  
  // Content
  type: CommentType;
  content: string;
  attachments?: { url: string; type: string; name: string }[];
  
  // Position (optional - for specific element comments)
  position?: { x: number; y: number };
  elementId?: string; // illustration or hotspot ID
  timestamp?: number; // time in video if applicable
  
  // Status
  status: CommentStatus;
  resolvedBy?: string;
  resolvedAt?: Date;
  
  // Threading
  parentId?: string;
  replies?: Comment[];
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Approval workflow
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'changes-requested';

export interface ApprovalRequest {
  id: string;
  projectId: string;
  sceneId?: string; // specific scene or entire project
  
  // Request details
  requestedBy: string;
  requestedFrom: string[];
  message: string;
  
  // Status
  status: ApprovalStatus;
  approvals: {
    userId: string;
    userName: string;
    status: ApprovalStatus;
    feedback?: string;
    timestamp: Date;
  }[];
  
  // Deadline
  dueDate?: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// Version control and history
export interface Version {
  id: string;
  projectId: string;
  versionNumber: string; // e.g., "1.0", "1.1", "2.0"
  name: string;
  description: string;
  
  // Snapshot
  snapshot: Project; // Full project state
  
  // Changes
  changes: {
    type: 'scene' | 'illustration' | 'settings' | 'interactive' | 'other';
    action: 'added' | 'updated' | 'deleted';
    description: string;
    elementId?: string;
  }[];
  
  // Author
  createdBy: string;
  createdByName: string;
  
  // Status
  isPublished: boolean;
  tags?: string[];
  
  createdAt: Date;
}

// Project status and workflow
export type ProjectStatus = 
  | 'draft'
  | 'in-review'
  | 'changes-requested'
  | 'approved'
  | 'in-production'
  | 'published'
  | 'archived';

export interface ProductionTimeline {
  projectId: string;
  status: ProjectStatus;
  
  // Milestones
  milestones: {
    id: string;
    name: string;
    description: string;
    dueDate: Date;
    status: 'not-started' | 'in-progress' | 'completed' | 'overdue';
    assignedTo?: string[];
    completedAt?: Date;
  }[];
  
  // Tasks
  tasks: {
    id: string;
    title: string;
    description: string;
    assignedTo: string;
    assignedToName: string;
    dueDate?: Date;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    status: 'todo' | 'in-progress' | 'review' | 'done';
    relatedSceneId?: string;
    tags?: string[];
    createdAt: Date;
    completedAt?: Date;
  }[];
  
  // Activity log
  activities: {
    id: string;
    type: 'edit' | 'comment' | 'approval' | 'status-change' | 'publish';
    description: string;
    userId: string;
    userName: string;
    timestamp: Date;
  }[];
}

// Real-time collaboration
export interface CollaborationSession {
  projectId: string;
  activeUsers: {
    userId: string;
    userName: string;
    avatar?: string;
    color: string; // cursor color
    currentSceneId?: string;
    lastActivity: Date;
  }[];
  
  // Locks
  locks: {
    sceneId: string;
    userId: string;
    userName: string;
    lockedAt: Date;
  }[];
}

// ========================================
// PHASE 6: DISTRIBUTION & MARKETING INTEGRATION
// ========================================

// Distribution platforms
export type DistributionPlatform = 
  | 'youtube'
  | 'vimeo'
  | 'wistia'
  | 'facebook'
  | 'instagram'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'custom';

export interface PlatformConnection {
  id: string;
  platform: DistributionPlatform;
  accountName: string;
  accountId: string;
  
  // Auth
  isConnected: boolean;
  accessToken?: string;
  refreshToken?: string;
  expiresAt?: Date;
  
  // Settings
  defaultSettings: {
    visibility: 'public' | 'private' | 'unlisted';
    category?: string;
    tags?: string[];
    thumbnail?: string;
  };
  
  connectedAt: Date;
  lastUsed?: Date;
}

export interface DistributionJob {
  id: string;
  projectId: string;
  videoUrl: string;
  
  // Platforms
  platforms: {
    platform: DistributionPlatform;
    status: 'pending' | 'uploading' | 'processing' | 'published' | 'failed';
    videoId?: string;
    publishedUrl?: string;
    error?: string;
    progress: number; // 0-100
  }[];
  
  // Status
  overallStatus: 'pending' | 'in-progress' | 'completed' | 'failed';
  scheduledFor?: Date;
  
  // Metadata
  createdAt: Date;
  publishedAt?: Date;
}

// SEO and optimization
export interface SEOMetadata {
  projectId: string;
  
  // Basic metadata
  title: string;
  description: string;
  tags: string[];
  category?: string;
  
  // Thumbnails
  thumbnails: {
    id: string;
    url: string;
    isGenerated: boolean;
    variantName?: string;
    clickThroughRate?: number;
    impressions?: number;
  }[];
  selectedThumbnail?: string; // thumbnail ID
  
  // Captions/Subtitles
  captions: {
    language: SupportedLanguage;
    url: string;
    isAutoGenerated: boolean;
    createdAt: Date;
  }[];
  
  // Advanced SEO
  keywords: {
    primary: string[];
    secondary: string[];
  };
  hashtags?: string[];
  customOgImage?: string;
  
  lastUpdated: Date;
}

// Marketing integration
export type MarketingPlatform = 
  | 'mailchimp'
  | 'hubspot'
  | 'salesforce'
  | 'activecampaign'
  | 'custom';

export interface MarketingCampaign {
  id: string;
  projectId: string;
  name: string;
  type: 'email' | 'social' | 'landing-page' | 'ads';
  
  // Platform
  platform: MarketingPlatform;
  campaignId?: string;
  
  // Content
  videoUrl: string;
  landingPageUrl?: string;
  emailTemplate?: string;
  
  // Targeting
  audience: {
    segments?: string[];
    tags?: string[];
    customList?: string;
  };
  
  // Schedule
  status: 'draft' | 'scheduled' | 'active' | 'completed' | 'paused';
  scheduledFor?: Date;
  endDate?: Date;
  
  // Performance
  metrics: {
    sent?: number;
    opened?: number;
    clicked?: number;
    conversions?: number;
    revenue?: number;
  };
  
  createdAt: Date;
  launchedAt?: Date;
}

export interface LandingPage {
  id: string;
  projectId: string;
  
  // Content
  title: string;
  headline: string;
  subheadline?: string;
  description: string;
  videoUrl: string;
  
  // Design
  template: 'minimal' | 'product' | 'sales' | 'webinar' | 'custom';
  theme: {
    primaryColor: string;
    secondaryColor: string;
    backgroundColor: string;
    textColor: string;
  };
  
  // Components
  components: {
    type: 'video' | 'cta' | 'testimonials' | 'features' | 'form' | 'social';
    config: any;
    order: number;
  }[];
  
  // Lead capture
  leadForm?: {
    fields: {
      name: string;
      type: 'text' | 'email' | 'phone' | 'select' | 'textarea';
      label: string;
      required: boolean;
    }[];
    submitAction: 'email' | 'webhook' | 'integration';
    submitConfig: any;
  };
  
  // SEO
  seoTitle?: string;
  seoDescription?: string;
  ogImage?: string;
  
  // Analytics
  analytics: {
    views: number;
    uniqueVisitors: number;
    formSubmissions: number;
    conversionRate: number;
    avgTimeOnPage: number;
  };
  
  // Publishing
  isPublished: boolean;
  url?: string;
  customDomain?: string;
  
  createdAt: Date;
  publishedAt?: Date;
}

// Social media automation
export interface SocialPost {
  id: string;
  projectId: string;
  videoUrl: string;
  
  // Content
  platform: DistributionPlatform;
  caption: string;
  hashtags: string[];
  mentions?: string[];
  
  // Media
  thumbnail?: string;
  
  // Scheduling
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledFor?: Date;
  publishedAt?: Date;
  
  // Engagement
  metrics: {
    likes?: number;
    comments?: number;
    shares?: number;
    views?: number;
    clicks?: number;
  };
  
  // Post ID on platform
  platformPostId?: string;
  platformUrl?: string;
  
  createdAt: Date;
}

// Analytics dashboard
export interface AnalyticsDashboard {
  projectId: string;
  
  // Overview
  overview: {
    totalViews: number;
    uniqueViewers: number;
    avgWatchTime: number;
    completionRate: number;
    engagementRate: number;
  };
  
  // Platform breakdown
  platformMetrics: {
    platform: DistributionPlatform;
    views: number;
    engagement: number;
    clicks: number;
    conversions: number;
  }[];
  
  // Geographic data
  geography: {
    country: string;
    views: number;
    percentage: number;
  }[];
  
  // Device data
  devices: {
    type: 'desktop' | 'mobile' | 'tablet';
    views: number;
    percentage: number;
  }[];
  
  // Time series data
  timeSeriesData: {
    date: string;
    views: number;
    engagement: number;
    conversions: number;
  }[];
  
  // Traffic sources
  trafficSources: {
    source: string;
    views: number;
    percentage: number;
  }[];
  
  lastUpdated: Date;
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
  
  // Interactive Elements state
  hotspots: Map<string, InteractiveHotspot[]>; // sceneId -> hotspots
  ctas: Map<string, AnimatedCTA[]>; // sceneId -> CTAs
  currentABTest: ABTest | null;
  engagementMetrics: Map<string, EngagementMetrics>; // sceneId -> metrics
  
  // Collaboration state
  teamMembers: TeamMember[];
  comments: Comment[];
  approvalRequests: ApprovalRequest[];
  versions: Version[];
  productionTimeline: ProductionTimeline | null;
  collaborationSession: CollaborationSession | null;
  currentUserId: string | null;
  currentUser: TeamMember | null;
  
  // Distribution state
  platformConnections: PlatformConnection[];
  distributionJobs: DistributionJob[];
  seoMetadata: SEOMetadata | null;
  marketingCampaigns: MarketingCampaign[];
  landingPages: LandingPage[];
  socialPosts: SocialPost[];
  analyticsDashboard: AnalyticsDashboard | null;
  
  // Export state
  exportJobs: ExportJob[];
  exportHistory: ExportHistoryEntry[];
  currentExportJob: ExportJob | null;
  isExporting: boolean;
  exportProgress: number;
  exportStatistics: ExportStatistics;
  
  // Project Management state
  allProjects: ProjectListItem[];
  projectTemplates: ProjectTemplate[];
  projectVersions: Map<string, ProjectVersion[]>; // projectId -> versions
  projectAnalytics: Map<string, ProjectAnalytics>; // projectId -> analytics
  currentProjectMetadata: ProjectMetadata | null;
  
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
  
  // Illustration Animation actions
  addIllustrationAnimation: (sceneId: string, illustrationId: string, animation: Omit<IllustrationAnimation, 'id'>) => void;
  updateIllustrationAnimation: (sceneId: string, illustrationId: string, animationId: string, updates: Partial<IllustrationAnimation>) => void;
  removeIllustrationAnimation: (sceneId: string, illustrationId: string, animationId: string) => void;
  
  // Transparent Background actions
  updateTransparentBackground: (sceneId: string, illustrationId: string, config: TransparentBackgroundConfig) => Promise<void>;
  
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
  
  // Interactive Elements actions
  addHotspot: (sceneId: string, hotspot: Omit<InteractiveHotspot, 'id' | 'clicks' | 'impressions'>) => void;
  updateHotspot: (sceneId: string, hotspotId: string, updates: Partial<InteractiveHotspot>) => void;
  deleteHotspot: (sceneId: string, hotspotId: string) => void;
  trackHotspotClick: (sceneId: string, hotspotId: string) => void;
  
  addCTA: (sceneId: string, cta: Omit<AnimatedCTA, 'id' | 'views' | 'clicks' | 'conversionRate'>) => void;
  updateCTA: (sceneId: string, ctaId: string, updates: Partial<AnimatedCTA>) => void;
  deleteCTA: (sceneId: string, ctaId: string) => void;
  trackCTAClick: (sceneId: string, ctaId: string) => void;
  
  createABTest: (test: Omit<ABTest, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateABTest: (testId: string, updates: Partial<ABTest>) => void;
  addTestVariant: (testId: string, variant: Omit<VideoVariant, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>) => void;
  updateEngagementMetrics: (sceneId: string, metrics: Partial<EngagementMetrics>) => void;
  
  // Collaboration actions
  inviteTeamMember: (member: Omit<TeamMember, 'id' | 'status' | 'joinedAt'>) => Promise<void>;
  updateTeamMember: (memberId: string, updates: Partial<TeamMember>) => void;
  removeTeamMember: (memberId: string) => void;
  setCurrentUser: (user: TeamMember) => void;
  
  addComment: (comment: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateComment: (commentId: string, updates: Partial<Comment>) => void;
  deleteComment: (commentId: string) => void;
  resolveComment: (commentId: string, userId: string) => void;
  replyToComment: (parentId: string, reply: Omit<Comment, 'id' | 'parentId' | 'createdAt' | 'updatedAt'>) => void;
  
  createApprovalRequest: (request: Omit<ApprovalRequest, 'id' | 'status' | 'approvals' | 'createdAt' | 'updatedAt'>) => void;
  respondToApproval: (requestId: string, userId: string, response: ApprovalStatus, feedback?: string) => void;
  
  createVersion: (version: Omit<Version, 'id' | 'createdAt'>) => void;
  restoreVersion: (versionId: string) => void;
  
  updateProjectStatus: (status: ProjectStatus) => void;
  updateProductionTimeline: (updates: Partial<ProductionTimeline>) => void;
  addTask: (task: Omit<ProductionTimeline['tasks'][0], 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<ProductionTimeline['tasks'][0]>) => void;
  
  // Distribution actions
  connectPlatform: (platform: Omit<PlatformConnection, 'id' | 'connectedAt'>) => Promise<void>;
  disconnectPlatform: (platformId: string) => void;
  
  distributeVideo: (platforms: DistributionPlatform[], metadata: Partial<SEOMetadata>) => Promise<string>; // returns job ID
  checkDistributionStatus: (jobId: string) => Promise<DistributionJob>;
  cancelDistribution: (jobId: string) => void;
  
  updateSEOMetadata: (metadata: Partial<SEOMetadata>) => void;
  generateThumbnails: (count: number) => Promise<string[]>; // returns thumbnail URLs
  generateCaptions: (language: SupportedLanguage) => Promise<string>; // returns caption file URL
  
  createMarketingCampaign: (campaign: Omit<MarketingCampaign, 'id' | 'createdAt'>) => void;
  updateMarketingCampaign: (campaignId: string, updates: Partial<MarketingCampaign>) => void;
  launchCampaign: (campaignId: string) => Promise<void>;
  
  createLandingPage: (page: Omit<LandingPage, 'id' | 'analytics' | 'createdAt'>) => void;
  updateLandingPage: (pageId: string, updates: Partial<LandingPage>) => void;
  publishLandingPage: (pageId: string) => Promise<string>; // returns URL
  
  scheduleSocialPost: (post: Omit<SocialPost, 'id' | 'createdAt'>) => void;
  updateSocialPost: (postId: string, updates: Partial<SocialPost>) => void;
  publishSocialPost: (postId: string) => Promise<void>;
  
  fetchAnalytics: () => Promise<void>;
  
  // Export actions
  startExport: (config: ExportConfig) => Promise<string>; // returns job ID
  startBatchExport: (config: BatchExportConfig) => Promise<string[]>; // returns job IDs
  checkExportStatus: (jobId: string) => Promise<ExportJob>;
  cancelExport: (jobId: string) => Promise<void>;
  downloadExport: (jobId: string) => Promise<void>;
  deleteExportHistory: (entryId: string) => void;
  clearExportHistory: () => void;
  getExportStatistics: () => ExportStatistics;
  
  // Project Management actions
  loadAllProjects: () => ProjectListItem[];
  duplicateProject: (projectId: string) => string; // returns new project ID
  deleteProject: (projectId: string) => void;
  archiveProject: (projectId: string) => void;
  updateProjectMetadata: (projectId: string, metadata: Partial<ProjectMetadata>) => void;
  searchProjects: (query: string) => ProjectListItem[];
  filterProjects: (filters: { category?: string; status?: string; tags?: string[] }) => ProjectListItem[];
  createProjectVersion: (description?: string) => void;
  restoreProjectVersion: (versionId: string) => void;
  getProjectAnalytics: (projectId: string) => ProjectAnalytics | null;
  incrementViewCount: (projectId: string) => void;
  incrementExportCount: (projectId: string) => void;
  trackTimeSpent: (projectId: string, seconds: number) => void;
  loadTemplates: () => ProjectTemplate[];
  createFromTemplate: (templateId: string, projectName: string) => void;
  
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}

// ============================================================================
// MULTI-FORMAT EXPORT SYSTEM
// ============================================================================

// Export format types
export type ExportFormat = 'video' | 'pdf' | 'json';

// PDF export configuration
export interface PDFExportConfig {
  format: 'presentation' | 'storyboard' | 'script';
  pageSize: 'a4' | 'letter' | 'a3' | 'custom';
  orientation: 'portrait' | 'landscape';
  includeSceneThumbnails: boolean;
  includeSceneDescriptions: boolean;
  includeVoiceoverText: boolean;
  includeTimestamps: boolean;
  includePageNumbers: boolean;
  includeBranding: boolean;
  customHeader?: string;
  customFooter?: string;
  quality: 'high' | 'medium' | 'low';
}

// JSON export configuration
export interface JSONExportConfig {
  includeMetadata: boolean;
  includeAssets: boolean; // Include base64 encoded images
  pretty: boolean; // Pretty print JSON
  version: string; // Export format version
}

// Unified export configuration
export interface ExportConfig {
  format: ExportFormat;
  projectId: string;
  projectName: string;
  
  // Format-specific configs
  videoConfig?: VideoRenderConfig;
  pdfConfig?: PDFExportConfig;
  jsonConfig?: JSONExportConfig;
  
  // Common settings
  includeWatermark: boolean;
  watermarkText?: string;
  createdBy?: string;
}

// Export job tracking
export interface ExportJob {
  id: string;
  format: ExportFormat;
  config: ExportConfig;
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progress: number; // 0-100
  startedAt: Date;
  completedAt?: Date;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number; // in bytes
  error?: string;
  exportDuration?: number; // in seconds
}

// Export history entry
export interface ExportHistoryEntry {
  id: string;
  projectId: string;
  projectName: string;
  format: ExportFormat;
  exportedAt: Date;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  thumbnail?: string;
  duration?: number; // for video exports
  pageCount?: number; // for PDF exports
}

// Batch export configuration
export interface BatchExportConfig {
  formats: ExportFormat[];
  configs: {
    video?: VideoRenderConfig;
    pdf?: PDFExportConfig;
    json?: JSONExportConfig;
  };
  simultaneousExports: boolean;
}

// Export statistics
export interface ExportStatistics {
  totalExports: number;
  exportsByFormat: Record<ExportFormat, number>;
  lastExportDate?: Date;
  totalExportedSize: number; // in bytes
  averageExportTime: number; // in seconds
}

// ============================================================================
// PROJECT MANAGEMENT
// ============================================================================

// Project metadata
export interface ProjectMetadata {
  tags: string[];
  category: 'business' | 'education' | 'marketing' | 'entertainment' | 'other';
  status: 'draft' | 'in-progress' | 'review' | 'completed' | 'archived';
  thumbnail?: string;
  lastModified: Date;
  viewCount: number;
  exportCount: number;
  timeSpent: number; // in seconds
}

// Project list item (for dashboard)
export interface ProjectListItem {
  id: string;
  name: string;
  metadata: ProjectMetadata;
  sceneCount: number;
  duration: number;
  createdAt: Date;
  updatedAt: Date;
}

// Project template
export interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: ProjectMetadata['category'];
  thumbnail: string;
  sceneCount: number;
  estimatedDuration: number;
  scenes: Omit<Scene, 'id' | 'order'>[];
  tags: string[];
}

// Project analytics
export interface ProjectAnalytics {
  projectId: string;
  views: number;
  exports: number;
  shares: number;
  timeSpent: number;
  lastAccessed: Date;
  mostEditedScenes: string[];
  popularFormats: Record<ExportFormat, number>;
}

// Project version for history
export interface ProjectVersion {
  id: string;
  projectId: string;
  versionNumber: number;
  name: string;
  description?: string;
  createdAt: Date;
  createdBy?: string;
  snapshot: Project; // Full project state
  changes: string[];
}

