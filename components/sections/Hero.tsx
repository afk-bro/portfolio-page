"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteMetadata } from "@/data/metadata";
import { HeroButton } from "@/components/ui/HeroButton";
import { HeroName } from "@/components/ui/HeroName";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

export function Hero() {
  return (
    <section className="section hero-bg relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Localized amber glow behind hero content (blur method - no banding) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-bronze-500/[0.04] blur-3xl dark:bg-amber-500/[0.06]"
      />
      <div className="container-content relative">
        <AnimateOnScroll
          variant="fade-up"
          className="max-w-3xl mx-auto text-center"
        >
          {/* Availability Badge - refined styling */}
          {siteMetadata.availability === "available" && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-pill bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-500 text-sm font-medium border border-success-500/20 dark:border-success-500/25">
              <Sparkles className="w-4 h-4" />
              <span>Open to opportunities</span>
            </div>
          )}

          {/* Name - Animated */}
          <HeroName name={siteMetadata.name} />

          {/* Role - Ocean for light, Cyan for dark */}
          <p className="text-xl md:text-2xl font-normal text-ocean-400 dark:text-cyan-400/80 mb-6">
            {siteMetadata.role}
          </p>

          {/* Bio / Value Proposition - Plumbeous for light, Sand at reduced opacity for dark */}
          <p className="text-body text-ocean-400 dark:text-sand-100/70 mb-10 max-w-2xl mx-auto leading-relaxed">
            {siteMetadata.bio}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <HeroButton asChild size="lg" variant="primary">
              <Link href="/projects">
                View Projects
                <ArrowRight className="w-4 h-4" />
              </Link>
            </HeroButton>
            <HeroButton asChild size="lg" variant="outline">
              <Link href="#how-i-build">
                How I Build Software
                <ArrowRight className="w-4 h-4" />
              </Link>
            </HeroButton>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  );
}
