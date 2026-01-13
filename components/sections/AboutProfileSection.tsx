"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { siteMetadata } from "@/data/metadata";

/**
 * AboutProfileSection - Profile header with massive background initial
 *
 * The first letter of the name appears as a large, low-opacity glyph
 * behind the profile content, creating a visual anchor and brand identity.
 */
export function AboutProfileSection() {
  const firstLetter = siteMetadata.name.charAt(0).toUpperCase();

  return (
    <section className="mb-16 relative">
      {/* Massive background initial - visual anchor */}
      <motion.span
        aria-hidden="true"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 1.4,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        }}
        className="
          absolute
          select-none pointer-events-none
          -left-4 md:-left-8 top-0
          text-[clamp(12rem,30vw,20rem)]
          font-black
          opacity-[0.04] dark:opacity-[0.055]
          text-ocean-950 dark:text-white
          z-0
          leading-none
        "
        style={{
          fontFamily: "var(--font-inter), system-ui, sans-serif",
        }}
      >
        {firstLetter}
      </motion.span>

      <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.2,
          }}
        >
          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-bronze-500 to-bronze-700 dark:from-gold-500 dark:to-bronze-600 flex items-center justify-center text-white text-4xl font-bold shrink-0 shadow-lg">
            {firstLetter}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.35,
          }}
        >
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-2">
            {siteMetadata.name}
          </h2>
          <p className="text-lg text-primary-600 dark:text-primary-400 mb-4">
            {siteMetadata.role}
          </p>
          <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-6">
            <MapPin className="w-4 h-4" />
            <span>{siteMetadata.location}</span>
          </div>
          <div className="prose-content">
            <p>
              I&apos;m a passionate developer who loves turning complex
              problems into elegant solutions. With a strong foundation in
              both frontend and backend technologies, I build applications
              that are not only functional but also delightful to use.
            </p>
            <p>
              My journey in tech started with curiosity about how things
              work. Today, that curiosity drives me to continuously learn
              and stay updated with the latest technologies and best
              practices.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
