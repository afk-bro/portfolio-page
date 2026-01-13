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
            <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
              TCS Canada
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Kelowna, BC · 2021 – 2023
            </p>
          </div>
          <div>
            <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
              WestGrid Canada
            </h4>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Kelowna, BC · 2020 – 2021
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Education">
        <div>
          <div className="flex items-baseline justify-between mb-1">
            <h4 className="font-medium text-neutral-900 dark:text-neutral-50">
              B.S. Computer Information Systems
            </h4>
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Okanagan College · Kelowna, BC · 2016 – 2020
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Certifications & Training">
        <ul className="text-sm space-y-2">
          <li>
            <span>Canadian Securities Course</span>
          </li>
        </ul>
      </CollapsibleSection>
    </div>
  );
}
