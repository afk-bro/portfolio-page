import { Metadata } from 'next'
import { Download, FileText, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export const metadata: Metadata = {
  title: 'Resume',
  description: 'Download my resume and learn more about my professional experience and qualifications.',
  alternates: {
    canonical: '/resume',
  },
}

const resumeFormats = [
  {
    name: 'PDF',
    description: 'Best for viewing and printing',
    icon: FileText,
    href: '/resume/resume.pdf',
  },
]

export default function ResumePage() {
  // Last updated date - update this when you update your resume
  const lastUpdated = new Date('2024-01-15')

  return (
    <div className="section">
      <div className="container-content max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-h1 text-neutral-900 dark:text-neutral-50 mb-4">
            Resume
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 mb-4">
            A comprehensive overview of my professional experience and qualifications.
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <Calendar className="w-4 h-4" />
            <span>
              Last updated:{' '}
              {lastUpdated.toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        </div>

        {/* Download Options */}
        <div className="card p-8 mb-12">
          <h2 className="text-h3 text-neutral-900 dark:text-neutral-50 mb-6 text-center">
            Download Resume
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            {resumeFormats.map((format) => (
              <Button key={format.name} asChild size="lg">
                <a href={format.href} download>
                  <Download className="w-4 h-4 mr-2" />
                  Download {format.name}
                </a>
              </Button>
            ))}
          </div>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 text-center mt-4">
            Click to download the resume in your preferred format.
          </p>
        </div>

        {/* Resume Preview / Embedded Content */}
        <div className="card overflow-hidden">
          <div className="bg-neutral-100 dark:bg-neutral-800 px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
            <h2 className="text-h4 text-neutral-900 dark:text-neutral-50">
              Resume Preview
            </h2>
          </div>
          <div className="p-0">
            {/* Embedded PDF viewer */}
            <iframe
              src="/resume/resume.pdf"
              className="w-full h-[800px] border-0"
              title="Resume PDF Preview"
            />
          </div>
        </div>

        {/* ATS-Friendly Note */}
        <div className="mt-8 p-4 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Note for recruiters:</strong> The PDF version of my resume is
            ATS-friendly and contains all the same information in a machine-readable format.
          </p>
        </div>
      </div>
    </div>
  )
}
