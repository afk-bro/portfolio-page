import Link from 'next/link'
import { Github, Linkedin, Mail } from 'lucide-react'
import { siteMetadata } from '@/data/metadata'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-neutral-100 dark:bg-neutral-800 border-t border-neutral-200 dark:border-neutral-700">
      <div className="container-content py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          {/* Brand and Copyright */}
          <div className="text-center md:text-left">
            <Link
              href="/"
              className="text-lg font-bold text-neutral-900 dark:text-neutral-50"
            >
              Portfolio
            </Link>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">
              &copy; {currentYear} All rights reserved.
            </p>
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href={siteMetadata.social.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="GitHub profile"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href={siteMetadata.social.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="LinkedIn profile"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href={`mailto:${siteMetadata.email}`}
              className="p-2 rounded-lg text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-50 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              aria-label="Send email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
