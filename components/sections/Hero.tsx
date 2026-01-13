// components/sections/Hero.tsx
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion, useScroll, useTransform, type Variants } from "framer-motion";
import { useRef } from "react";
import { siteMetadata } from "@/data/metadata";
import { HeroButton } from "@/components/ui/HeroButton";
import {
  TypewriterName,
  getTypewriterDuration,
} from "@/components/ui/TypewriterName";

// Calm, slower animations
const fadeIn: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.25, 0.1, 0.25, 1],
      delay,
    },
  }),
};

// Slide from right
const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 30 },
  visible: (delay: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
      delay,
    },
  }),
};

// Slide up from bottom
const slideUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.1, 0.25, 1],
      delay,
    },
  }),
};


export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Parallax: background moves slower than scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const backgroundScale = useTransform(scrollYProgress, [0, 1], [1, 1.1]);

  // Calculate cascade timing
  const typewriterDuration = getTypewriterDuration(siteMetadata.name);

  // Sequence timing
  const timing = {
    role: typewriterDuration + 0.15,
    ctas: typewriterDuration + 0.65,
    trust: typewriterDuration + 1.15,
    badge: typewriterDuration + 1.6,
  };

  return (
    <section
      ref={sectionRef}
      className="section hero-bg relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-32"
    >
      {/* Background image with parallax */}
      <motion.div
        className="absolute inset-0 z-0"
        style={{ y: backgroundY, scale: backgroundScale }}
      >
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
      </motion.div>

      {/* Amber glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[480px] w-[480px] rounded-full bg-bronze-500/[0.04] blur-3xl dark:bg-amber-500/[0.06]"
      />

      <div className="container-content relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* 1. Name - Typewriter effect */}
          <div className="mb-8">
            <TypewriterName name={siteMetadata.name} />
          </div>

          {/* 2. Role - Fades in slowly after name */}
          <motion.p
            className="text-2xl md:text-3xl font-medium text-ocean-600 dark:text-cyan-300/85 mb-8"
            initial="hidden"
            animate="visible"
            variants={fadeIn}
            custom={timing.role}
          >
            {siteMetadata.role}
          </motion.p>

          {/* 3. CTAs - Slide in from right */}
          <motion.div
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
            initial="hidden"
            animate="visible"
            variants={slideFromRight}
            custom={timing.ctas}
          >
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
          </motion.div>

          {/* 4. Availability Badge */}
          {siteMetadata.availability === "available" && (
            <motion.div
              className="mb-4"
              initial="hidden"
              animate="visible"
              variants={slideUp}
              custom={timing.badge}
            >
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-pill bg-success-50 dark:bg-success-500/15 text-success-600 dark:text-success-500 text-sm font-medium border border-success-500/20 dark:border-success-500/25 hover:bg-success-100 dark:hover:bg-success-500/25 transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                <span>Available for freelance & contract work</span>
              </Link>
            </motion.div>
          )}

          {/* 5. Trust anchor - Slides up from bottom */}
          <motion.p
            className="text-sm text-ocean-400/70 dark:text-sand-100/50"
            initial="hidden"
            animate="visible"
            variants={slideUp}
            custom={timing.trust}
          >
            Previously at WestGrid Canada & TCS Canada
          </motion.p>
        </div>
      </div>
    </section>
  );
}
