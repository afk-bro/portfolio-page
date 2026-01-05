'use client'

import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { siteMetadata } from '@/data/metadata'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'

export function CallToAction() {
  return (
    <section className="section">
      <div className="container-content">
        <AnimateOnScroll
          variant="fade-up"
          className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl p-8 md:p-12 text-center"
        >
          <h2 className="text-h2 text-white mb-4">
            Let&apos;s Build Something Great Together
          </h2>
          <p className="text-lg text-primary-100 mb-8 max-w-2xl mx-auto">
            I&apos;m always open to discussing new projects, creative ideas, or
            opportunities to be part of your vision.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              asChild
              variant="secondary"
              size="lg"
              className="bg-white text-primary-700 hover:bg-primary-50"
            >
              <Link href="/contact">
                Get In Touch
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white/10"
            >
              <a href={`mailto:${siteMetadata.email}`}>
                <Mail className="w-4 h-4 mr-2" />
                {siteMetadata.email}
              </a>
            </Button>
          </div>
        </AnimateOnScroll>
      </div>
    </section>
  )
}
