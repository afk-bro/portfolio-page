import { z } from 'zod'

// Zod schema for skill validation
export const skillSchema = z.object({
  name: z.string().min(1),
  category: z.enum(['frontend', 'backend', 'devops', 'ai-ml', 'tools', 'languages']),
  proficiency: z.enum(['beginner', 'intermediate', 'advanced', 'expert']),
  years: z.number().min(0),
  featured: z.boolean(),
})

export type Skill = z.infer<typeof skillSchema>

// Skills data - Update these values for your portfolio
export const skills: Skill[] = [
  // Frontend
  { name: 'React', category: 'frontend', proficiency: 'expert', years: 5, featured: true },
  { name: 'Next.js', category: 'frontend', proficiency: 'expert', years: 3, featured: true },
  { name: 'TypeScript', category: 'languages', proficiency: 'expert', years: 4, featured: true },
  { name: 'Tailwind CSS', category: 'frontend', proficiency: 'advanced', years: 3, featured: true },
  { name: 'Vue.js', category: 'frontend', proficiency: 'intermediate', years: 2, featured: false },

  // Backend
  { name: 'Node.js', category: 'backend', proficiency: 'expert', years: 5, featured: true },
  { name: 'Python', category: 'languages', proficiency: 'advanced', years: 4, featured: true },
  { name: 'Go', category: 'languages', proficiency: 'intermediate', years: 2, featured: false },
  { name: 'PostgreSQL', category: 'backend', proficiency: 'advanced', years: 4, featured: true },
  { name: 'GraphQL', category: 'backend', proficiency: 'advanced', years: 3, featured: false },

  // DevOps
  { name: 'Docker', category: 'devops', proficiency: 'advanced', years: 4, featured: true },
  { name: 'Kubernetes', category: 'devops', proficiency: 'intermediate', years: 2, featured: false },
  { name: 'AWS', category: 'devops', proficiency: 'advanced', years: 4, featured: true },
  { name: 'CI/CD', category: 'devops', proficiency: 'advanced', years: 4, featured: false },

  // AI/ML
  { name: 'OpenAI API', category: 'ai-ml', proficiency: 'advanced', years: 2, featured: true },
  { name: 'LangChain', category: 'ai-ml', proficiency: 'intermediate', years: 1, featured: false },

  // Tools
  { name: 'Git', category: 'tools', proficiency: 'expert', years: 6, featured: false },
  { name: 'VS Code', category: 'tools', proficiency: 'expert', years: 5, featured: false },
]

// Validate all skills at build time
skills.forEach((skill) => skillSchema.parse(skill))

// Helper functions
export function getSkillsByCategory(category: Skill['category']): Skill[] {
  return skills.filter((s) => s.category === category)
}

export function getFeaturedSkills(): Skill[] {
  return skills.filter((s) => s.featured)
}

export function getSkillCategories(): Skill['category'][] {
  return Array.from(new Set(skills.map((s) => s.category)))
}

export function getGroupedSkills(): Record<Skill['category'], Skill[]> {
  return skills.reduce(
    (acc, skill) => {
      if (!acc[skill.category]) {
        acc[skill.category] = []
      }
      acc[skill.category].push(skill)
      return acc
    },
    {} as Record<Skill['category'], Skill[]>
  )
}

// Category display names
export const categoryNames: Record<Skill['category'], string> = {
  frontend: 'Frontend',
  backend: 'Backend',
  devops: 'DevOps',
  'ai-ml': 'AI & ML',
  tools: 'Tools',
  languages: 'Languages',
}

// Proficiency display config
export const proficiencyConfig: Record<
  Skill['proficiency'],
  { label: string; level: number; color: string }
> = {
  beginner: { label: 'Beginner', level: 1, color: 'bg-neutral-300' },
  intermediate: { label: 'Intermediate', level: 2, color: 'bg-primary-300' },
  advanced: { label: 'Advanced', level: 3, color: 'bg-primary-500' },
  expert: { label: 'Expert', level: 4, color: 'bg-primary-700' },
}
