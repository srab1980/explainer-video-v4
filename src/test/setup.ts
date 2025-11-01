import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Next.js router
vi.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
    }
  },
  useSearchParams() {
    return new URLSearchParams()
  },
  usePathname() {
    return '/'
  },
}))

// Mock Zustand store
vi.mock('@/lib/store', () => ({
  useStoryVidStore: vi.fn(() => ({
    project: null,
    scenes: [],
    currentScene: null,
    isGenerating: false,
    audioSettings: {},
    videoSettings: {},
  })),
}))

// Mock audio context
global.AudioContext = vi.fn().mockImplementation(() => ({
  createGain: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    gain: { value: 1 },
  }),
  createOscillator: vi.fn().mockReturnValue({
    connect: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    frequency: { value: 440 },
  }),
  currentTime: 0,
  destination: {},
}))

// Mock fetch for API calls
global.fetch = vi.fn()
