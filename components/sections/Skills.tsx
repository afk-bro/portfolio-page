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
    <section className="section relative bg-sand-300/30 dark:bg-dark-surface">
      {/* Top fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-sand-50 dark:from-dark-base to-transparent"
      />
      {/* Bottom fade */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-b from-transparent to-sand-50 dark:to-dark-base"
      />
      <div className="container-content relative">
        {/* Section Header */}
        <AnimateOnScroll variant="fade-up" className="text-center mb-12">
          <h2 className="text-h2 text-ocean-800 dark:text-sand-500 mb-4">
            Skills & Technologies
          </h2>
          <p className="text-body text-ocean-300 dark:text-sand-500/75 max-w-2xl mx-auto mb-4">
            Technologies I work with daily and the expertise I bring to every project.
          </p>
          <p className="text-sm text-muted-400 dark:text-sand-500/60 italic max-w-xl mx-auto">
            I prioritize correctness, maintainability, and developer experience over novelty.
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
                <h3 className="text-h4 text-ocean-800 dark:text-sand-500 mb-4">
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
                              className="text-sm font-medium text-ocean-600 dark:text-sand-500/90 cursor-help"
                              tabIndex={0}
                            >
                              {skill.name}
                            </span>
                          </Tooltip>
                          <span className="text-xs text-muted-400 dark:text-sand-500/60">
                            {skill.years}y
                          </span>
                        </div>
                        {/* Proficiency Bar */}
                        <Tooltip
                          content={proficiencyConfig[skill.proficiency].label}
                          position="bottom"
                        >
                          <div
                            className="h-1.5 bg-ocean-100 dark:bg-ocean-800 rounded-full overflow-hidden cursor-help"
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
