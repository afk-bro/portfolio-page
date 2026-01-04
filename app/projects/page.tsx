import { Metadata } from 'next'
import Link from 'next/link'
import { ExternalLink, Github } from 'lucide-react'
import { projects, getAllTechnologies } from '@/data/projects'
import { Badge } from '@/components/ui/Badge'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web development projects, including full-stack applications, open-source contributions, and personal experiments.',
}

export default function ProjectsPage() {
  const technologies = getAllTechnologies()

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

        {/* Filters (static for now, can be made interactive) */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <Badge variant="primary" className="cursor-pointer">All</Badge>
            {technologies.slice(0, 8).map((tech) => (
              <Badge key={tech} variant="default" className="cursor-pointer hover:bg-neutral-200 dark:hover:bg-neutral-600">
                {tech}
              </Badge>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
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
          ))}
        </div>
      </div>
    </div>
  )
}
