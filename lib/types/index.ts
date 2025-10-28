// Animation types
export type AnimationType = 'fade' | 'slide' | 'zoom' | 'bounce';

// Layout types
export type LayoutType = 
  | 'horizontal-row'
  | 'vertical-stack'
  | 'grid-2x2'
  | 'grid-3x3'
  | 'centered-large'
  | 'side-by-side'
  | 'scattered'
  | 'editorial';

// Illustration represents a visual element (icon) in a scene
export interface Illustration {
  id: string;
  iconName: string; // Name of the icon from Lucide/Heroicons
  iconLibrary: 'lucide' | 'heroicons'; // Which library the icon comes from
  position: { x: number; y: number }; // Position in percentage (0-100)
  size: number; // Size in pixels
  color: string; // Hex color
  rotation: number; // Rotation in degrees
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
  backgroundColor: string; // Hex color
  textColor: string; // Hex color
  order: number; // Order in the timeline
}

// Project represents the entire storyboard project
export interface Project {
  id: string;
  name: string;
  script: string; // Original script text
  scenes: Scene[];
  createdAt: Date;
  updatedAt: Date;
}

// Layout configuration for positioning illustrations
export interface LayoutConfig {
  type: LayoutType;
  positions: Array<{ x: number; y: number; size: number }>;
}

// API request/response types
export interface GenerateScenesRequest {
  script: string;
}

export interface GenerateScenesResponse {
  scenes: Omit<Scene, 'id' | 'order'>[];
  error?: string;
}

// Store state type
export interface StoreState {
  // State
  currentProject: Project | null;
  selectedSceneId: string | null;
  isGenerating: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  
  // Actions
  createProject: (name: string) => void;
  loadProject: (projectId: string) => void;
  updateProjectName: (name: string) => void;
  updateScript: (script: string) => void;
  generateScenes: (script: string) => Promise<void>;
  
  addScene: (scene: Omit<Scene, 'id' | 'order'>) => void;
  updateScene: (sceneId: string, updates: Partial<Scene>) => void;
  deleteScene: (sceneId: string) => void;
  reorderScenes: (sceneIds: string[]) => void;
  duplicateScene: (sceneId: string) => void;
  
  addIllustration: (sceneId: string, illustration: Omit<Illustration, 'id'>) => void;
  updateIllustration: (sceneId: string, illustrationId: string, updates: Partial<Illustration>) => void;
  deleteIllustration: (sceneId: string, illustrationId: string) => void;
  
  selectScene: (sceneId: string | null) => void;
  
  saveToLocalStorage: () => void;
  loadFromLocalStorage: () => void;
}
