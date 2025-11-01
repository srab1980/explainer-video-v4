import { describe, it, expect, beforeEach } from 'vitest'
import { act } from '@testing-library/react'
import { useStoryVidStore, createScene, generateScenes } from '@/lib/store'

describe('StoryVid Store', () => {
  beforeEach(() => {
    // Reset store before each test
    const store = useStoryVidStore.getState()
    store.reset()
  })

  describe('Initial State', () => {
    it('should have correct initial state', () => {
      const store = useStoryVidStore.getState()
      expect(store.project).toBeNull()
      expect(store.scenes).toEqual([])
      expect(store.currentScene).toBeNull()
      expect(store.isGenerating).toBe(false)
      expect(store.audioSettings).toEqual({})
      expect(store.videoSettings).toEqual({})
    })
  })

  describe('Scene Management', () => {
    it('should create scene correctly', () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        const scene = createScene({
          title: 'Test Scene',
          description: 'Test Description',
          duration: 5,
          storyboard: []
        })
        
        store.setCurrentScene(scene)
      })

      const state = useStoryVidStore.getState()
      expect(state.currentScene).toBeDefined()
      expect(state.currentScene?.title).toBe('Test Scene')
      expect(state.currentScene?.description).toBe('Test Description')
    })

    it('should handle scene updates', () => {
      const store = useStoryVidStore.getState()
      
      // First create a scene
      act(() => {
        const scene = createScene({
          title: 'Original Title',
          description: 'Original Description',
          duration: 5,
          storyboard: []
        })
        
        store.setCurrentScene(scene)
      })

      // Then update it
      act(() => {
        const updatedScene = {
          ...store.currentScene!,
          title: 'Updated Title'
        }
        store.setCurrentScene(updatedScene)
      })

      expect(store.currentScene?.title).toBe('Updated Title')
    })

    it('should add scenes to project', () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        store.createProject('Test Project')
      })

      act(() => {
        const scene1 = createScene({
          title: 'Scene 1',
          description: 'Description 1',
          duration: 5,
          storyboard: []
        })
        
        const scene2 = createScene({
          title: 'Scene 2',
          description: 'Description 2',
          duration: 6,
          storyboard: []
        })

        store.addScene(scene1)
        store.addScene(scene2)
      })

      expect(store.scenes).toHaveLength(2)
      expect(store.project?.scenes).toHaveLength(2)
    })
  })

  describe('Project Management', () => {
    it('should create project correctly', () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        store.createProject('My Test Project')
      })

      expect(store.project).toBeDefined()
      expect(store.project?.name).toBe('My Test Project')
      expect(store.project?.scenes).toEqual([])
    })

    it('should update project settings', () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        store.createProject('Test Project')
        store.updateProjectSettings({
          title: 'Updated Project Title',
          description: 'Updated Description'
        })
      })

      expect(store.project?.title).toBe('Updated Project Title')
      expect(store.project?.description).toBe('Updated Description')
    })
  })

  describe('Generation Functions', () => {
    it('should handle scene generation', async () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        store.createProject('Test Project')
      })

      await act(async () => {
        await generateScenes({
          topic: 'Technology Trends',
          style: 'modern',
          duration: 60
        })
      })

      expect(store.scenes.length).toBeGreaterThan(0)
      expect(store.isGenerating).toBe(false)
    })
  })

  describe('Audio Settings', () => {
    it('should update audio settings', () => {
      const store = useStoryVidStore.getState()
      
      act(() => {
        store.updateAudioSettings({
          masterVolume: 0.8,
          musicVolume: 0.6,
          sfxVolume: 0.7,
          voiceoverVolume: 0.9
        })
      })

      expect(store.audioSettings.masterVolume).toBe(0.8)
      expect(store.audioSettings.musicVolume).toBe(0.6)
      expect(store.audioSettings.sfxVolume).toBe(0.7)
      expect(store.audioSettings.voiceoverVolume).toBe(0.9)
    })
  })
})
