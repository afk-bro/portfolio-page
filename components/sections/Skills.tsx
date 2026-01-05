'use client'

import { getGroupedSkills, categoryNames, proficiencyConfig } from '@/data/skills'
import { AnimateOnScroll } from '@/components/ui/AnimateOnScroll'
import { Tooltip } from '@/components/ui/Tooltip'

export function Skills() {
  const groupedSkills = getGroupedSkills()

  // Order of categories to display
  const categoryOrder = ['languages', 'frontend', 'backend', 'devops', 'ai-ml', 'tools'] as const

  // Track valid categories for staggered animation
  let validIndex = 0

  return (
    <section className="section bg-neutral-50 dark:bg-neutral-800/30">
      <div className="container-content">
        {/* Section Header */}
        <AnimateOnScroll variant="fade-up" className="text-center mb-12">
          <h2 className="text-h2 text-neutral-900 dark:text-neutral-50 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-body text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Technologies I work with daily and the expertise I bring to every project.
          </p>
        </AnimateOnScroll>

        {/* Skills Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categoryOrder.map((category) => {
            const skills = groupedSkills[category]
            if (!skills || skills.length === 0) return null

            const currentIndex = validIndex++

            return (
              <AnimateOnScroll
                key={category}
                variant="fade-up"
                delay={currentIndex * 100}
                className="card p-6"
              >
                <h3 className="text-h4 text-neutral-900 dark:text-neutral-50 mb-4">
                  {categoryNames[category]}
                </h3>
                <ul className="space-y-3">
                  {skills.map((skill) => (
                    <li key={skill.name} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <Tooltip
                            content={`${proficiencyConfig[skill.proficiency].label} - ${skill.years} ${skill.years === 1 ? 'year' : 'years'} experience`}
                            position="top"
                          >
                            <span
                              className="text-sm font-medium text-neutral-700 dark:text-neutral-300 cursor-help"
                              tabIndex={0}
                            >
                              {skill.name}
                            </span>
                          </Tooltip>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {skill.years}y
                          </span>
                        </div>
                        {/* Proficiency Bar */}
                        <Tooltip
                          content={proficiencyConfig[skill.proficiency].label}
                          position="bottom"
                        >
                          <div
                            className="h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden cursor-help"
                            tabIndex={0}
                          >
                            <div
                              className={`h-full ${proficiencyConfig[skill.proficiency].color} rounded-full`}
                              style={{
                                width: `${(proficiencyConfig[skill.proficiency].level / 4) * 100}%`,
                              }}
                            />
                          </div>
                        </Tooltip>
                      </div>
                    </li>
                  ))}
                </ul>
              </AnimateOnScroll>
            )
          })}
        </div>
      </div>
    </section>
  )
}
