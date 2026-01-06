import { Hero } from '@/components/sections/Hero'
import { ProofStrip } from '@/components/sections/ProofStrip'
import { FeaturedProjects } from '@/components/sections/FeaturedProjects'
import { HowIBuild } from '@/components/sections/HowIBuild'
import { Skills } from '@/components/sections/Skills'
import { CallToAction } from '@/components/sections/CallToAction'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProofStrip />
      <FeaturedProjects />
      <HowIBuild />
      <Skills />
      <CallToAction />
    </>
  )
}
