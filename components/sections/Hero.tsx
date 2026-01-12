// components/sections/Hero.tsx
// TEMPORARILY SIMPLIFIED - debugging navigation crash
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { siteMetadata } from "@/data/metadata";
import { HeroButton } from "@/components/ui/HeroButton";

export function Hero() {
  return (
    <section className="section hero-bg relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32">
      {/* Background image with mode-specific overlays */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/old-tw.jpg"
          alt=""
          fill
          className="object-cover opacity-[0.22] dark:opacity-[0.20]"
          priority
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sand-50/70 via-sand-100/50 to-sand-50/75 dark:hidden" />
        <div className="absolute inset-0 hidden dark:block bg-gradient-to-b from-black/65 via-black/50 to-black/75 mix-blend-multiply" />
      </div>

      {/* Amber glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-bronze-500/[0.04] blur-3xl dark:bg-amber-500/[0.06]"
      />

      <div className="container-content relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Availability Badge */}
          {siteMetadata.availability === "available" && (
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-pill bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-500 text-sm font-medium border border-success-500/20 dark:border-success-500/25 hover:bg-success-100 dark:hover:bg-success-500/25 transition-colors"
            >
              <Sparkles className="w-4 h-4" />
              <span>Available for freelance & contract work</span>
            </Link>
          )}

          {/* Name */}
          <h1 className="text-[clamp(2.5rem,10vw,10rem)] font-semibold leading-[1.1] whitespace-nowrap text-ocean-800 dark:text-[#F5F5F5] mb-4">
            {siteMetadata.name}
          </h1>

          {/* Role */}
          <p className="text-2xl md:text-3xl font-medium text-ocean-600 dark:text-cyan-400 mb-6">
            {siteMetadata.role}
          </p>

          {/* Bio */}
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

          {/* Trust anchor */}
          <p className="mt-8 text-sm text-ocean-400/70 dark:text-sand-100/50">
            Previously at WestGrid Canada & TCS Canada
          </p>
        </div>
      </div>
    </section>
  );
}
