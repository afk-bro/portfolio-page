"use client";

import { useState } from "react";
import { ExternalLink, Github } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function ProofStrip() {
  const [badgeError, setBadgeError] = useState(false);

  return (
    <section className="relative pt-8 pb-20 bg-transparent">
      <div className="container-content relative">
        <AnimateOnScroll variant="fade-up" className="text-center">
          <p className="text-base md:text-lg font-medium text-ocean-700 dark:text-sand-200 max-w-3xl mx-auto mb-4 leading-relaxed">
            I build production-ready systems — with real-world constraints like
            authentication, data integrity, testing, and scalability — not just
            prototypes.
          </p>
          <div className="flex items-center justify-center gap-6 flex-wrap">
            <a
              href="https://github.com/afk-bro/watershed-campground"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ocean-500 dark:text-sand-100/70 hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180"
            >
              <Github className="w-4 h-4" />
              watershed-campground
            </a>
            <a
              href="https://tiger-english.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-ocean-500 dark:text-sand-100/70 hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180"
            >
              <ExternalLink className="w-4 h-4" />
              tiger-english.com
            </a>
            <a
              href="https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Tiger English CI status"
              className="inline-flex items-center gap-1.5 text-sm text-ocean-500 dark:text-sand-100/70 hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180"
            >
              {badgeError ? (
                <span>CI</span>
              ) : (
                <img
                  src="https://github.com/afk-bro/tiger-english/actions/workflows/ci.yml/badge.svg"
                  alt="CI status"
                  width={104}
                  height={20}
                  loading="eager"
                  decoding="async"
                  onError={() => setBadgeError(true)}
                />
              )}
            </a>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
