import { z } from "zod";

// Zod schema for project validation
export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1),
  slug: z.string().min(1),
  summary: z.string().min(1),
  description: z.string().min(1),
  technologies: z.array(z.string()).min(1),
  domain: z.enum(["web", "backend", "ai-ml", "devops", "mobile"]),
  type: z.enum(["professional", "open-source", "personal", "learning"]),
  status: z.enum(["complete", "in-progress", "archived"]),
  featured: z.boolean(),
  order: z.number(),
  links: z.object({
    github: z.string().url().optional(),
    demo: z.string().url().optional(),
  }),
  duration: z.string().optional(),
  team: z.enum(["solo", "team"]).optional(),
  teamSize: z.number().optional(),
  image: z.string().optional(),
  highlights: z.array(z.string()).optional(),
  caseStudy: z
    .object({
      problem: z.string(),
      constraints: z.string().optional(),
      solution: z.string(),
      architecture: z.string().optional(),
      keyFeatures: z.array(z.string()),
      tradeoffs: z.string().optional(),
      reflection: z.string().optional(),
    })
    .optional(),
});

export type Project = z.infer<typeof projectSchema>;

export const projects: Project[] = [
  {
    id: "1",
    title: "Trading RAG Pipeline",
    slug: "trading-rag",
    summary:
      "Local RAG system for finance and trading knowledge management with semantic search and optional LLM-powered synthesis.",
    description:
      "A retrieval-augmented generation system that ingests YouTube transcripts and documents through n8n orchestration, processes them via FastAPI, and enables semantic search with confidence scoring. Features graceful degradation when external LLM APIs are unavailable.",
    technologies: [
      "Python",
      "FastAPI",
      "Qdrant",
      "Supabase",
      "n8n",
      "Ollama",
      "Docker",
    ],
    domain: "ai-ml",
    type: "personal",
    status: "in-progress",
    featured: true,
    order: 1,
    links: {
      github: "https://github.com/afk-bro/trading-RAG",
    },
    team: "solo",
    highlights: [
      "Semantic search",
      "n8n orchestration",
      "Graceful degradation",
    ],
    caseStudy: {
      problem:
        "Trading knowledge is scattered across YouTube videos, articles, and notes. Finding relevant insights requires manually searching through hours of content.",
      solution:
        "Built a local RAG pipeline that ingests content via n8n workflows, chunks documents with token-aware processing, and enables semantic search with optional LLM synthesis.",
      keyFeatures: [
        "Document ingestion from multiple sources",
        "Token-aware chunking with timestamp preservation",
        "Vector-based semantic search with metadata filtering",
        "Backtest parameter tuning with grid/random search",
        "Admin dashboard with leaderboards",
      ],
    },
  },
  {
    id: "2",
    title: "Outdoor Management System",
    slug: "outdoor-management-system",
    summary:
      "Config-driven booking platform for campgrounds, RV parks, and marinas with calendar-first admin interface and self-service booking.",
    description:
      "A multi-tenant booking platform that adapts to diverse outdoor operations. Features a calendar-first admin interface for managing resources and a self-service booking wizard for customers, with organization-level data isolation via Row-Level Security.",
    technologies: [
      "Next.js",
      "React",
      "TypeScript",
      "Supabase",
      "Stripe",
      "Tailwind CSS",
      "Redis",
    ],
    domain: "web",
    type: "personal",
    status: "in-progress",
    featured: true,
    order: 2,
    links: {
      github: "https://github.com/afk-bro/outdoor-management-system",
    },
    team: "solo",
    highlights: ["Multi-tenant", "Stripe payments", "Calendar UI"],
    caseStudy: {
      problem:
        "Outdoor recreation businesses need flexible booking systems that can adapt to different resource types—campsites, RV spots, boat slips—without custom development.",
      solution:
        "Built a configuration-driven platform where operators define their resource types and booking rules, with automatic adaptation of terminology and workflows.",
      keyFeatures: [
        "Availability engine with date range evaluation",
        "Dynamic pricing engine with add-ons support",
        "Booking lifecycle management with status tracking",
        "Drag-and-drop calendar interface",
        "Multi-step booking wizard with Stripe integration",
      ],
    },
  },
  {
    id: "3",
    title: "The Watershed Campground",
    slug: "watershed-campground",
    summary:
      "Modern marketing site for a family-owned lakeside campground with perfect SEO score and WCAG AA accessibility.",
    description:
      "A production-ready website rebuild for a lakeside campground on Kootenay Lake, BC. Features immersive parallax hero sections, interactive photo gallery with keyboard navigation, and comprehensive accessibility support.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    domain: "web",
    type: "professional",
    status: "complete",
    featured: true,
    order: 3,
    links: {
      github: "https://github.com/afk-bro/watershed-campground",
    },
    team: "solo",
    highlights: ["SEO 100", "WCAG AA", "Parallax effects"],
    caseStudy: {
      problem:
        "A family-owned campground needed a modern web presence that would rank well in search and be accessible to all visitors, including those using assistive technologies.",
      solution:
        "Rebuilt the site with Next.js, implementing comprehensive SEO with structured data, Open Graph tags, and automatic sitemap generation. Ensured WCAG AA compliance throughout.",
      keyFeatures: [
        "Immersive hero with parallax and reduced-motion support",
        "Interactive lightbox gallery with keyboard navigation",
        "Structured data via JSON-LD for rich snippets",
        "Image optimization with AVIF/WebP formats",
        "Full screen reader support with ARIA labels",
      ],
    },
  },
];

// Validate all projects at build time
projects.forEach((project) => projectSchema.parse(project));

// Helper functions
export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function getFeaturedProjects(): Project[] {
  return projects.filter((p) => p.featured).sort((a, b) => a.order - b.order);
}

export function getProjectsByTechnology(tech: string): Project[] {
  return projects.filter((p) =>
    p.technologies.map((t) => t.toLowerCase()).includes(tech.toLowerCase()),
  );
}

export function getProjectsByDomain(domain: Project["domain"]): Project[] {
  return projects.filter((p) => p.domain === domain);
}

export function getProjectsByStatus(status: Project["status"]): Project[] {
  return projects.filter((p) => p.status === status);
}

export function getAllTechnologies(): string[] {
  const techs = new Set<string>();
  projects.forEach((p) => p.technologies.forEach((t) => techs.add(t)));
  return Array.from(techs).sort();
}
