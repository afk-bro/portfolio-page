"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { ExternalLink, Github, ChevronDown } from "lucide-react";
import { projects, getAllTechnologies, type Project } from "@/data/projects";
import { cn } from "@/lib/utils";

// Multi-criteria filter state
interface FilterState {
  technology: string | null;
  domain: string | null;
  type: string | null;
  status: string | null;
}

// URL parameter keys for filters
const FILTER_PARAMS = {
  technology: "tech",
  domain: "domain",
  type: "type",
  status: "status",
} as const;

// Filter options
const domainOptions = [
  { value: "web", label: "Web" },
  { value: "backend", label: "Backend" },
  { value: "ai-ml", label: "AI/ML" },
  { value: "devops", label: "DevOps" },
  { value: "mobile", label: "Mobile" },
];

const typeOptions = [
  { value: "professional", label: "Professional" },
  { value: "open-source", label: "Open Source" },
  { value: "personal", label: "Personal" },
  { value: "learning", label: "Learning" },
];

const statusOptions = [
  { value: "complete", label: "Complete" },
  { value: "in-progress", label: "In Progress" },
  { value: "archived", label: "Archived" },
];

// Status indicator config - using accent palette
const statusConfig = {
  complete: { label: "Complete", color: "bg-primary-500" },
  "in-progress": { label: "In Progress", color: "bg-primary-300" },
  archived: { label: "Archived", color: "bg-neutral-400" },
};

export function ProjectsContent() {
  const technologies = getAllTechnologies();
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Initialize filter state from URL parameters
  const getInitialFilters = useCallback((): FilterState => {
    return {
      technology: searchParams.get(FILTER_PARAMS.technology),
      domain: searchParams.get(FILTER_PARAMS.domain),
      type: searchParams.get(FILTER_PARAMS.type),
      status: searchParams.get(FILTER_PARAMS.status),
    };
  }, [searchParams]);

  // Multi-criteria filter state - each filter type is independent
  const [filters, setFilters] = useState<FilterState>(getInitialFilters);

  // Sync filters from URL when searchParams change (e.g., browser back/forward)
  useEffect(() => {
    setFilters(getInitialFilters());
  }, [getInitialFilters]);

  // Update URL when filters change
  const updateURL = useCallback(
    (newFilters: FilterState) => {
      const params = new URLSearchParams();

      if (newFilters.technology) {
        params.set(FILTER_PARAMS.technology, newFilters.technology);
      }
      if (newFilters.domain) {
        params.set(FILTER_PARAMS.domain, newFilters.domain);
      }
      if (newFilters.type) {
        params.set(FILTER_PARAMS.type, newFilters.type);
      }
      if (newFilters.status) {
        params.set(FILTER_PARAMS.status, newFilters.status);
      }

      const queryString = params.toString();
      const newURL = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(newURL, { scroll: false });
    },
    [pathname, router],
  );

  // Check if any filters are active
  const hasActiveFilters = Object.values(filters).some((v) => v !== null);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(
    (v) => v !== null,
  ).length;

  // Filter projects based on ALL active filters (AND logic)
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (
        filters.technology &&
        !project.technologies
          .map((t) => t.toLowerCase())
          .includes(filters.technology.toLowerCase())
      ) {
        return false;
      }
      if (filters.domain && project.domain !== filters.domain) {
        return false;
      }
      if (filters.type && project.type !== filters.type) {
        return false;
      }
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      return true;
    });
  }, [filters]);

  const handleFilter = (key: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [key]: filters[key] === value ? null : value,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  const clearFilters = () => {
    const newFilters = {
      technology: null,
      domain: null,
      type: null,
      status: null,
    };
    setFilters(newFilters);
    updateURL(newFilters);
  };

  return (
    <div className="section">
      <div className="container-content">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            Projects
          </h1>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Selected production-grade systems highlighting architecture
            decisions, testing strategy, and real-world engineering tradeoffs.
          </p>
        </div>

        {/* Collapsible Filter Panel */}
        <div className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                filtersOpen
                  ? "bg-primary-500 text-white"
                  : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700",
              )}
            >
              Refine projects
              {activeFilterCount > 0 && (
                <span className="inline-flex items-center justify-center w-5 h-5 text-xs rounded-full bg-white/20">
                  {activeFilterCount}
                </span>
              )}
              <ChevronDown
                className={cn(
                  "w-4 h-4 transition-transform",
                  filtersOpen && "rotate-180",
                )}
              />
            </button>
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Filter Panel Content */}
          {filtersOpen && (
            <div className="mt-4 p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-lg">
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Domain Filter */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                    Domain
                  </h3>
                  <div className="space-y-2">
                    {domainOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.domain === option.value}
                          onChange={() => handleFilter("domain", option.value)}
                          className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Type Filter */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                    Type
                  </h3>
                  <div className="space-y-2">
                    {typeOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.type === option.value}
                          onChange={() => handleFilter("type", option.value)}
                          className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Status Filter */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                    Status
                  </h3>
                  <div className="space-y-2">
                    {statusOptions.map((option) => (
                      <label
                        key={option.value}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={filters.status === option.value}
                          onChange={() => handleFilter("status", option.value)}
                          className="rounded border-neutral-300 text-primary-500 focus:ring-primary-500"
                        />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300">
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Technology Filter */}
                <div>
                  <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                    Technology
                  </h3>
                  <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                    {technologies.map((tech) => (
                      <button
                        key={tech}
                        onClick={() => handleFilter("technology", tech)}
                        className={cn(
                          "px-2 py-1 text-xs rounded transition-colors",
                          filters.technology === tech
                            ? "bg-primary-500 text-white"
                            : "bg-white dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600",
                        )}
                      >
                        {tech}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-6 text-center">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">
            {filteredProjects.length} project
            {filteredProjects.length !== 1 ? "s" : ""}
            {hasActiveFilters && " matching filters"}
          </span>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>

        {/* No results message */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              No projects found with the selected filters.
            </p>
            <button
              onClick={clearFilters}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project }: { project: Project }) {
  const status = statusConfig[project.status];

  return (
    <article className="card p-6 flex flex-col hover:shadow-lg transition-shadow relative">
      {/* Status indicator - top right, metadata styling */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5">
        <span className={cn("w-1.5 h-1.5 rounded-full", status.color)} />
        <span className="text-[10px] text-neutral-400 dark:text-neutral-500">
          {status.label}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2 pr-20">
        <Link
          href={`/projects/${project.slug}`}
          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {project.title}
        </Link>
      </h2>

      {/* Summary - why it matters */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-1">
        {project.summary}
      </p>

      {/* Highlights - one line of emphasis */}
      {project.highlights && project.highlights.length > 0 && (
        <p className="text-xs text-primary-600 dark:text-primary-400 font-medium mb-4">
          {project.highlights.join(" · ")}
        </p>
      )}

      {/* Soft metadata - text, not pills */}
      <div className="text-xs text-neutral-500 dark:text-neutral-400 space-y-1 mb-4">
        {project.team && (
          <p>
            {project.team === "solo"
              ? "Solo"
              : `Team of ${project.teamSize || "multiple"}`}
            {project.duration && ` · ${project.duration}`}
          </p>
        )}
        {/* Tech stack as inline text */}
        <p className="text-neutral-400 dark:text-neutral-500">
          {project.technologies.join(" · ")}
        </p>
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          Case Study → Architecture & Tradeoffs
        </Link>
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
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
            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            aria-label={`View ${project.title} live demo`}
          >
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </article>
  );
}
