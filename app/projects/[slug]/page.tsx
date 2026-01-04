import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight, ExternalLink, Github, Clock, Users } from 'lucide-react'
import { projects, getProjectBySlug } from '@/data/projects'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { calculateReadingTime } from '@/lib/utils'

// Get related projects based on shared technologies or domain
function getRelatedProjects(currentProject: ReturnType<typeof getProjectBySlug>, limit: number = 2) {
  if (!currentProject) return []
  const otherProjects = projects.filter((p) => p.slug !== currentProject.slug)
  const scored = otherProjects.map((project) => {
    let score = 0
    if (project.domain === currentProject.domain) score += 5
    const sharedTechs = project.technologies.filter((tech) =>
      currentProject.technologies.map((t) => t.toLowerCase()).includes(tech.toLowerCase())
    )
    score += sharedTechs.length * 2
    if (project.type === currentProject.type) score += 1
    return { project, score, sharedTechs }
  })
  return scored.filter((item) => item.score > 0).sort((a, b) => b.score - a.score).slice(0, limit)
}

interface ProjectPageProps {
  params: { slug: string }
}

export function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export function generateMetadata({ params }: ProjectPageProps): Metadata {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    return {
      title: 'Project Not Found',
    }
  }

  return {
    title: project.title,
    description: project.summary,
    openGraph: {
      title: project.title,
      description: project.summary,
      type: 'article',
    },
  }
}

export default function ProjectPage({ params }: ProjectPageProps) {
  const project = getProjectBySlug(params.slug)

  if (!project) {
    notFound()
  }

  // Calculate reading time from case study content
  const caseStudyText = project.caseStudy
    ? Object.values(project.caseStudy).filter(v => typeof v === 'string').join(' ')
    : project.description
  const readingTime = calculateReadingTime(caseStudyText)

  // Get previous and next projects for navigation
  const currentIndex = projects.findIndex((p) => p.slug === params.slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  // Get related projects
  const relatedProjects = getRelatedProjects(project, 2)

  return (
    <article className="section">
      <div className="container-content max-w-4xl">
        {/* Back Link */}
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400 mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Projects
        </Link>

        {/* Header */}
        <header className="mb-12">
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
            <Badge variant="default">{project.domain}</Badge>
          </div>

          {/* Title */}
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            {project.title}
          </h1>

          {/* Summary */}
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-6">
            {project.summary}
          </p>

          {/* Meta Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{readingTime} min read</span>
            </div>
            {project.duration && (
              <span>Duration: {project.duration}</span>
            )}
            {project.team && (
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>
                  {project.team === 'solo'
                    ? 'Solo project'
                    : `Team of ${project.teamSize || 'multiple'}`}
                </span>
              </div>
            )}
          </div>

          {/* Technologies */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.technologies.map((tech) => (
              <Badge key={tech} variant="primary">
                {tech}
              </Badge>
            ))}
          </div>

          {/* Links */}
          <div className="flex items-center gap-4">
            {project.links.github && (
              <Button asChild variant="outline" size="sm">
                <a
                  href={project.links.github}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-4 h-4 mr-2" />
                  View Code
                </a>
              </Button>
            )}
            {project.links.demo && (
              <Button asChild size="sm">
                <a
                  href={project.links.demo}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Live Demo
                </a>
              </Button>
            )}
          </div>
        </header>

        {/* Case Study Content */}
        {project.caseStudy ? (
          <div className="prose-content">
            {/* Problem */}
            <section id="problem">
              <h2>The Problem</h2>
              <p>{project.caseStudy.problem}</p>
            </section>

            {/* Constraints */}
            {project.caseStudy.constraints && (
              <section id="constraints">
                <h3>Constraints</h3>
                <p>{project.caseStudy.constraints}</p>
              </section>
            )}

            {/* Solution */}
            <section id="solution">
              <h2>The Solution</h2>
              <p>{project.caseStudy.solution}</p>
            </section>

            {/* Architecture */}
            {project.caseStudy.architecture && (
              <section id="architecture">
                <h3>Architecture</h3>
                <p>{project.caseStudy.architecture}</p>
              </section>
            )}

            {/* Key Features */}
            <section id="features">
              <h2>Key Features</h2>
              <ul>
                {project.caseStudy.keyFeatures.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
            </section>

            {/* Tradeoffs */}
            {project.caseStudy.tradeoffs && (
              <section id="tradeoffs">
                <h2>Tradeoffs & Decisions</h2>
                <p>{project.caseStudy.tradeoffs}</p>
              </section>
            )}

            {/* Reflection */}
            {project.caseStudy.reflection && (
              <section id="reflection">
                <h2>What I&apos;d Do Differently</h2>
                <p>{project.caseStudy.reflection}</p>
              </section>
            )}
          </div>
        ) : (
          <div className="prose-content">
            <p>{project.description}</p>
          </div>
        )}

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <section id="related-projects" className="mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6">
              Related Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              {relatedProjects.map(({ project: relatedProject, sharedTechs }) => (
                <Link
                  key={relatedProject.id}
                  href={`/projects/${relatedProject.slug}`}
                  className="card p-6 hover:shadow-lg transition-shadow group"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Badge
                      variant={
                        relatedProject.status === 'complete'
                          ? 'success'
                          : relatedProject.status === 'in-progress'
                            ? 'warning'
                            : 'default'
                      }
                      size="sm"
                    >
                      {relatedProject.status === 'complete'
                        ? 'Complete'
                        : relatedProject.status === 'in-progress'
                          ? 'In Progress'
                          : 'Archived'}
                    </Badge>
                    <Badge variant="default" size="sm">
                      {relatedProject.domain}
                    </Badge>
                  </div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-50 mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                    {relatedProject.title}
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
                    {relatedProject.summary}
                  </p>
                  {sharedTechs.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {sharedTechs.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="primary" size="sm">
                          {tech}
                        </Badge>
                      ))}
                      {sharedTechs.length > 3 && (
                        <Badge variant="default" size="sm">
                          +{sharedTechs.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Project Navigation */}
        <nav className="flex items-center justify-between mt-16 pt-8 border-t border-neutral-200 dark:border-neutral-700">
          {prevProject ? (
            <Link
              href={`/projects/${prevProject.slug}`}
              className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <ArrowLeft className="w-4 h-4" />
              <div>
                <div className="text-xs uppercase tracking-wide">Previous</div>
                <div className="font-medium">{prevProject.title}</div>
              </div>
            </Link>
          ) : (
            <div />
          )}

          {nextProject ? (
            <Link
              href={`/projects/${nextProject.slug}`}
              className="flex items-center gap-2 text-right text-neutral-600 dark:text-neutral-400 hover:text-primary-600 dark:hover:text-primary-400"
            >
              <div>
                <div className="text-xs uppercase tracking-wide">Next</div>
                <div className="font-medium">{nextProject.title}</div>
              </div>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div />
          )}
        </nav>
      </div>
    </article>
  )
}
