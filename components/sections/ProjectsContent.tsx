'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ExternalLink, Github, X } from 'lucide-react'
import { projects, getAllTechnologies, type Project } from '@/data/projects'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'technology' | 'domain' | 'type' | 'status'

// Filter options
const domainOptions = [
  { value: 'web', label: 'Web' },
  { value: 'backend', label: 'Backend' },
  { value: 'ai-ml', label: 'AI/ML' },
  { value: 'devops', label: 'DevOps' },
  { value: 'mobile', label: 'Mobile' },
]

const typeOptions = [
  { value: 'professional', label: 'Professional' },
  { value: 'open-source', label: 'Open Source' },
  { value: 'personal', label: 'Personal' },
  { value: 'learning', label: 'Learning' },
]

const statusOptions = [
  { value: 'complete', label: 'Complete' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'archived', label: 'Archived' },
]

export function ProjectsContent() {
  const technologies = getAllTechnologies()
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<FilterType>('all')

  // Filter projects based on active filter
  const filteredProjects = useMemo(() => {
    if (!activeFilter || filterType === 'all') {
      return projects
    }

    switch (filterType) {
      case 'technology':
        return projects.filter((p) =>
          p.technologies.map((t) => t.toLowerCase()).includes(activeFilter.toLowerCase())
        )
      case 'domain':
        return projects.filter((p) => p.domain === activeFilter)
      case 'type':
        return projects.filter((p) => p.type === activeFilter)
      case 'status':
        return projects.filter((p) => p.status === activeFilter)
      default:
        return projects
    }
  }, [activeFilter, filterType])

  const handleTechFilter = (tech: string) => {
    if (activeFilter === tech && filterType === 'technology') {
      // Clear filter if clicking same tech
      setActiveFilter(null)
      setFilterType('all')
    } else {
      setActiveFilter(tech)
      setFilterType('technology')
    }
  }

  const handleDomainFilter = (domain: string) => {
    if (activeFilter === domain && filterType === 'domain') {
      setActiveFilter(null)
      setFilterType('all')
    } else {
      setActiveFilter(domain)
      setFilterType('domain')
    }
  }

  const handleTypeFilter = (type: string) => {
    if (activeFilter === type && filterType === 'type') {
      setActiveFilter(null)
      setFilterType('all')
    } else {
      setActiveFilter(type)
      setFilterType('type')
    }
  }

  const handleStatusFilter = (status: string) => {
    if (activeFilter === status && filterType === 'status') {
      setActiveFilter(null)
      setFilterType('all')
    } else {
      setActiveFilter(status)
      setFilterType('status')
    }
  }

  const handleAllFilter = () => {
    setActiveFilter(null)
    setFilterType('all')
  }

  const clearFilter = () => {
    setActiveFilter(null)
    setFilterType('all')
  }

  return (
    <div className="section">
      <div className="container-content">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            Projects
          </h1>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A collection of projects showcasing my skills in web development,
            from professional work to open-source contributions and personal experiments.
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* All Button */}
          <div className="flex justify-center">
            <button
              onClick={handleAllFilter}
              className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors',
                filterType === 'all'
                  ? 'bg-primary-500 text-white'
                  : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700'
              )}
              aria-pressed={filterType === 'all'}
            >
              All Projects ({projects.length})
            </button>
          </div>

          {/* Filter Groups */}
          <div className="grid md:grid-cols-3 gap-4">
            {/* Domain Filter */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Domain
              </h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by domain">
                {domainOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleDomainFilter(option.value)}
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      activeFilter === option.value && filterType === 'domain'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                    )}
                    aria-pressed={activeFilter === option.value && filterType === 'domain'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Type
              </h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by type">
                {typeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleTypeFilter(option.value)}
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      activeFilter === option.value && filterType === 'type'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                    )}
                    aria-pressed={activeFilter === option.value && filterType === 'type'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Status Filter */}
            <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
              <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Status
              </h3>
              <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by status">
                {statusOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusFilter(option.value)}
                    className={cn(
                      'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
                      activeFilter === option.value && filterType === 'status'
                        ? 'bg-primary-500 text-white'
                        : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                    )}
                    aria-pressed={activeFilter === option.value && filterType === 'status'}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Technology Filter */}
          <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-lg p-4">
            <h3 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
              Technology
            </h3>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects by technology">
              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => handleTechFilter(tech)}
                  className={cn(
                    'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    activeFilter === tech && filterType === 'technology'
                      ? 'bg-primary-500 text-white'
                      : 'bg-white dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-600'
                  )}
                  aria-pressed={activeFilter === tech && filterType === 'technology'}
                >
                  {tech}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Active Filter Indicator */}
        {activeFilter && (
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 dark:bg-primary-900/20 rounded-lg text-sm">
              <span className="text-neutral-600 dark:text-neutral-400">
                Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''} with
              </span>
              <Badge variant="primary">{activeFilter}</Badge>
              <button
                onClick={clearFilter}
                className="ml-2 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                aria-label="Clear filter"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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
              No projects found with the selected filter.
            </p>
            <button
              onClick={clearFilter}
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Clear filters
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <article
      className="card p-6 flex flex-col hover:shadow-lg transition-shadow"
    >
      {/* Status and Type Badges */}
      <div className="flex items-center gap-2 mb-4">
        <Badge
          variant={
            project.status === 'complete'
              ? 'success'
              : project.status === 'in-progress'
                ? 'warning'
                : 'default'
          }
        >
          {project.status === 'complete'
            ? 'Complete'
            : project.status === 'in-progress'
              ? 'In Progress'
              : 'Archived'}
        </Badge>
        <Badge variant="default">
          {project.type}
        </Badge>
      </div>

      {/* Title */}
      <h2 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
        <Link
          href={`/projects/${project.slug}`}
          className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
        >
          {project.title}
        </Link>
      </h2>

      {/* Summary */}
      <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-1">
        {project.summary}
      </p>

      {/* Meta */}
      {(project.duration || project.team) && (
        <div className="flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400 mb-4">
          {project.duration && <span>{project.duration}</span>}
          {project.team && (
            <span>
              {project.team === 'solo'
                ? 'Solo project'
                : `Team of ${project.teamSize || 'multiple'}`}
            </span>
          )}
        </div>
      )}

      {/* Technologies */}
      <div className="flex flex-wrap gap-2 mb-4">
        {project.technologies.slice(0, 4).map((tech) => (
          <Badge key={tech} variant="primary" size="sm">
            {tech}
          </Badge>
        ))}
        {project.technologies.length > 4 && (
          <Badge variant="default" size="sm">
            +{project.technologies.length - 4}
          </Badge>
        )}
      </div>

      {/* Links */}
      <div className="flex items-center gap-4 pt-4 border-t border-neutral-200 dark:border-neutral-700">
        <Link
          href={`/projects/${project.slug}`}
          className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
        >
          View Case Study
        </Link>
        {project.links.github && (
          <a
            href={project.links.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            aria-label={`View ${project.title} on GitHub`}
          >
            <Github className="w-5 h-5" />
          </a>
        )}
        {project.links.demo && (
          <a
            href={project.links.demo}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
            aria-label={`View ${project.title} live demo`}
          >
            <ExternalLink className="w-5 h-5" />
          </a>
        )}
      </div>
    </article>
  )
}
