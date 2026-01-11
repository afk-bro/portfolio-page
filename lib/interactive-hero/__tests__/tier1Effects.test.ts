// lib/interactive-hero/__tests__/tier1Effects.test.ts
import gsap from 'gsap';
import {
  createElasticBounce,
  createFlipX,
  createFlipY,
  createRubberStretch,
  createGoldGlow,
  createOceanElectric,
  createWeightMorph,
  createNeighborRipple,
  createTier1Effect,
} from '../effects/tier1';

// Mock GSAP
jest.mock('gsap', () => {
  const mockTimeline = {
    to: jest.fn().mockReturnThis(),
    fromTo: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis(),
    kill: jest.fn(),
    progress: jest.fn().mockReturnThis(),
  };
  return {
    timeline: jest.fn(() => mockTimeline),
    set: jest.fn(),
    to: jest.fn(),
    killTweensOf: jest.fn(),
  };
});

describe('Tier 1 Effects', () => {
  let mockElement: HTMLElement;
  let mockNeighbors: HTMLElement[];

  beforeEach(() => {
    mockElement = document.createElement('span');
    mockElement.textContent = 'A';
    mockNeighbors = [
      document.createElement('span'),
      document.createElement('span'),
    ];
    jest.clearAllMocks();
  });

  describe('createElasticBounce', () => {
    it('creates a GSAP timeline', () => {
      const tl = createElasticBounce(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });

    it('scales intensity', () => {
      createElasticBounce(mockElement, 0.6);
      expect(gsap.timeline).toHaveBeenCalled();
    });
  });

  describe('createFlipX', () => {
    it('creates a 3D flip animation', () => {
      const tl = createFlipX(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createFlipY', () => {
    it('creates a vertical 3D flip animation', () => {
      const tl = createFlipY(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createRubberStretch', () => {
    it('creates a stretch animation', () => {
      const tl = createRubberStretch(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createGoldGlow', () => {
    it('creates a glow animation', () => {
      const tl = createGoldGlow(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createOceanElectric', () => {
    it('creates an electric flash animation', () => {
      const tl = createOceanElectric(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createWeightMorph', () => {
    it('creates a weight morph animation', () => {
      const tl = createWeightMorph(mockElement, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createNeighborRipple', () => {
    it('animates neighbors with stagger', () => {
      const tl = createNeighborRipple(mockElement, mockNeighbors, 1.0);
      expect(gsap.timeline).toHaveBeenCalled();
      expect(tl).toBeDefined();
    });
  });

  describe('createTier1Effect', () => {
    it('returns correct function for elastic-bounce', () => {
      const effectFn = createTier1Effect('elastic-bounce');
      expect(effectFn).toBe(createElasticBounce);
    });

    it('returns correct function for neighbor-ripple', () => {
      const effectFn = createTier1Effect('neighbor-ripple');
      expect(effectFn).toBe(createNeighborRipple);
    });

    it('returns null for unknown effect', () => {
      const effectFn = createTier1Effect('unknown');
      expect(effectFn).toBeNull();
    });
  });
});
