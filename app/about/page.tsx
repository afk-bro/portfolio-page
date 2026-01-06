import { Metadata } from "next";
import { MapPin, Briefcase, Heart, Code } from "lucide-react";
import { siteMetadata } from "@/data/metadata";

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
    title: "Senior Full-Stack Developer",
    description:
      "Leading development of complex web applications and mentoring junior developers.",
  },
  {
    year: "2022",
    title: "Full-Stack Developer",
    description:
      "Built and maintained multiple production applications using React, Node.js, and cloud services.",
  },
  {
    year: "2020",
    title: "Frontend Developer",
    description:
      "Focused on creating responsive, accessible web interfaces with modern JavaScript frameworks.",
  },
  {
    year: "2018",
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

        {/* Profile Section */}
        <section className="mb-16">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Avatar Placeholder */}
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-4xl font-bold shrink-0">
              {siteMetadata.name.charAt(0)}
            </div>

            <div>
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
            </div>
          </div>
        </section>

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
