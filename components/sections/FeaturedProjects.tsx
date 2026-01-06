"use client";

import Link from "next/link";
import { ArrowRight, ExternalLink, Github } from "lucide-react";
import { getFeaturedProjects } from "@/data/projects";
import { Button } from "@/components/ui/Button";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";
import { cn } from "@/lib/utils";

// Status indicator config - using design system colors
const statusConfig = {
  complete: { label: "Complete", color: "bg-bronze-700" },
  "in-progress": { label: "In Progress", color: "bg-bronze-400" },
  archived: { label: "Archived", color: "bg-muted-300" },
};

export function FeaturedProjects() {
  const projects = getFeaturedProjects().slice(0, 3);

  return (
    <section className="section relative">
      {/* Bottom fade into next section */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent to-ocean-50 dark:to-dark-surface"
      />
      <div className="container-content relative">
        {/* Section Header */}
        <AnimateOnScroll variant="fade-up" className="text-center mb-12">
          <h2 className="text-h2 text-ocean-800 dark:text-sand-500 mb-4">
            Featured Projects
          </h2>
          <p className="text-body text-ocean-400 dark:text-sand-100/70 max-w-2xl mx-auto">
            Selected projects demonstrating production architecture, testing
            strategy, and system design.
          </p>
        </AnimateOnScroll>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => {
            const status = statusConfig[project.status];
            return (
              <AnimateOnScroll
                key={project.id}
                variant="fade-up"
                delay={index * 100}
                as="article"
                className="card p-6 flex flex-col relative"
              >
                {/* Status indicator - top right, metadata styling */}
                <div className="absolute top-4 right-4 flex items-center gap-1.5">
                  <span
                    className={cn("w-1.5 h-1.5 rounded-full", status.color)}
                  />
                  <span className="text-[10px] text-muted-400 dark:text-sand-500/60">
                    {status.label}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-h4 text-ocean-800 dark:text-sand-500 mb-2 pr-20">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="hover:text-bronze-700 dark:hover:text-bronze-400 transition-colors duration-180 ease-smooth"
                  >
                    {project.title}
                  </Link>
                </h3>

                {/* Summary */}
                <p className="text-sm text-ocean-400 dark:text-sand-100/70 mb-4 flex-1">
                  {project.summary}
                </p>

                {/* Highlights - one line of emphasis */}
                {project.highlights && project.highlights.length > 0 && (
                  <p className="text-xs text-bronze-700 dark:text-bronze-400 font-medium mb-4">
                    {project.highlights.join(" · ")}
                  </p>
                )}

                {/* Soft metadata - text, not pills */}
                <div className="text-xs text-ocean-400 dark:text-sand-100/50 space-y-1 mb-4">
                  {project.team && (
                    <p>
                      {project.team === "solo"
                        ? "Solo"
                        : `Team of ${project.teamSize || "multiple"}`}
                      {project.duration && ` · ${project.duration}`}
                    </p>
                  )}
                  {/* Tech stack as inline text */}
                  <p className="text-muted-400 dark:text-sand-100/50">
                    {project.technologies.join(" · ")}
                  </p>
                </div>

                {/* Links */}
                <div className="flex items-center gap-4 pt-4 border-t border-ocean-300/20 dark:border-muted-300/15">
                  <Link
                    href={`/projects/${project.slug}`}
                    className="text-sm font-medium text-bronze-700 dark:text-bronze-400 hover:underline inline-flex items-center gap-1 transition-colors duration-180"
                  >
                    Case Study
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  {project.links.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-400 hover:text-ocean-500 dark:hover:text-sand-500 transition-colors duration-180"
                      aria-label={`View ${project.title} on GitHub`}
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.links.demo && (
                    <a
                      href={project.links.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-400 hover:text-ocean-500 dark:hover:text-sand-500 transition-colors duration-180"
                      aria-label={`View ${project.title} live demo`}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </AnimateOnScroll>
            );
          })}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
