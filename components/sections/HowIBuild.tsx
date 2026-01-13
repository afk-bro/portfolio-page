"use client";

import { Database, TestTube, Cog } from "lucide-react";
import { AnimateOnScroll } from "@/components/ui/AnimateOnScroll";

const principles = [
  {
    icon: Database,
    title: "Schema-first data modeling",
    description:
      "Zod schemas define the contract. Types flow from validation. UI reflects the model.",
  },
  {
    icon: TestTube,
    title: "Testing as a feature, not a phase",
    description:
      "E2E coverage from day one. Tests document behavior and prevent regression.",
  },
  {
    icon: Cog,
    title: "Automation-first workflows",
    description:
      "CI pipelines, automated code reviews, and tooling that eliminates manual toil.",
  },
];

export function HowIBuild() {
  return (
    <section id="how-i-build" className="section bg-transparent">
      <div className="container-content">
        <AnimateOnScroll variant="fade-up" className="text-center mb-12">
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-4">
            How I Build Software
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            I build systems that work. From schema-first data modeling to
            test-driven development and automation-first workflows.
          </p>
        </AnimateOnScroll>

        <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
          {principles.map((principle, index) => (
            <AnimateOnScroll
              key={principle.title}
              variant="fade-up"
              delay={index * 100}
              className="text-center"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4">
                <principle.icon className="w-6 h-6" />
              </div>
              <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
                {principle.title}
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                {principle.description}
              </p>
            </AnimateOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
