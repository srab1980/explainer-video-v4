import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { StoreState, Project, Scene, Illustration, IllustrationStyle } from './types';

const STORAGE_KEY = 'storyvid-project';

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  currentProject: null,
  selectedSceneId: null,
  selectedIllustrationIds: [],
  isGenerating: false,
  isGeneratingImage: false,
  isSaving: false,
  lastSaved: null,
  showGridGuides: false,
  snapToGrid: false,
  gridSize: 20,

  // Project actions
  createProject: (name: string) => {
    const project: Project = {
      id: uuidv4(),
      name,
      script: '',
      scenes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      defaultIllustrationStyle: 'modern-flat',
      colorPalette: ['#8B5CF6', '#14B8A6', '#F59E0B', '#EF4444', '#3B82F6', '#10B981', '#EC4899', '#F97316'],
      usageTracking: {
        dalleGenerations: 0,
        lastReset: new Date(),
      },
    };
    set({ currentProject: project });
    get().saveToLocalStorage();
  },

  loadProject: (projectId: string) => {
    const stored = localStorage.getItem(`${STORAGE_KEY}-${projectId}`);
    if (stored) {
      const project = JSON.parse(stored);
      project.createdAt = new Date(project.createdAt);
      project.updatedAt = new Date(project.updatedAt);
      if (project.usageTracking) {
        project.usageTracking.lastReset = new Date(project.usageTracking.lastReset);
      }
      set({ currentProject: project });
    }
  },

  updateProjectName: (name: string) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          name,
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  updateScript: (script: string) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          script,
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  generateScenes: async (script: string, options = {}) => {
    set({ isGenerating: true });
    try {
      const { useAIImages = false, style = 'modern-flat' } = options;
      
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          script, 
          useAIImages,
          illustrationStyle: style 
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate scenes');
      }

      const data = await response.json();
      const { currentProject } = get();

      if (currentProject && data.scenes) {
        const scenes: Scene[] = data.scenes.map((scene: Omit<Scene, 'id' | 'order'>, index: number) => ({
          ...scene,
          id: uuidv4(),
          order: index,
        }));

        // Update usage tracking if AI images were used
        const usageTracking = currentProject.usageTracking || {
          dalleGenerations: 0,
          lastReset: new Date(),
        };

        if (useAIImages) {
          usageTracking.dalleGenerations += scenes.length;
        }

        set({
          currentProject: {
            ...currentProject,
            scenes,
            updatedAt: new Date(),
            usageTracking,
          },
        });
        get().saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error generating scenes:', error);
      throw error;
    } finally {
      set({ isGenerating: false });
    }
  },

  // Scene actions
  addScene: (scene: Omit<Scene, 'id' | 'order'>) => {
    const { currentProject } = get();
    if (currentProject) {
      const newScene: Scene = {
        ...scene,
        id: uuidv4(),
        order: currentProject.scenes.length,
      };
      set({
        currentProject: {
          ...currentProject,
          scenes: [...currentProject.scenes, newScene],
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  updateScene: (sceneId: string, updates: Partial<Scene>) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId ? { ...scene, ...updates } : scene
          ),
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  deleteScene: (sceneId: string) => {
    const { currentProject, selectedSceneId } = get();
    if (currentProject) {
      const filteredScenes = currentProject.scenes
        .filter((scene) => scene.id !== sceneId)
        .map((scene, index) => ({ ...scene, order: index }));

      set({
        currentProject: {
          ...currentProject,
          scenes: filteredScenes,
          updatedAt: new Date(),
        },
        selectedSceneId: selectedSceneId === sceneId ? null : selectedSceneId,
      });
      get().saveToLocalStorage();
    }
  },

  reorderScenes: (sceneIds: string[]) => {
    const { currentProject } = get();
    if (currentProject) {
      const sceneMap = new Map(currentProject.scenes.map((s) => [s.id, s]));
      const reorderedScenes = sceneIds
        .map((id) => sceneMap.get(id))
        .filter((s): s is Scene => s !== undefined)
        .map((scene, index) => ({ ...scene, order: index }));

      set({
        currentProject: {
          ...currentProject,
          scenes: reorderedScenes,
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  duplicateScene: (sceneId: string) => {
    const { currentProject } = get();
    if (currentProject) {
      const sceneToDuplicate = currentProject.scenes.find((s) => s.id === sceneId);
      if (sceneToDuplicate) {
        const duplicated: Scene = {
          ...sceneToDuplicate,
          id: uuidv4(),
          title: `${sceneToDuplicate.title} (Copy)`,
          order: currentProject.scenes.length,
          illustrations: sceneToDuplicate.illustrations.map((ill) => ({
            ...ill,
            id: uuidv4(),
          })),
        };
        set({
          currentProject: {
            ...currentProject,
            scenes: [...currentProject.scenes, duplicated],
            updatedAt: new Date(),
          },
        });
        get().saveToLocalStorage();
      }
    }
  },

  // Illustration actions
  addIllustration: (sceneId: string, illustration: Omit<Illustration, 'id'>) => {
    const { currentProject } = get();
    if (currentProject) {
      const newIllustration: Illustration = {
        ...illustration,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId
              ? { ...scene, illustrations: [...scene.illustrations, newIllustration] }
              : scene
          ),
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  updateIllustration: (sceneId: string, illustrationId: string, updates: Partial<Illustration>) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  illustrations: scene.illustrations.map((ill) =>
                    ill.id === illustrationId 
                      ? { ...ill, ...updates, updatedAt: new Date() } 
                      : ill
                  ),
                }
              : scene
          ),
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  deleteIllustration: (sceneId: string, illustrationId: string) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  illustrations: scene.illustrations.filter((ill) => ill.id !== illustrationId),
                }
              : scene
          ),
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  generateAIIllustration: async (
    sceneId: string, 
    prompt: string, 
    style: IllustrationStyle,
    customStyleDescription?: string
  ) => {
    set({ isGeneratingImage: true });
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt, 
          style, 
          customStyleDescription,
          size: '1024x1024',
          quality: 'standard',
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to generate image');
      }

      const data = await response.json();
      const { currentProject } = get();

      if (currentProject && data.imageUrl) {
        // Find the scene and get a suitable position
        const scene = currentProject.scenes.find(s => s.id === sceneId);
        const illustrationCount = scene?.illustrations.length || 0;
        
        const newIllustration: Omit<Illustration, 'id'> = {
          type: 'ai-generated',
          imageUrl: data.imageUrl,
          imagePrompt: data.prompt,
          style,
          customStyleDescription,
          position: { x: 50, y: 50 },
          size: 400,
          color: scene?.backgroundColor || '#8B5CF6',
          rotation: 0,
          layer: {
            zIndex: illustrationCount,
            locked: false,
            visible: true,
            opacity: 100,
          },
        };

        get().addIllustration(sceneId, newIllustration);

        // Update usage tracking
        const usageTracking = currentProject.usageTracking || {
          dalleGenerations: 0,
          lastReset: new Date(),
        };
        usageTracking.dalleGenerations += 1;

        set({
          currentProject: {
            ...currentProject,
            usageTracking,
          },
        });
        get().saveToLocalStorage();
      }
    } catch (error) {
      console.error('Error generating AI illustration:', error);
      throw error;
    } finally {
      set({ isGeneratingImage: false });
    }
  },

  // Multi-select actions
  selectIllustrations: (illustrationIds: string[]) => {
    set({ selectedIllustrationIds: illustrationIds });
  },

  batchUpdateIllustrations: (sceneId: string, illustrationIds: string[], updates: Partial<Illustration>) => {
    const { currentProject } = get();
    if (currentProject) {
      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  illustrations: scene.illustrations.map((ill) =>
                    illustrationIds.includes(ill.id)
                      ? { ...ill, ...updates, updatedAt: new Date() }
                      : ill
                  ),
                }
              : scene
          ),
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  selectScene: (sceneId: string | null) => {
    set({ selectedSceneId: sceneId, selectedIllustrationIds: [] });
  },

  // UI settings
  toggleGridGuides: () => {
    set((state) => ({ showGridGuides: !state.showGridGuides }));
  },

  toggleSnapToGrid: () => {
    set((state) => ({ snapToGrid: !state.snapToGrid }));
  },

  setGridSize: (size: number) => {
    set({ gridSize: size });
  },

  // Persistence
  saveToLocalStorage: () => {
    const { currentProject } = get();
    if (currentProject) {
      set({ isSaving: true });
      setTimeout(() => {
        localStorage.setItem(`${STORAGE_KEY}-${currentProject.id}`, JSON.stringify(currentProject));
        localStorage.setItem(`${STORAGE_KEY}-current`, currentProject.id);
        set({ isSaving: false, lastSaved: new Date() });
      }, 300);
    }
  },

  loadFromLocalStorage: () => {
    const currentId = localStorage.getItem(`${STORAGE_KEY}-current`);
    if (currentId) {
      get().loadProject(currentId);
    }
  },
}));
