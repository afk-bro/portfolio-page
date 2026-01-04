import Link from 'next/link'
import { ArrowRight, Download, Sparkles } from 'lucide-react'
import { siteMetadata } from '@/data/metadata'
import { Button } from '@/components/ui/Button'

export function Hero() {
  return (
    <section className="section bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-900">
      <div className="container-content">
        <div className="max-w-3xl mx-auto text-center">
          {/* Availability Badge */}
          {siteMetadata.availability === 'available' && (
            <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full bg-success-50 dark:bg-success-500/10 text-success-600 dark:text-success-500 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              <span>Open to opportunities</span>
            </div>
          )}

          {/* Name */}
          <h1 className="text-h1 md:text-display text-neutral-900 dark:text-neutral-50 mb-4 text-balance">
            {siteMetadata.name}
          </h1>

          {/* Role */}
          <p className="text-h3 md:text-h2 text-primary-600 dark:text-primary-400 mb-6">
            {siteMetadata.role}
          </p>

          {/* Bio / Value Proposition */}
          <p className="text-body text-neutral-600 dark:text-neutral-400 mb-8 max-w-2xl mx-auto">
            {siteMetadata.bio}
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/projects">
                View Projects
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/resume">
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
