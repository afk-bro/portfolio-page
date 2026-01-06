"use client";

import { Code2, GitBranch, TestTube, Zap } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const proofPoints = [
  {
    icon: TestTube,
    label: "Test Coverage",
    value: "95%+",
    description: "Comprehensive test suites",
  },
  {
    icon: GitBranch,
    label: "CI/CD",
    value: "Automated",
    description: "Continuous integration",
  },
  {
    icon: Code2,
    label: "TypeScript",
    value: "Strict Mode",
    description: "Full type safety",
  },
  {
    icon: Zap,
    label: "Performance",
    value: "90+ Lighthouse",
    description: "Optimized for speed",
  },
];

export function ProofStrip() {
  return (
    <section className="relative py-20 bg-transparent">
      {/* Top fade from previous section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-sand-50 dark:from-dark-base to-transparent"
      />
      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-b from-transparent to-sand-50 dark:to-dark-base"
      />
      <div className="container-content relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {proofPoints.map((point, index) => (
            <AnimateOnScroll
              key={point.label}
              variant="fade-up"
              delay={index * 100}
              className="flex flex-col items-center text-center"
            >
              <point.icon className="w-8 h-8 text-bronze-700 dark:text-bronze-400 mb-2" />
              <div className="text-lg font-bold text-ocean-800 dark:text-sand-500">
                {point.value}
              </div>
              <div className="text-sm text-ocean-400 dark:text-sand-500/70">
                {point.label}
              </div>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
