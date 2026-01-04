import { Code2, GitBranch, TestTube, Zap } from 'lucide-react'

const proofPoints = [
  {
    icon: TestTube,
    label: 'Test Coverage',
    value: '95%+',
    description: 'Comprehensive test suites',
  },
  {
    icon: GitBranch,
    label: 'CI/CD',
    value: 'Automated',
    description: 'Continuous integration',
  },
  {
    icon: Code2,
    label: 'TypeScript',
    value: 'Strict Mode',
    description: 'Full type safety',
  },
  {
    icon: Zap,
    label: 'Performance',
    value: '90+ Lighthouse',
    description: 'Optimized for speed',
  },
]

export function ProofStrip() {
  return (
    <section className="py-12 bg-neutral-100 dark:bg-neutral-800/50 border-y border-neutral-200 dark:border-neutral-700">
      <div className="container-content">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {proofPoints.map((point) => (
            <div
              key={point.label}
              className="flex flex-col items-center text-center"
            >
              <point.icon className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
              <div className="text-lg font-bold text-neutral-900 dark:text-neutral-50">
                {point.value}
              </div>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {point.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
