import { describe, it, expect } from 'vitest'
import { 
  VIDEO_TRANSITIONS, 
  VIDEO_FILTERS, 
  getTransitionByName, 
  getFilterByName,
  applyTransition,
  applyFilter 
} from '@/lib/video-effects'

describe('Video Effects Library', () => {
  describe('Video Transitions', () => {
    it('should contain transition definitions with required properties', () => {
      expect(VIDEO_TRANSITIONS).toHaveLength(10)
      
      VIDEO_TRANSITIONS.forEach(transition => {
        expect(transition).toHaveProperty('id')
        expect(transition).toHaveProperty('name')
        expect(transition).toHaveProperty('type')
        expect(transition).toHaveProperty('duration')
        expect(transition).toHaveProperty('description')
        expect(transition).toHaveProperty('css')
        expect(transition.type).toMatch(/^(fade|slide|zoom|rotate|flip|morph)$/)
        expect(typeof transition.duration).toBe('number')
        expect(transition.duration).toBeGreaterThan(0)
      })
    })

    it('should find transition by name', () => {
      const fadeTransition = getTransitionByName('fade')
      expect(fadeTransition).toBeDefined()
      expect(fadeTransition?.name).toBe('Fade In/Out')
    })

    it('should return undefined for non-existent transition', () => {
      const nonexistent = getTransitionByName('nonexistent')
      expect(nonexistent).toBeUndefined()
    })
  })

  describe('Video Filters', () => {
    it('should contain filter definitions with required properties', () => {
      expect(VIDEO_FILTERS).toHaveLength(8)
      
      VIDEO_FILTERS.forEach(filter => {
        expect(filter).toHaveProperty('id')
        expect(filter).toHaveProperty('name')
        expect(filter).toHaveProperty('category')
        expect(filter).toHaveProperty('intensity')
        expect(filter).toHaveProperty('css')
        expect(filter).toHaveProperty('description')
        expect(filter.intensity).toBeGreaterThanOrEqual(0)
        expect(filter.intensity).toBeLessThanOrEqual(1)
      })
    })

    it('should have filters in different categories', () => {
      const categories = [...new Set(VIDEO_FILTERS.map(filter => filter.category))]
      expect(categories).toContain('color')
      expect(categories).toContain('blur')
      expect(categories).toContain('vintage')
    })

    it('should find filter by name', () => {
      const brightnessFilter = getFilterByName('brightness')
      expect(brightnessFilter).toBeDefined()
      expect(brightnessFilter?.name).toBe('Brightness')
    })
  })

  describe('Effect Application', () => {
    it('should apply transition correctly', () => {
      const element = document.createElement('div')
      element.style.transition = 'none'
      
      const transition = getTransitionByName('fade')
      if (transition) {
        applyTransition(element, transition)
        
        expect(element.style.transition).toContain('opacity')
        expect(element.style.transition).toContain(transition.duration + 's')
      }
    })

    it('should apply filter correctly', () => {
      const element = document.createElement('div')
      element.style.filter = 'none'
      
      const filter = getFilterByName('brightness')
      if (filter) {
        applyFilter(element, filter, 0.8)
        
        expect(element.style.filter).toContain('brightness')
        expect(element.style.filter).toContain('1.8') // 0.8 * 2 + 1
      }
    })
  })

  describe('CSS Generation', () => {
    it('should generate valid CSS for transitions', () => {
      const fadeTransition = getTransitionByName('fade')
      expect(fadeTransition?.css).toMatch(/opacity/)
      expect(fadeTransition?.css).toMatch(/transition/)
    })

    it('should generate valid CSS for filters', () => {
      const brightnessFilter = getFilterByName('brightness')
      expect(brightnessFilter?.css).toMatch(/brightness/)
      expect(brightnessFilter?.css).toContain('{value}')
    })
  })
})
