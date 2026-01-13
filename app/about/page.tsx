import { Metadata } from "next";
import { Briefcase, Heart, Code } from "lucide-react";
import { AboutProfileSection } from "@/components/sections/AboutProfileSection";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn more about my background, experience, and what drives me as a developer.",
  alternates: {
    canonical: "/about",
  },
};

const timeline = [
  {
    year: "2024",
    title: "Full-Stack Developer",
    description:
      "Building end-to-end solutions with React, Node.js, and cloud infrastructure. Focused on scalable systems and automation.",
  },
  {
    year: "2022",
    title: "Front End Developer / QA Automation",
    description:
      "Developed responsive web interfaces while building automated test suites with Selenium WebDriver for cross-browser testing and regression coverage.",
  },
  {
    year: "2020",
    title: "Junior Front End Developer",
    description:
      "First professional role after graduating with a Bachelor of Computer Information Systems Degree. Focused on creating responsive, accessible web interfaces with modern JavaScript frameworks.",
  },
  {
    year: "2016",
    title: "Enrolled at Okanagan College",
    description:
      "Started Computer Information Systems program, building a foundation in programming, databases, and systems analysis.",
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
    icon: Code,
    title: "Code Quality",
    description:
      "I write clean, maintainable code with comprehensive tests. Type safety and documentation are non-negotiable.",
  },
  {
    icon: Heart,
    title: "User-Centric",
    description:
      "Every technical decision starts with the user experience. Performance and accessibility are priorities.",
  },
  {
    icon: Briefcase,
    title: "Collaboration",
    description:
      "I thrive in team environments, value clear communication, and believe in continuous learning.",
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
                  <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
                    {item.title}
                  </h3>
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
          <div className="grid md:grid-cols-3 gap-6">
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

        {/* What I'm Looking For */}
        <section>
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-4">
            What I&apos;m Looking For
          </h2>
          <div className="prose-content">
            <p>
              I&apos;m interested in full-stack development roles where I can
              make a meaningful impact. I thrive in environments that value:
            </p>
            <ul>
              <li>Technical excellence and continuous improvement</li>
              <li>Collaborative, cross-functional teams</li>
              <li>Products that solve real problems for users</li>
              <li>Learning opportunities and professional growth</li>
            </ul>
            <p>
              Open to both remote and hybrid positions. Let&apos;s talk if you
              think we&apos;d be a good fit!
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
