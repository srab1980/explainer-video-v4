import { describe, it, expect } from 'vitest'
import { MUSIC_LIBRARY, SFX_LIBRARY, findMusicByCategory, findSoundById } from '@/lib/audio-library'

describe('Audio Library', () => {
  describe('Music Library', () => {
    it('should contain music tracks with required properties', () => {
      expect(MUSIC_LIBRARY).toHaveLength(14)
      
      MUSIC_LIBRARY.forEach(track => {
        expect(track).toHaveProperty('id')
        expect(track).toHaveProperty('name')
        expect(track).toHaveProperty('category')
        expect(track).toHaveProperty('mood')
        expect(track).toHaveProperty('duration')
        expect(track).toHaveProperty('url')
        expect(track).toHaveProperty('tags')
        expect(typeof track.duration).toBe('number')
        expect(track.duration).toBeGreaterThan(0)
        expect(track.url).toMatch(/^\/audio\//)
      })
    })

    it('should have tracks in different categories', () => {
      const categories = [...new Set(MUSIC_LIBRARY.map(track => track.category))]
      expect(categories).toContain('corporate')
      expect(categories).toContain('tech')
      expect(categories).toContain('ambient')
    })
  })

  describe('Sound Effects Library', () => {
    it('should contain sound effects with required properties', () => {
      expect(SFX_LIBRARY).toHaveLength(14)
      
      SFX_LIBRARY.forEach(effect => {
        expect(effect).toHaveProperty('id')
        expect(effect).toHaveProperty('name')
        expect(effect).toHaveProperty('category')
        expect(effect).toHaveProperty('duration')
        expect(effect).toHaveProperty('url')
        expect(effect).toHaveProperty('tags')
        expect(typeof effect.duration).toBe('number')
        expect(effect.duration).toBeGreaterThan(0)
        expect(effect.url).toMatch(/^\/audio\//)
      })
    })
  })

  describe('Utility Functions', () => {
    it('should find music by category', () => {
      const corporateTracks = findMusicByCategory('corporate')
      expect(corporateTracks).toHaveLength(3)
      expect(corporateTracks.every(track => track.category === 'corporate')).toBe(true)
    })

    it('should find sound effect by ID', () => {
      const uiClick = findSoundById('ui-click')
      expect(uiClick).toBeDefined()
      expect(uiClick?.id).toBe('ui-click')
    })

    it('should return undefined for non-existent sound ID', () => {
      const nonexistent = findSoundById('nonexistent')
      expect(nonexistent).toBeUndefined()
    })
  })
})
