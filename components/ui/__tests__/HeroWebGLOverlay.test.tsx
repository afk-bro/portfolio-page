// components/ui/__tests__/HeroWebGLOverlay.test.tsx
import React from 'react';
import { render, screen } from '@testing-library/react';
import { HeroWebGLOverlay, HeroWebGLOverlayRef } from '../HeroWebGLOverlay';

// Mock PixiJS
jest.mock('pixi.js', () => ({
  Application: jest.fn().mockImplementation(() => ({
    init: jest.fn().mockResolvedValue(undefined),
    canvas: document.createElement('canvas'),
    stage: { addChild: jest.fn() },
    renderer: {
      resize: jest.fn(),
      render: jest.fn(),
    },
    ticker: {
      add: jest.fn(),
      remove: jest.fn(),
      start: jest.fn(),
      stop: jest.fn(),
    },
    destroy: jest.fn(),
  })),
  Graphics: jest.fn().mockImplementation(() => ({
    clear: jest.fn().mockReturnThis(),
    circle: jest.fn().mockReturnThis(),
    fill: jest.fn().mockReturnThis(),
    stroke: jest.fn().mockReturnThis(),
    rect: jest.fn().mockReturnThis(),
    alpha: 0,
    x: 0,
    y: 0,
    destroy: jest.fn(),
  })),
  Container: jest.fn().mockImplementation(() => ({
    addChild: jest.fn(),
    removeChild: jest.fn(),
    children: [],
  })),
  DisplacementFilter: jest.fn().mockImplementation(() => ({
    scale: { x: 0, y: 0 },
  })),
  Sprite: jest.fn().mockImplementation(() => ({
    texture: null,
    anchor: { set: jest.fn() },
    alpha: 0,
  })),
}));

describe('HeroWebGLOverlay', () => {
  beforeEach(() => {
    // Reset matchMedia to default (no reduced motion)
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });
  });

  it('renders a canvas container', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    // Should have a container div
    expect(screen.getByTestId('webgl-overlay')).toBeInTheDocument();
  });

  it('is hidden when visible is false', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={false}
        intensity={1}
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveStyle({ opacity: '0' });
  });

  it('respects reduced motion preference', () => {
    // Mock reduced motion
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
        matches: query === '(prefers-reduced-motion: reduce)',
        media: query,
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
      })),
    });

    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    // Should render nothing when reduced motion
    expect(screen.queryByTestId('webgl-overlay')).toBeNull();
  });

  it('applies pointer-events-none', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveClass('pointer-events-none');
  });

  it('exposes addEffect and clearEffects methods via ref', () => {
    const ref = React.createRef<HeroWebGLOverlayRef>();

    render(
      <HeroWebGLOverlay
        ref={ref}
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
      />
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current?.addEffect).toBeInstanceOf(Function);
    expect(ref.current?.clearEffects).toBeInstanceOf(Function);
  });

  it('applies intensity to opacity', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={0.5}
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveStyle({ opacity: '0.5' });
  });

  it('accepts custom className', () => {
    render(
      <HeroWebGLOverlay
        containerRef={{ current: document.createElement('div') }}
        visible={true}
        intensity={1}
        className="custom-class"
      />
    );

    const overlay = screen.getByTestId('webgl-overlay');
    expect(overlay).toHaveClass('custom-class');
  });
});
