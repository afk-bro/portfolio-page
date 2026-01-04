import { Metadata } from 'next'
import { ProjectsContent } from '@/components/sections/ProjectsContent'

export const metadata: Metadata = {
  title: 'Projects',
  description: 'Explore my portfolio of web development projects, including full-stack applications, open-source contributions, and personal experiments.',
}

export default function ProjectsPage() {
  return <ProjectsContent />
}
