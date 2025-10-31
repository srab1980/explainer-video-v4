import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { 
  StoreState, 
  Project, 
  Scene, 
  Illustration, 
  IllustrationStyle, 
  SupportedLanguage, 
  StoryAnalysis, 
  AISuggestion, 
  AudioSettings, 
  VideoRenderConfig, 
  VideoRenderJob, 
  IndustryTemplate, 
  BrandIdentity,
  InteractiveHotspot,
  AnimatedCTA,
  ABTest,
  VideoVariant,
  EngagementMetrics,
  TeamMember,
  Comment,
  ApprovalRequest,
  ApprovalStatus,
  Version,
  ProductionTimeline,
  ProjectStatus,
  PlatformConnection,
  DistributionPlatform,
  DistributionJob,
  SEOMetadata,
  MarketingCampaign,
  LandingPage,
  SocialPost,
  AnalyticsDashboard,
  IllustrationAnimation,
  TransparentBackgroundConfig,
} from './types';

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
  
  // Enhanced AI state
  currentLanguage: 'en',
  isRecording: false,
  isTranscribing: false,
  isAnalyzing: false,
  storyAnalysis: null,
  aiSuggestions: new Map(),
  
  // Video Production state
  currentRenderJob: null,
  isRendering: false,
  renderProgress: 0,
  audioSettings: {
    voiceover: {
      enabled: true,
      voice: 'alloy',
      gender: 'neutral',
      style: 'professional',
      speed: 1.0,
      pitch: 0,
      volume: 80,
    },
    backgroundMusic: {
      enabled: false,
      volume: 30,
      fadeIn: 1,
      fadeOut: 1,
      loop: true,
    },
    soundEffects: {
      enabled: true,
      transitionSounds: true,
      volume: 50,
    },
  },
  selectedTemplate: null,
  selectedBrand: null,
  videoConfig: null,

  // Interactive Elements state
  hotspots: new Map(),
  ctas: new Map(),
  currentABTest: null,
  engagementMetrics: new Map(),
  
  // Collaboration state
  teamMembers: [],
  comments: [],
  approvalRequests: [],
  versions: [],
  productionTimeline: null,
  collaborationSession: null,
  currentUserId: null,
  currentUser: null,
  
  // Distribution state
  platformConnections: [],
  distributionJobs: [],
  seoMetadata: null,
  marketingCampaigns: [],
  landingPages: [],
  socialPosts: [],
  analyticsDashboard: null,

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
          autoTransparent: true, // Enable automatic transparent background generation
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
          // Automatically include transparent background if available
          transparentImageUrl: data.transparentImageUrl || undefined,
          transparentBackground: data.hasTransparent ? {
            enabled: true,
            method: 'color-based',
            tolerance: 40,
            smoothEdges: true,
            featherAmount: 2,
          } : undefined,
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

  // Illustration Animation actions
  addIllustrationAnimation: (sceneId: string, illustrationId: string, animation: Omit<IllustrationAnimation, 'id'>) => {
    const { currentProject } = get();
    if (currentProject) {
      const newAnimation: IllustrationAnimation = {
        ...animation,
        id: `anim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      set({
        currentProject: {
          ...currentProject,
          scenes: currentProject.scenes.map((scene) =>
            scene.id === sceneId
              ? {
                  ...scene,
                  illustrations: scene.illustrations.map((ill) =>
                    ill.id === illustrationId
                      ? {
                          ...ill,
                          illustrationAnimations: [
                            ...(ill.illustrationAnimations || []),
                            newAnimation,
                          ],
                          updatedAt: new Date(),
                        }
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

  updateIllustrationAnimation: (
    sceneId: string,
    illustrationId: string,
    animationId: string,
    updates: Partial<IllustrationAnimation>
  ) => {
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
                      ? {
                          ...ill,
                          illustrationAnimations: (ill.illustrationAnimations || []).map((anim) =>
                            anim.id === animationId
                              ? { ...anim, ...updates }
                              : anim
                          ),
                          updatedAt: new Date(),
                        }
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

  removeIllustrationAnimation: (sceneId: string, illustrationId: string, animationId: string) => {
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
                      ? {
                          ...ill,
                          illustrationAnimations: (ill.illustrationAnimations || []).filter(
                            (anim) => anim.id !== animationId
                          ),
                          updatedAt: new Date(),
                        }
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

  // Transparent background actions
  updateTransparentBackground: async (
    sceneId: string,
    illustrationId: string,
    config: TransparentBackgroundConfig
  ) => {
    const { currentProject } = get();
    if (!currentProject) return;

    // Find the illustration
    const scene = currentProject.scenes.find(s => s.id === sceneId);
    const illustration = scene?.illustrations.find(ill => ill.id === illustrationId);
    
    if (!illustration || illustration.type !== 'ai-generated' || !illustration.imageUrl) {
      return;
    }

    // If enabling transparent background, process the image
    if (config.enabled && !illustration.transparentImageUrl) {
      try {
        const response = await fetch('/api/remove-background', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageUrl: illustration.imageUrl,
            method: config.method,
            config,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to remove background');
        }

        const data = await response.json();
        
        // Update illustration with transparent image and config
        get().updateIllustration(sceneId, illustrationId, {
          transparentBackground: config,
          transparentImageUrl: data.transparentImageUrl,
        });
      } catch (error) {
        console.error('Error removing background:', error);
        // Still update config even if processing failed
        get().updateIllustration(sceneId, illustrationId, {
          transparentBackground: { ...config, enabled: false },
        });
      }
    } else {
      // Just update config
      get().updateIllustration(sceneId, illustrationId, {
        transparentBackground: config,
      });
    }
  },

  // Enhanced AI actions
  transcribeVoice: async (audioBlob: Blob, language: SupportedLanguage) => {
    set({ isTranscribing: true });
    try {
      // Convert blob to base64
      const reader = new FileReader();
      const base64Data = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(audioBlob);
      });

      const response = await fetch('/api/voice-to-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          audioData: base64Data,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Transcription failed');
      }

      const data = await response.json();
      return data.transcription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw error;
    } finally {
      set({ isTranscribing: false });
    }
  },

  analyzeStory: async () => {
    const { currentProject } = get();
    if (!currentProject || !currentProject.scenes.length) {
      return;
    }

    set({ isAnalyzing: true });
    try {
      const response = await fetch('/api/analyze-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: currentProject.script,
          scenes: currentProject.scenes,
          genre: 'general',
        }),
      });

      if (!response.ok) {
        throw new Error('Story analysis failed');
      }

      const data = await response.json();
      set({ storyAnalysis: data.analysis });
    } catch (error) {
      console.error('Story analysis error:', error);
      throw error;
    } finally {
      set({ isAnalyzing: false });
    }
  },

  generateAISuggestions: async (sceneId: string) => {
    const { currentProject, aiSuggestions } = get();
    if (!currentProject) return;

    const scene = currentProject.scenes.find(s => s.id === sceneId);
    if (!scene) return;

    try {
      const response = await fetch('/api/ai-suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scene,
          projectContext: {
            genre: 'general',
            targetAudience: 'general',
            purpose: 'presentation',
          },
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate suggestions');
      }

      const data = await response.json();
      const newSuggestions = new Map(aiSuggestions);
      newSuggestions.set(sceneId, data.suggestions);
      set({ aiSuggestions: newSuggestions });
    } catch (error) {
      console.error('AI suggestions error:', error);
      throw error;
    }
  },

  applySmartTransitions: async () => {
    const { currentProject } = get();
    if (!currentProject || currentProject.scenes.length < 2) {
      return;
    }

    try {
      const response = await fetch('/api/smart-transitions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          scenes: currentProject.scenes,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate transitions');
      }

      const data = await response.json();
      
      // Apply the suggested transitions
      const updatedScenes = currentProject.scenes.map(scene => {
        const suggestion = data.suggestions.find((s: any) => s.sceneId === scene.id);
        if (suggestion?.transition) {
          return {
            ...scene,
            animation: suggestion.transition.type,
          };
        }
        return scene;
      });

      set({
        currentProject: {
          ...currentProject,
          scenes: updatedScenes,
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    } catch (error) {
      console.error('Smart transitions error:', error);
      throw error;
    }
  },

  translateProject: async (targetLanguage: SupportedLanguage) => {
    const { currentProject } = get();
    if (!currentProject) return;

    try {
      // Translate script
      const scriptResponse = await fetch('/api/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentProject.script,
          sourceLanguage: get().currentLanguage,
          targetLanguage,
          context: 'script',
        }),
      });

      if (!scriptResponse.ok) {
        throw new Error('Translation failed');
      }

      const scriptData = await scriptResponse.json();

      // Translate each scene
      const translatedScenes = await Promise.all(
        currentProject.scenes.map(async (scene) => {
          const titleResponse = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: scene.title,
              sourceLanguage: get().currentLanguage,
              targetLanguage,
              context: 'scene_title',
            }),
          });

          const descResponse = await fetch('/api/translate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              text: scene.description,
              sourceLanguage: get().currentLanguage,
              targetLanguage,
              context: 'description',
            }),
          });

          const titleData = await titleResponse.json();
          const descData = await descResponse.json();

          return {
            ...scene,
            title: titleData.translatedText || scene.title,
            description: descData.translatedText || scene.description,
          };
        })
      );

      set({
        currentProject: {
          ...currentProject,
          script: scriptData.translatedText || currentProject.script,
          scenes: translatedScenes,
          updatedAt: new Date(),
        },
        currentLanguage: targetLanguage,
      });
      get().saveToLocalStorage();
    } catch (error) {
      console.error('Translation error:', error);
      throw error;
    }
  },

  setLanguage: (language: SupportedLanguage) => {
    set({ currentLanguage: language });
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

  // Video Production actions
  setVideoConfig: (config: VideoRenderConfig) => {
    set({ videoConfig: config });
  },

  setAudioSettings: (settings: AudioSettings) => {
    set({ audioSettings: settings });
  },

  setTemplate: (template: IndustryTemplate) => {
    set({ selectedTemplate: template });
  },

  setBrand: (brand: BrandIdentity) => {
    set({ selectedBrand: brand });
  },

  startVideoRender: async (config: VideoRenderConfig) => {
    const { currentProject } = get();
    if (!currentProject) {
      throw new Error('No project loaded');
    }

    set({ isRendering: true, renderProgress: 0 });

    try {
      const response = await fetch('/api/render-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: currentProject.id,
          config,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to start render');
      }

      const jobId = data.jobId;

      // Poll for job status
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/render-video?jobId=${jobId}`);
          const statusData = await statusResponse.json();

          if (statusData.job) {
            set({
              currentRenderJob: statusData.job,
              renderProgress: statusData.job.progress,
            });

            if (statusData.job.status === 'completed' || statusData.job.status === 'failed') {
              clearInterval(pollInterval);
              set({ isRendering: false });
            }
          }
        } catch (error) {
          console.error('Status poll error:', error);
        }
      }, 2000);

      return jobId;
    } catch (error) {
      set({ isRendering: false });
      throw error;
    }
  },

  checkRenderStatus: async (jobId: string) => {
    const response = await fetch(`/api/render-video?jobId=${jobId}`);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to check render status');
    }

    return data.job;
  },

  cancelRender: async (jobId: string) => {
    set({
      isRendering: false,
      currentRenderJob: null,
      renderProgress: 0,
    });
  },

  generateVoiceover: async (text: string, voice: string, language: SupportedLanguage) => {
    try {
      const response = await fetch('/api/generate-voiceover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, voice, speed: 1.0, language }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate voiceover');
      }

      return data.audioUrl;
    } catch (error) {
      throw error;
    }
  },

  // Interactive Elements actions
  addHotspot: (sceneId: string, hotspot) => {
    const { hotspots } = get();
    const sceneHotspots = hotspots.get(sceneId) || [];
    const newHotspot: InteractiveHotspot = {
      ...hotspot,
      id: uuidv4(),
      clicks: 0,
      impressions: 0,
    };
    hotspots.set(sceneId, [...sceneHotspots, newHotspot]);
    set({ hotspots: new Map(hotspots) });
    get().saveToLocalStorage();
  },

  updateHotspot: (sceneId: string, hotspotId: string, updates) => {
    const { hotspots } = get();
    const sceneHotspots = hotspots.get(sceneId) || [];
    const updatedHotspots = sceneHotspots.map(h =>
      h.id === hotspotId ? { ...h, ...updates } : h
    );
    hotspots.set(sceneId, updatedHotspots);
    set({ hotspots: new Map(hotspots) });
    get().saveToLocalStorage();
  },

  deleteHotspot: (sceneId: string, hotspotId: string) => {
    const { hotspots } = get();
    const sceneHotspots = hotspots.get(sceneId) || [];
    hotspots.set(sceneId, sceneHotspots.filter(h => h.id !== hotspotId));
    set({ hotspots: new Map(hotspots) });
    get().saveToLocalStorage();
  },

  trackHotspotClick: (sceneId: string, hotspotId: string) => {
    const { hotspots } = get();
    const sceneHotspots = hotspots.get(sceneId) || [];
    const updatedHotspots = sceneHotspots.map(h =>
      h.id === hotspotId ? { ...h, clicks: h.clicks + 1 } : h
    );
    hotspots.set(sceneId, updatedHotspots);
    set({ hotspots: new Map(hotspots) });
  },

  addCTA: (sceneId: string, cta) => {
    const { ctas } = get();
    const sceneCTAs = ctas.get(sceneId) || [];
    const newCTA: AnimatedCTA = {
      ...cta,
      id: uuidv4(),
      views: 0,
      clicks: 0,
      conversionRate: 0,
    };
    ctas.set(sceneId, [...sceneCTAs, newCTA]);
    set({ ctas: new Map(ctas) });
    get().saveToLocalStorage();
  },

  updateCTA: (sceneId: string, ctaId: string, updates) => {
    const { ctas } = get();
    const sceneCTAs = ctas.get(sceneId) || [];
    const updatedCTAs = sceneCTAs.map(c =>
      c.id === ctaId ? { ...c, ...updates } : c
    );
    ctas.set(sceneId, updatedCTAs);
    set({ ctas: new Map(ctas) });
    get().saveToLocalStorage();
  },

  deleteCTA: (sceneId: string, ctaId: string) => {
    const { ctas } = get();
    const sceneCTAs = ctas.get(sceneId) || [];
    ctas.set(sceneId, sceneCTAs.filter(c => c.id !== ctaId));
    set({ ctas: new Map(ctas) });
    get().saveToLocalStorage();
  },

  trackCTAClick: (sceneId: string, ctaId: string) => {
    const { ctas } = get();
    const sceneCTAs = ctas.get(sceneId) || [];
    const updatedCTAs = sceneCTAs.map(c =>
      c.id === ctaId ? { 
        ...c, 
        clicks: c.clicks + 1,
        conversionRate: ((c.clicks + 1) / (c.views || 1)) * 100
      } : c
    );
    ctas.set(sceneId, updatedCTAs);
    set({ ctas: new Map(ctas) });
  },

  createABTest: (test) => {
    const newTest: ABTest = {
      ...test,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set({ currentABTest: newTest });
    get().saveToLocalStorage();
  },

  updateABTest: (testId: string, updates) => {
    const { currentABTest } = get();
    if (currentABTest && currentABTest.id === testId) {
      set({
        currentABTest: {
          ...currentABTest,
          ...updates,
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  addTestVariant: (testId: string, variant) => {
    const { currentABTest } = get();
    if (currentABTest && currentABTest.id === testId) {
      const newVariant: VideoVariant = {
        ...variant,
        id: uuidv4(),
        metrics: {
          views: 0,
          completionRate: 0,
          avgWatchTime: 0,
          clickThroughRate: 0,
          conversions: 0,
          engagement: 0,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      set({
        currentABTest: {
          ...currentABTest,
          testVariants: [...currentABTest.testVariants, newVariant],
          updatedAt: new Date(),
        },
      });
      get().saveToLocalStorage();
    }
  },

  updateEngagementMetrics: (sceneId: string, metrics) => {
    const { engagementMetrics } = get();
    const currentMetrics = engagementMetrics.get(sceneId) || {
      sceneId,
      views: 0,
      uniqueViews: 0,
      avgWatchTime: 0,
      completionRate: 0,
      dropOffRate: 0,
      rewatchRate: 0,
      hotspotsClicked: {},
      ctaClicks: {},
      pausePoints: [],
      skipPoints: [],
      clickHeatmap: [],
      attentionHeatmap: [],
      lastUpdated: new Date(),
    };
    engagementMetrics.set(sceneId, {
      ...currentMetrics,
      ...metrics,
      lastUpdated: new Date(),
    });
    set({ engagementMetrics: new Map(engagementMetrics) });
  },

  // Collaboration actions
  inviteTeamMember: async (member) => {
    const newMember: TeamMember = {
      ...member,
      id: uuidv4(),
      status: 'invited',
      joinedAt: new Date(),
    };
    const { teamMembers } = get();
    set({ teamMembers: [...teamMembers, newMember] });
    get().saveToLocalStorage();
  },

  updateTeamMember: (memberId: string, updates) => {
    const { teamMembers } = get();
    set({
      teamMembers: teamMembers.map(m =>
        m.id === memberId ? { ...m, ...updates } : m
      ),
    });
    get().saveToLocalStorage();
  },

  removeTeamMember: (memberId: string) => {
    const { teamMembers } = get();
    set({ teamMembers: teamMembers.filter(m => m.id !== memberId) });
    get().saveToLocalStorage();
  },

  setCurrentUser: (user) => {
    set({ currentUser: user, currentUserId: user.id });
  },

  addComment: (comment) => {
    const newComment: Comment = {
      ...comment,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { comments } = get();
    set({ comments: [...comments, newComment] });
    get().saveToLocalStorage();
  },

  updateComment: (commentId: string, updates) => {
    const { comments } = get();
    set({
      comments: comments.map(c =>
        c.id === commentId ? { ...c, ...updates, updatedAt: new Date() } : c
      ),
    });
    get().saveToLocalStorage();
  },

  deleteComment: (commentId: string) => {
    const { comments } = get();
    set({ comments: comments.filter(c => c.id !== commentId) });
    get().saveToLocalStorage();
  },

  resolveComment: (commentId: string, userId: string) => {
    const { comments } = get();
    set({
      comments: comments.map(c =>
        c.id === commentId
          ? {
              ...c,
              status: 'resolved' as const,
              resolvedBy: userId,
              resolvedAt: new Date(),
              updatedAt: new Date(),
            }
          : c
      ),
    });
    get().saveToLocalStorage();
  },

  replyToComment: (parentId: string, reply) => {
    const newReply: Comment = {
      ...reply,
      id: uuidv4(),
      parentId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { comments } = get();
    set({ comments: [...comments, newReply] });
    get().saveToLocalStorage();
  },

  createApprovalRequest: (request) => {
    const newRequest: ApprovalRequest = {
      ...request,
      id: uuidv4(),
      status: 'pending',
      approvals: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const { approvalRequests } = get();
    set({ approvalRequests: [...approvalRequests, newRequest] });
    get().saveToLocalStorage();
  },

  respondToApproval: (requestId: string, userId: string, response, feedback) => {
    const { approvalRequests, teamMembers } = get();
    const user = teamMembers.find(m => m.id === userId);
    if (!user) return;

    set({
      approvalRequests: approvalRequests.map(r =>
        r.id === requestId
          ? {
              ...r,
              approvals: [
                ...r.approvals,
                {
                  userId,
                  userName: user.name,
                  status: response,
                  feedback,
                  timestamp: new Date(),
                },
              ],
              status: response,
              updatedAt: new Date(),
            }
          : r
      ),
    });
    get().saveToLocalStorage();
  },

  createVersion: (version) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const newVersion: Version = {
      ...version,
      id: uuidv4(),
      snapshot: currentProject,
      createdAt: new Date(),
    };
    const { versions } = get();
    set({ versions: [...versions, newVersion] });
    get().saveToLocalStorage();
  },

  restoreVersion: (versionId: string) => {
    const { versions } = get();
    const version = versions.find(v => v.id === versionId);
    if (version) {
      set({ currentProject: version.snapshot });
      get().saveToLocalStorage();
    }
  },

  updateProjectStatus: (status) => {
    const { productionTimeline } = get();
    if (productionTimeline) {
      set({
        productionTimeline: {
          ...productionTimeline,
          status,
        },
      });
      get().saveToLocalStorage();
    }
  },

  updateProductionTimeline: (updates) => {
    const { productionTimeline } = get();
    if (productionTimeline) {
      set({
        productionTimeline: {
          ...productionTimeline,
          ...updates,
        },
      });
      get().saveToLocalStorage();
    }
  },

  addTask: (task) => {
    const { productionTimeline } = get();
    if (!productionTimeline) return;

    const newTask = {
      ...task,
      id: uuidv4(),
      createdAt: new Date(),
    };
    set({
      productionTimeline: {
        ...productionTimeline,
        tasks: [...productionTimeline.tasks, newTask],
      },
    });
    get().saveToLocalStorage();
  },

  updateTask: (taskId: string, updates) => {
    const { productionTimeline } = get();
    if (!productionTimeline) return;

    set({
      productionTimeline: {
        ...productionTimeline,
        tasks: productionTimeline.tasks.map(t =>
          t.id === taskId ? { ...t, ...updates } : t
        ),
      },
    });
    get().saveToLocalStorage();
  },

  // Distribution actions
  connectPlatform: async (platform) => {
    const newConnection: PlatformConnection = {
      ...platform,
      id: uuidv4(),
      connectedAt: new Date(),
    };
    const { platformConnections } = get();
    set({ platformConnections: [...platformConnections, newConnection] });
    get().saveToLocalStorage();
  },

  disconnectPlatform: (platformId: string) => {
    const { platformConnections } = get();
    set({
      platformConnections: platformConnections.filter(p => p.id !== platformId),
    });
    get().saveToLocalStorage();
  },

  distributeVideo: async (platforms, metadata) => {
    const jobId = uuidv4();
    const { currentProject } = get();
    if (!currentProject) throw new Error('No project selected');

    const distributionJob: DistributionJob = {
      id: jobId,
      projectId: currentProject.id,
      videoUrl: '', // Will be set after render
      platforms: platforms.map(p => ({
        platform: p,
        status: 'pending',
        progress: 0,
      })),
      overallStatus: 'pending',
      createdAt: new Date(),
    };

    const { distributionJobs } = get();
    set({ distributionJobs: [...distributionJobs, distributionJob] });

    // Update SEO metadata
    if (metadata) {
      get().updateSEOMetadata(metadata);
    }

    return jobId;
  },

  checkDistributionStatus: async (jobId: string) => {
    const { distributionJobs } = get();
    const job = distributionJobs.find(j => j.id === jobId);
    if (!job) throw new Error('Job not found');
    return job;
  },

  cancelDistribution: (jobId: string) => {
    const { distributionJobs } = get();
    set({
      distributionJobs: distributionJobs.filter(j => j.id !== jobId),
    });
  },

  updateSEOMetadata: (metadata) => {
    const { seoMetadata, currentProject } = get();
    if (!currentProject) return;

    const updated: SEOMetadata = {
      projectId: currentProject.id,
      title: metadata.title || seoMetadata?.title || currentProject.name,
      description: metadata.description || seoMetadata?.description || '',
      tags: metadata.tags || seoMetadata?.tags || [],
      thumbnails: metadata.thumbnails || seoMetadata?.thumbnails || [],
      captions: metadata.captions || seoMetadata?.captions || [],
      keywords: metadata.keywords || seoMetadata?.keywords || { primary: [], secondary: [] },
      lastUpdated: new Date(),
    };

    set({ seoMetadata: updated });
    get().saveToLocalStorage();
  },

  generateThumbnails: async (count: number) => {
    // Mock implementation - would call API to generate thumbnails
    const thumbnails: string[] = [];
    for (let i = 0; i < count; i++) {
      thumbnails.push(`/api/thumbnails/generated-${uuidv4()}.jpg`);
    }
    return thumbnails;
  },

  generateCaptions: async (language) => {
    // Mock implementation - would call Whisper API
    return `/api/captions/${language}-${uuidv4()}.srt`;
  },

  createMarketingCampaign: (campaign) => {
    const newCampaign: MarketingCampaign = {
      ...campaign,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const { marketingCampaigns } = get();
    set({ marketingCampaigns: [...marketingCampaigns, newCampaign] });
    get().saveToLocalStorage();
  },

  updateMarketingCampaign: (campaignId: string, updates) => {
    const { marketingCampaigns } = get();
    set({
      marketingCampaigns: marketingCampaigns.map(c =>
        c.id === campaignId ? { ...c, ...updates } : c
      ),
    });
    get().saveToLocalStorage();
  },

  launchCampaign: async (campaignId: string) => {
    const { marketingCampaigns } = get();
    set({
      marketingCampaigns: marketingCampaigns.map(c =>
        c.id === campaignId
          ? { ...c, status: 'active', launchedAt: new Date() }
          : c
      ),
    });
    get().saveToLocalStorage();
  },

  createLandingPage: (page) => {
    const newPage: LandingPage = {
      ...page,
      id: uuidv4(),
      analytics: {
        views: 0,
        uniqueVisitors: 0,
        formSubmissions: 0,
        conversionRate: 0,
        avgTimeOnPage: 0,
      },
      isPublished: false,
      createdAt: new Date(),
    };
    const { landingPages } = get();
    set({ landingPages: [...landingPages, newPage] });
    get().saveToLocalStorage();
  },

  updateLandingPage: (pageId: string, updates) => {
    const { landingPages } = get();
    set({
      landingPages: landingPages.map(p =>
        p.id === pageId ? { ...p, ...updates } : p
      ),
    });
    get().saveToLocalStorage();
  },

  publishLandingPage: async (pageId: string) => {
    const url = `https://storyvid.page/${pageId}`;
    const { landingPages } = get();
    set({
      landingPages: landingPages.map(p =>
        p.id === pageId
          ? {
              ...p,
              isPublished: true,
              url,
              publishedAt: new Date(),
            }
          : p
      ),
    });
    get().saveToLocalStorage();
    return url;
  },

  scheduleSocialPost: (post) => {
    const newPost: SocialPost = {
      ...post,
      id: uuidv4(),
      createdAt: new Date(),
    };
    const { socialPosts } = get();
    set({ socialPosts: [...socialPosts, newPost] });
    get().saveToLocalStorage();
  },

  updateSocialPost: (postId: string, updates) => {
    const { socialPosts } = get();
    set({
      socialPosts: socialPosts.map(p =>
        p.id === postId ? { ...p, ...updates } : p
      ),
    });
    get().saveToLocalStorage();
  },

  publishSocialPost: async (postId: string) => {
    const { socialPosts } = get();
    set({
      socialPosts: socialPosts.map(p =>
        p.id === postId
          ? {
              ...p,
              status: 'published',
              publishedAt: new Date(),
            }
          : p
      ),
    });
    get().saveToLocalStorage();
  },

  fetchAnalytics: async () => {
    const { currentProject } = get();
    if (!currentProject) return;

    // Mock analytics data
    const analytics: AnalyticsDashboard = {
      projectId: currentProject.id,
      overview: {
        totalViews: 1250,
        uniqueViewers: 980,
        avgWatchTime: 145,
        completionRate: 72.5,
        engagementRate: 68.3,
      },
      platformMetrics: [
        {
          platform: 'youtube',
          views: 650,
          engagement: 425,
          clicks: 89,
          conversions: 23,
        },
        {
          platform: 'linkedin',
          views: 380,
          engagement: 290,
          clicks: 67,
          conversions: 18,
        },
        {
          platform: 'vimeo',
          views: 220,
          engagement: 165,
          clicks: 34,
          conversions: 8,
        },
      ],
      geography: [
        { country: 'United States', views: 520, percentage: 41.6 },
        { country: 'United Kingdom', views: 215, percentage: 17.2 },
        { country: 'Canada', views: 185, percentage: 14.8 },
      ],
      devices: [
        { type: 'desktop', views: 725, percentage: 58 },
        { type: 'mobile', views: 425, percentage: 34 },
        { type: 'tablet', views: 100, percentage: 8 },
      ],
      timeSeriesData: [],
      trafficSources: [
        { source: 'Direct', views: 450, percentage: 36 },
        { source: 'Social Media', views: 380, percentage: 30.4 },
        { source: 'Email', views: 250, percentage: 20 },
      ],
      lastUpdated: new Date(),
    };

    set({ analyticsDashboard: analytics });
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
