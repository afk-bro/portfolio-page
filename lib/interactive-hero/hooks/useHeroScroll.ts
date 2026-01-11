// lib/interactive-hero/hooks/useHeroScroll.ts
import { useEffect, useState, useRef, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface UseHeroScrollProps {
  containerRef: React.RefObject<HTMLElement>;
  enabled: boolean;
  onScrollIntent?: () => void;
}

interface UseHeroScrollReturn {
  scrollIntent: boolean;
  scrollProgress: number;
  scrollVelocity: number;
  isScrollingUp: boolean;
  isPinned: boolean;
  timeOnPage: number;
}

// Thresholds for scroll intent detection
const WHEEL_THRESHOLD = 3;
const TOUCH_THRESHOLD = 10;
const SCROLL_THRESHOLD = 10;

export function useHeroScroll({
  containerRef,
  enabled,
  onScrollIntent,
}: UseHeroScrollProps): UseHeroScrollReturn {
  const [scrollIntent, setScrollIntent] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(false);
  const [isPinned, setIsPinned] = useState(false);
  const [timeOnPage, setTimeOnPage] = useState(0);

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const lastScrollYRef = useRef(0);
  const startTimeRef = useRef(Date.now());
  const hasDetectedIntentRef = useRef(false);

  // Time on page tracker
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeOnPage(Math.floor((Date.now() - startTimeRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Scroll intent detection
  const detectScrollIntent = useCallback(() => {
    if (hasDetectedIntentRef.current) return;

    hasDetectedIntentRef.current = true;
    setScrollIntent(true);
    onScrollIntent?.();
  }, [onScrollIntent]);

  // Wheel event handler
  useEffect(() => {
    if (!enabled) return;

    const handleWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) > WHEEL_THRESHOLD) {
        detectScrollIntent();
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [enabled, detectScrollIntent]);

  // Touch event handler
  useEffect(() => {
    if (!enabled) return;

    let touchStartY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchMove = (e: TouchEvent) => {
      const deltaY = Math.abs(e.touches[0].clientY - touchStartY);
      if (deltaY > TOUCH_THRESHOLD) {
        detectScrollIntent();
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [enabled, detectScrollIntent]);

  // Scroll event handler for direction tracking
  useEffect(() => {
    if (!enabled) return;

    const handleScroll = () => {
      const currentY = window.scrollY;

      // Detect scroll intent
      if (currentY > SCROLL_THRESHOLD) {
        detectScrollIntent();
      }

      // Track direction
      setIsScrollingUp(currentY < lastScrollYRef.current);
      lastScrollYRef.current = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [enabled, detectScrollIntent]);

  // ScrollTrigger setup for pinning
  useEffect(() => {
    if (!enabled || !containerRef.current) return;

    // Create ScrollTrigger for pin behavior
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=100%',
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        setScrollProgress(self.progress);
        setScrollVelocity(self.getVelocity());
        setIsPinned(self.isActive);
      },
      onEnter: () => setIsPinned(true),
      onLeave: () => setIsPinned(false),
      onEnterBack: () => setIsPinned(true),
      onLeaveBack: () => setIsPinned(false),
    });

    return () => {
      scrollTriggerRef.current?.kill();
      scrollTriggerRef.current = null;
    };
  }, [enabled, containerRef]);

  // Refresh ScrollTrigger on resize
  useEffect(() => {
    if (!enabled) return;

    const handleResize = () => {
      ScrollTrigger.refresh();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [enabled]);

  return {
    scrollIntent,
    scrollProgress,
    scrollVelocity,
    isScrollingUp,
    isPinned,
    timeOnPage,
  };
}
