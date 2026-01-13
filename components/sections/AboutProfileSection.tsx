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
        {/* Background Initial - shadow of the name, not focal point */}
        <motion.span
          aria-hidden="true"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 0.05, y: 0 }}
          transition={{
            duration: 2,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0,
          }}
          className="
            absolute
            -left-8 -top-10
            text-[11rem]
            font-black
            tracking-tight
            text-[#d4a15a]
            select-none
            pointer-events-none
            leading-none
          "
        >
          {firstLetter}
        </motion.span>

        {/* Name - the hero */}
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.7,
            ease: [0.25, 0.1, 0.25, 1],
            delay: 0.4,
          }}
          className="relative z-10 text-4xl font-semibold text-neutral-900 dark:text-neutral-50 tracking-tight"
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
            delay: 0.55,
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
