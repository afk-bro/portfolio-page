"use client";

// components/dev/InteractiveHeroTestChecklist.tsx

import { useState, useEffect, useCallback } from "react";
import { useBrowserInfo, type BrowserInfo } from "@/lib/interactive-hero";

/**
 * Test checklist item
 */
interface ChecklistItem {
  id: string;
  label: string;
  checked: boolean;
}

/**
 * Test section with items
 */
interface ChecklistSection {
  title: string;
  items: ChecklistItem[];
}

/**
 * Initial checklist data
 */
const getInitialChecklist = (): ChecklistSection[] => [
  {
    title: "Click Effects (Tier 1)",
    items: [
      { id: "t1-click", label: "Click letter - effect plays", checked: false },
      {
        id: "t1-rapid",
        label: "Rapid clicks - no overlap (channel locks work)",
        checked: false,
      },
      {
        id: "t1-different",
        label: "Different effects selected (no same twice in a row)",
        checked: false,
      },
      {
        id: "t1-complete",
        label: "Effects complete without interruption",
        checked: false,
      },
    ],
  },
  {
    title: "Scroll Behavior",
    items: [
      {
        id: "scroll-pin",
        label: "Hero pins at top when scrolling",
        checked: false,
      },
      {
        id: "scroll-release",
        label: "Pin releases after 100vh scroll",
        checked: false,
      },
      {
        id: "scroll-parallax",
        label: "Parallax exit visible (~200px)",
        checked: false,
      },
      {
        id: "scroll-wake",
        label: "Scroll intent triggers wake animation",
        checked: false,
      },
    ],
  },
  {
    title: "WebGL Effects (Tier 2)",
    items: [
      {
        id: "t2-trigger",
        label: "After 5+ clicks, viewport effects trigger",
        checked: false,
      },
      {
        id: "t2-effects",
        label: "Ripple/Sweep/Vignette all render correctly",
        checked: false,
      },
      {
        id: "t2-reverse",
        label: "Effects don't trigger on reverse scroll",
        checked: false,
      },
      {
        id: "t2-cooldown",
        label: "8-12s cooldown between Tier 2 effects",
        checked: false,
      },
    ],
  },
  {
    title: "Easter Eggs (Tier 3)",
    items: [
      {
        id: "t3-caustics",
        label: "10+ interactions - caustics unlock",
        checked: false,
      },
      {
        id: "t3-particle",
        label: "Click all letters - particle trail unlock",
        checked: false,
      },
      {
        id: "t3-persist",
        label: "Tier 3 persists after unlock",
        checked: false,
      },
    ],
  },
  {
    title: "Accessibility",
    items: [
      {
        id: "a11y-motion",
        label: "prefers-reduced-motion - static hero",
        checked: false,
      },
      {
        id: "a11y-keyboard",
        label: "Keyboard navigation works (Tab, Enter)",
        checked: false,
      },
      {
        id: "a11y-flash",
        label: "No flashing/strobing effects",
        checked: false,
      },
    ],
  },
  {
    title: "Performance",
    items: [
      { id: "perf-desktop", label: "60fps on desktop", checked: false },
      { id: "perf-mobile", label: "30fps+ on mobile", checked: false },
      {
        id: "perf-lowpower",
        label: "Low-power mode adjusts effects",
        checked: false,
      },
      {
        id: "perf-memory",
        label: "No memory leaks (check DevTools)",
        checked: false,
      },
    ],
  },
  {
    title: "Cross-Browser",
    items: [
      {
        id: "browser-chrome",
        label: "Chrome: All effects work",
        checked: false,
      },
      {
        id: "browser-firefox",
        label: "Firefox: All effects work",
        checked: false,
      },
      { id: "browser-safari", label: "Safari: WebGL renders", checked: false },
      { id: "browser-edge", label: "Edge: All effects work", checked: false },
      {
        id: "browser-mobile-safari",
        label: "Mobile Safari: Touch works",
        checked: false,
      },
      {
        id: "browser-mobile-chrome",
        label: "Mobile Chrome: Touch works",
        checked: false,
      },
    ],
  },
  {
    title: "Fallbacks",
    items: [
      {
        id: "fallback-nowebgl",
        label: "No WebGL - CSS fallbacks work",
        checked: false,
      },
      {
        id: "fallback-lowmem",
        label: "Low memory - reduced intensity",
        checked: false,
      },
      {
        id: "fallback-hidden",
        label: "Tab hidden - effects pause",
        checked: false,
      },
    ],
  },
];

