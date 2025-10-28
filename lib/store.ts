import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { StoreState, Project, Scene, Illustration } from './types';

const STORAGE_KEY = 'storyvid-project';

export const useStore = create<StoreState>((set, get) => ({
  // Initial state
  currentProject: null,
  selectedSceneId: null,
  isGenerating: false,
  isSaving: false,
  lastSaved: null,

  // Project actions
  createProject: (name: string) => {
    const project: Project = {
      id: uuidv4(),
      name,
      script: '',
      scenes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
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

  generateScenes: async (script: string) => {
    set({ isGenerating: true });
    try {
      const response = await fetch('/api/generate-scenes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ script }),
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

        set({
          currentProject: {
            ...currentProject,
            scenes,
            updatedAt: new Date(),
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
                    ill.id === illustrationId ? { ...ill, ...updates } : ill
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

  selectScene: (sceneId: string | null) => {
    set({ selectedSceneId: sceneId });
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
