"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import { siteMetadata } from "@/data/metadata";

/**
 * AboutProfileSection - Profile header with massive background initial
 *
 * The first letter appears as an oversized letterform directly behind
 * the name - not a badge, not an icon, purely typographic.
 */
export function AboutProfileSection() {
  const firstLetter = siteMetadata.name.charAt(0).toUpperCase();

  return (
    <section className="mb-16">
      {/* Name block with background T */}
      <div className="relative mb-6">
        {/* Massive background T - aligned to the T in Tom */}
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 1.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0,
          }}
          className="
            absolute
            select-none pointer-events-none
            -left-[0.08em] -top-[0.15em]
            text-[10rem] md:text-[12rem]
            font-bold
            opacity-[0.05] dark:opacity-[0.06]
            text-bronze-700 dark:text-sand-500
            z-0
            leading-none
          "
          style={{
            fontFamily: "var(--font-inter), system-ui, sans-serif",
          }}
        >
          {firstLetter}
        </motion.span>

        {/* Name - the T aligns with the background T */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.3,
          }}
          className="text-h1 text-neutral-900 dark:text-neutral-50 relative z-10"
        >
          {siteMetadata.name}
        </motion.h2>

        {/* Role */}
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.45,
          }}
          className="text-lg text-primary-600 dark:text-primary-400 mt-2 relative z-10"
        >
          {siteMetadata.role}
        </motion.p>
      </div>

      {/* Location */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          delay: 0.6,
        }}
        className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 mb-8"
      >
        <MapPin className="w-4 h-4" />
        <span>{siteMetadata.location}</span>
      </motion.div>

      {/* Bio */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.7,
        }}
        className="prose-content max-w-2xl"
      >
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
      </motion.div>
    </section>
  );
}
