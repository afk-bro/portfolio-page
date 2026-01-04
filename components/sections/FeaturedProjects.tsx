import Link from 'next/link'
import { ArrowRight, ExternalLink, Github } from 'lucide-react'
import { getFeaturedProjects } from '@/data/projects'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

export function FeaturedProjects() {
  const projects = getFeaturedProjects().slice(0, 3)

  return (
    <section className="section">
      <div className="container-content">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-4">
            Featured Projects
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            A selection of projects showcasing my technical skills and problem-solving approach.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="card p-6 flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* Status Badge */}
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
                {project.team === 'solo' ? (
                  <Badge variant="default">Solo</Badge>
                ) : (
                  <Badge variant="default">Team</Badge>
                )}
              </div>

              {/* Title */}
              <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-2">
                <Link
                  href={`/projects/${project.slug}`}
                  className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                >
                  {project.title}
                </Link>
              </h3>

              {/* Summary */}
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 flex-1">
                {project.summary}
              </p>

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
              <div className="flex items-center gap-3 pt-4 border-t border-neutral-200 dark:border-neutral-700">
                <Link
                  href={`/projects/${project.slug}`}
                  className="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                >
                  View Details
                  <ArrowRight className="w-4 h-4" />
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

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button asChild variant="outline">
            <Link href="/projects">
              View All Projects
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
