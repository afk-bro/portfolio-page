import { Metadata } from "next";
import Link from "next/link";
import { Download, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ResumeDetails } from "@/components/sections/ResumeDetails";

export const metadata: Metadata = {
  title: "Resume",
  description:
    "Download my resume and learn more about my professional experience and qualifications.",
  alternates: {
    canonical: "/resume",
  },
};

export default function ResumePage() {
  return (
    <div className="section">
      <div className="container-content max-w-3xl">
        {/* Header - short intro */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            Resume
          </h1>
          <p className="text-body text-neutral-600 dark:text-neutral-400">
            A concise overview of my experience and technical focus.{" "}
            <Link
              href="/projects"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              See project case studies
            </Link>{" "}
            for deeper context.
          </p>
        </div>

        {/* Primary CTA: Download PDF */}
        <div className="card p-8 mb-12 text-center">
          <Button asChild size="lg">
            <a href="/resume/resume.pdf" download="Tom_Horne_Resume.pdf">
              <Download className="w-4 h-4 mr-2" />
              Download Resume (PDF)
            </a>
          </Button>
          <div className="flex items-center justify-center gap-4 mt-4 text-sm text-neutral-500 dark:text-neutral-400">
            <span>Updated: Jan 2025</span>
            <span className="text-neutral-300 dark:text-neutral-600">|</span>
            <span>Focus: Full-Stack / Systems</span>
          </div>
        </div>

        {/* Experience Snapshot */}
        <div className="mb-12">
          <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6">
            Experience Snapshot
          </h2>
          <ul className="space-y-3 text-neutral-600 dark:text-neutral-400">
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
              <span>
                5+ years professional experience building production systems
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
              <span>
                Full-stack systems: React, Next.js, Node.js, Python, PostgreSQL
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-2 shrink-0" />
              <span>
                Strong emphasis on testing, automation, and maintainability
              </span>
            </li>
          </ul>
        </div>

        {/* Core Focus Areas */}
        <div className="mb-12">
          <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6">
            Core Focus Areas
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                Schema-first development
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Type-safe data modeling from API to UI
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                CI/CD and quality gates
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Automated testing and deployment pipelines
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                Production reliability
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Observability, error handling, graceful degradation
              </p>
            </div>
            <div className="p-4 rounded-lg bg-neutral-50 dark:bg-neutral-800/50">
              <h3 className="font-medium text-neutral-900 dark:text-neutral-50 mb-1">
                Developer experience
              </h3>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">
                Tooling, documentation, code review culture
              </p>
            </div>
          </div>
        </div>

        {/* Collapsible Details */}
        <ResumeDetails />

        {/* Subtle note about case studies */}
        <div className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center">
            This resume summarizes experience. Detailed architecture decisions,
            tradeoffs, and implementations are documented in{" "}
            <Link
              href="/projects"
              className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
            >
              project case studies
              <ArrowRight className="w-3 h-3" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
