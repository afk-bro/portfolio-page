import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navigation } from '@/components/sections/Navigation'
import { Footer } from '@/components/sections/Footer'
import { ThemeProvider } from '@/components/ThemeProvider'
import { BackToTop } from '@/components/ui/BackToTop'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { siteMetadata } from '@/data/metadata'

// JSON-LD structured data for Person schema
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: siteMetadata.name,
  jobTitle: siteMetadata.role,
  description: siteMetadata.bio,
  url: siteMetadata.siteUrl,
  email: `mailto:${siteMetadata.email}`,
  sameAs: [
    siteMetadata.social.github,
    siteMetadata.social.linkedin,
    ...(siteMetadata.social.twitter ? [siteMetadata.social.twitter] : []),
  ],
  address: {
    '@type': 'PostalAddress',
    addressLocality: siteMetadata.location,
  },
}

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
  title: {
    default: 'Portfolio | Full-Stack Developer',
    template: '%s | Portfolio',
  },
  description:
    'Full-stack developer specializing in building exceptional digital experiences. Explore my projects, skills, and professional journey.',
  keywords: ['developer', 'portfolio', 'full-stack', 'react', 'next.js', 'typescript'],
  authors: [{ name: 'Developer' }],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Developer Portfolio',
    title: 'Portfolio | Full-Stack Developer',
    description:
      'Full-stack developer specializing in building exceptional digital experiences.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Full-Stack Developer',
    description:
      'Full-stack developer specializing in building exceptional digital experiences.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* Preconnect hints for external resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="dns-prefetch" href="https://github.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ThemeProvider>
          <a
            href="#main-content"
            id="skip-link"
            className="skip-link"
          >
            Skip to content
          </a>
          <Navigation />
          <main id="main-content" className="flex-1" tabIndex={-1}>
            <ErrorBoundary>
              {children}
            </ErrorBoundary>
          </main>
          <Footer />
          <BackToTop />
        </ThemeProvider>
      </body>
    </html>
  )
}
