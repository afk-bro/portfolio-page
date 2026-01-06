"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function CollapsibleSection({
  title,
  children,
  defaultOpen = false,
}: CollapsibleSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 dark:border-neutral-700 last:border-b-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-4 text-left hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
      >
        <span className="font-medium text-neutral-900 dark:text-neutral-50">
          {title}
        </span>
        <ChevronDown
          className={cn(
            "w-5 h-5 text-neutral-400 transition-transform",
            isOpen && "rotate-180",
          )}
        />
      </button>
      {isOpen && (
        <div className="pb-6 text-neutral-600 dark:text-neutral-400">
          {children}
        </div>
      )}
    </div>
  );
}

export function ResumeDetails() {
  return (
    <div className="card p-6">
      <CollapsibleSection title="Experience History">
        <div className="space-y-6">
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                Senior Software Engineer
              </h4>
              <span className="text-sm text-neutral-500">2022 – Present</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Company Name
            </p>
            <ul className="text-sm space-y-1">
              <li>
                • Led development of customer-facing platform serving 100K+
                users
              </li>
              <li>
                • Established testing practices, improving coverage from 40% to
                90%
              </li>
              <li>
                • Designed and implemented CI/CD pipelines reducing deploy time
                by 60%
              </li>
            </ul>
          </div>
          <div>
            <div className="flex items-baseline justify-between mb-1">
              <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
                Software Engineer
              </h4>
              <span className="text-sm text-neutral-500">2020 – 2022</span>
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-2">
              Previous Company
            </p>
            <ul className="text-sm space-y-1">
              <li>
                • Built real-time data processing pipelines handling 1M+
                events/day
              </li>
              <li>
                • Migrated legacy systems to modern React/TypeScript stack
              </li>
              <li>• Mentored junior developers and conducted code reviews</li>
            </ul>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
              B.S. Computer Science
            </h4>
            <span className="text-sm text-neutral-500">2016 – 2020</span>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            University Name
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Certifications & Training">
        <ul className="text-sm space-y-2">
          <li className="flex items-baseline justify-between">
            <span>AWS Certified Solutions Architect</span>
            <span className="text-neutral-500">2023</span>
          </li>
          <li className="flex items-baseline justify-between">
            <span>Kubernetes Application Developer (CKAD)</span>
            <span className="text-neutral-500">2022</span>
          </li>
        </ul>
      </CollapsibleSection>
    </div>
  );
}
