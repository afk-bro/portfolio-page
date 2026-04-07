import { Metadata } from "next";
import { Cpu, Bot, Server, HardHat } from "lucide-react";
import { AboutProfileSection } from "@/components/sections/AboutProfileSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about my background, experience, and what drives me as a developer.",
  alternates: {
    canonical: "/about",
  },
};

type TimelineItem = {
  year: string;
  title: string;
  description: string;
  company?: string;
  period?: string;
};

const timeline: TimelineItem[] = [
  {
    year: "2024",
    title: "Full-Stack Developer",
    company: "UpWork — Freelance",
    period: "2024–Present",
    description:
      "Building end-to-end solutions with React, Node.js, and cloud infrastructure. Focused on scalable systems and automation.",
  },
  {
    year: "2022",
    title: "Front End Developer / QA Automation",
    company: "Tata Consultancy Services Canada",
    period: "2022–2024",
    description:
      "Developed responsive web interfaces while building automated test suites with Selenium WebDriver for cross-browser testing and regression coverage.",
  },
  {
    year: "2020",
    title: "Junior Front End Developer",
    company: "WestGrid Canada",
    period: "2020–2022",
    description:
      "First professional role. Focused on creating responsive, accessible web interfaces with modern JavaScript frameworks.",
  },
  {
    year: "2016",
    title: "Bachelor of Science — Computer Information Systems",
    company: "Okanagan College",
    period: "2016–2020",
    description:
      "Graduated with a BSc in Computer Information Systems, building a foundation in programming, databases, and systems analysis.",
  },
  {
    year: "2015",
    title: "Started Coding Journey",
    description:
      "Discovered my passion for programming and began learning web development fundamentals.",
  },
];

const howIWork = [
  {
    icon: Cpu,
    title: "Engineering Discipline",
    description:
      "Strong typing, testing, and CI/CD from the start — not added later. I use automated pipelines (lint, type-check, coverage, build) to ensure code quality and reliable deployments.",
  },
  {
    icon: Bot,
    title: "Automation-Driven Workflow",
    description:
      "I leverage AI tools (ChatGPT, GitHub Copilot, Claude Code) to accelerate development while maintaining control over architecture, logic, and final implementation.",
  },
  {
    icon: Server,
    title: "Production-Ready Systems",
    description:
      "I build with real-world usage in mind: monitoring (Sentry), error tracking, and scalable architecture. My projects are deployed, observable, and maintainable.",
  },
  {
    icon: HardHat,
    title: "Pragmatic Execution",
    description:
      "I focus on shipping useful systems quickly, then iterating based on real usage. My background in construction influences how I work — practical, efficient, and outcome-driven.",
  },
];

export default function AboutPage() {
  return (
    <div className="section">
      <div className="container-content max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            About Me
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400">
            The story behind the code.
          </p>
        </div>

        {/* Profile Section with massive background initial */}
        <AboutProfileSection />

        {/* Career Timeline */}
        <section className="mb-16">
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-8">
            Career Journey
          </h2>
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold text-sm">
                    {item.year}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-neutral-200 dark:bg-neutral-700 mt-4" />
                  )}
                </div>
                <div className="pb-8">
                  <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-1">
                    {item.title}
                  </h3>
                  {item.company && (
                    <p className="text-sm font-medium text-primary-600 dark:text-primary-400 mb-1">
                      {item.company}
                      {item.period && (
                        <span className="text-neutral-400 dark:text-neutral-500 font-normal ml-2">
                          {item.period}
                        </span>
                      )}
                    </p>
                  )}
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How I Work */}
        <section className="mb-16">
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-8">
            How I Work
          </h2>
          <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
            {howIWork.map((item) => (
              <div key={item.title} className="card p-6">
                <item.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-4" />
                <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
                  {item.title}
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