/**
 * Browser capabilities display component
 */
function BrowserCapabilities({ info }: { info: BrowserInfo }) {
  return (
    <div className="mb-6 p-4 bg-slate-800 rounded-lg">
      <h3 className="text-lg font-semibold text-white mb-3">
        Browser Capabilities
      </h3>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="text-slate-300">
          Browser:{" "}
          <span className="text-white font-mono">
            {info.name} {info.version}
          </span>
        </div>
        <div className="text-slate-300">
          Mobile:{" "}
          <span className={info.isMobile ? "text-amber-400" : "text-green-400"}>
            {info.isMobile ? "Yes" : "No"}
          </span>
        </div>
        <div className="text-slate-300">
          Touch:{" "}
          <span className={info.isTouch ? "text-amber-400" : "text-slate-400"}>
            {info.isTouch ? "Yes" : "No"}
          </span>
        </div>
        <div className="text-slate-300">
          Passive Events:{" "}
          <span
            className={
              info.supportsPassiveEvents ? "text-green-400" : "text-red-400"
            }
          >
            {info.supportsPassiveEvents ? "Yes" : "No"}
          </span>
        </div>
        <div className="text-slate-300">
          IntersectionObserver:{" "}
          <span
            className={
              info.supportsIntersectionObserver
                ? "text-green-400"
                : "text-red-400"
            }
          >
            {info.supportsIntersectionObserver ? "Yes" : "No"}
          </span>
        </div>
        <div className="text-slate-300">
          ResizeObserver:{" "}
          <span
            className={
              info.supportsResizeObserver ? "text-green-400" : "text-red-400"
            }
          >
            {info.supportsResizeObserver ? "Yes" : "No"}
          </span>
        </div>
        <div className="col-span-2 text-slate-300">
          Reduced Motion:{" "}
          <span
            className={
              info.prefersReducedMotion ? "text-amber-400" : "text-slate-400"
            }
          >
            {info.prefersReducedMotion ? "Enabled" : "Disabled"}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Checklist section component
 */
function ChecklistSectionComponent({
  section,
  onToggle,
}: {
  section: ChecklistSection;
  onToggle: (id: string) => void;
}) {
  const completedCount = section.items.filter((item) => item.checked).length;
  const totalCount = section.items.length;
  const isComplete = completedCount === totalCount;

  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-white">{section.title}</h4>
        <span
          className={`text-sm ${isComplete ? "text-green-400" : "text-slate-400"}`}
        >
          {completedCount}/{totalCount}
        </span>
      </div>
      <ul className="space-y-1">
        {section.items.map((item) => (
          <li key={item.id}>
            <label className="flex items-center gap-2 cursor-pointer hover:bg-slate-700 p-1 rounded">
              <input
                type="checkbox"
                checked={item.checked}
                onChange={() => onToggle(item.id)}
                className="w-4 h-4 rounded border-slate-500 bg-slate-700 text-teal-500 focus:ring-teal-500 focus:ring-offset-0"
              />
              <span
                className={`text-sm ${item.checked ? "text-slate-500 line-through" : "text-slate-300"}`}
              >
                {item.label}
              </span>
            </label>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * Interactive Hero Test Checklist Component
 *
 * A development-only component that displays a manual testing checklist
 * for the Interactive Hero system. Shows browser capabilities and allows
 * tracking of manual test completion.
 *
 * Features:
 * - Toggle visibility with Ctrl+Shift+T
 * - Displays browser capabilities detected by useBrowserInfo
 * - Persists checklist state to localStorage
 * - Only renders in development mode
 *
 * @example
 * ```tsx
 * // Add to your app layout or main component
 * import { InteractiveHeroTestChecklist } from '@/components/dev/InteractiveHeroTestChecklist';
 *
 * function App() {
 *   return (
 *     <>
 *       <MainContent />
 *       <InteractiveHeroTestChecklist />
 *     </>
 *   );
 * }
 * ```
 */
export function InteractiveHeroTestChecklist() {
  const [isVisible, setIsVisible] = useState(false);
  const [checklist, setChecklist] =
    useState<ChecklistSection[]>(getInitialChecklist);
  const browserInfo = useBrowserInfo();

  // Load saved checklist from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("interactive-hero-test-checklist");
    if (saved) {
      try {
        const savedChecks = JSON.parse(saved) as Record<string, boolean>;
        setChecklist((prev) =>
          prev.map((section) => ({
            ...section,
            items: section.items.map((item) => ({
              ...item,
              checked: savedChecks[item.id] ?? item.checked,
            })),
          })),
        );
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Save checklist to localStorage when it changes
  useEffect(() => {
    const checks: Record<string, boolean> = {};
    checklist.forEach((section) => {
      section.items.forEach((item) => {
        checks[item.id] = item.checked;
      });
    });
    localStorage.setItem(
      "interactive-hero-test-checklist",
      JSON.stringify(checks),
    );
  }, [checklist]);

  // Handle keyboard shortcut (Ctrl+Shift+T)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key === "T") {
        e.preventDefault();
        setIsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Toggle item checked state
  const handleToggle = useCallback((id: string) => {
    setChecklist((prev) =>
      prev.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.id === id ? { ...item, checked: !item.checked } : item,
        ),
      })),
    );
  }, []);

  // Reset all items
  const handleReset = useCallback(() => {
    setChecklist(getInitialChecklist());
    localStorage.removeItem("interactive-hero-test-checklist");
  }, []);

  // Calculate overall progress
  const totalItems = checklist.reduce(
    (acc, section) => acc + section.items.length,
    0,
  );
  const completedItems = checklist.reduce(
    (acc, section) => acc + section.items.filter((item) => item.checked).length,
    0,
  );
  const progressPercent = Math.round((completedItems / totalItems) * 100);

  // Only render in development
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 z-50 bg-teal-600 hover:bg-teal-500 text-white px-3 py-2 rounded-lg shadow-lg text-sm font-medium transition-colors"
        aria-label="Open Interactive Hero Test Checklist"
      >
        Test Checklist
      </button>
    );
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-96 bg-slate-900 shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-slate-900 border-b border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-bold text-white">
            Interactive Hero Testing
          </h2>
          <button
            onClick={() => setIsVisible(false)}
            className="text-slate-400 hover:text-white transition-colors"
            aria-label="Close checklist"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-teal-500 transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-sm text-slate-400 font-mono">
            {completedItems}/{totalItems}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <BrowserCapabilities info={browserInfo} />

        <div className="space-y-2">
          {checklist.map((section) => (
            <ChecklistSectionComponent
              key={section.title}
              section={section}
              onToggle={handleToggle}
            />
          ))}
        </div>

        {/* Actions */}
        <div className="mt-6 pt-4 border-t border-slate-700 flex justify-between">
          <button
            onClick={handleReset}
            className="text-sm text-slate-400 hover:text-white transition-colors"
          >
            Reset All
          </button>
          <span className="text-xs text-slate-500">Ctrl+Shift+T to toggle</span>
        </div>
      </div>
    </div>
  );
}

export default InteractiveHeroTestChecklist;
