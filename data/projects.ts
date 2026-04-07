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
    title: "Algo Trading Research Platform",
    slug: "trading-research",
    summary:
      "Multi-tenant RAG platform combining semantic knowledge retrieval, a backtesting engine, and a regime-aware analytics dashboard — built for trading research and strategy evaluation.",
    description:
      "A full-stack trading intelligence system that has grown well beyond a basic RAG pipeline. The backend is an async FastAPI service backed by Qdrant (vector search), Supabase PostgreSQL (76 migrations), and Redis — handling multi-source ingestion, two-stage retrieval with cross-encoder reranking, and workspace-isolated multi-tenancy. The backtesting engine supports grid/random parameter tuning, walk-forward optimization with IS/OOS splits, overfit detection, and a leaderboard. The React dashboard renders a regime-aware equity curve with alert pins and a RAG context drawer that surfaces why a trade was taken. Production ops include Prometheus alerting (28 rules across 10 subsystems), Sentry, structured logging, Telegram alerting with escalation, and auto-pause guardrails for critical drawdown events. 221 tests across unit, integration, and e2e suites with a CI pipeline running lint, type checking, and the full test suite.",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "TypeScript",
      "Qdrant",
      "PostgreSQL",
      "Supabase",
      "Redis",
      "Docker",
      "Ollama",
      "Prometheus",
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
      "221 tests with CI pipeline (lint, mypy, unit, integration)",
      "Two-stage retrieval: Qdrant vector search + cross-encoder reranking",
      "Backtest engine with walk-forward optimization and overfit detection",
      "Regime-aware equity dashboard with RAG-backed trade context",
      "28 Prometheus alerting rules across 10 subsystems",
    ],
    caseStudy: {
      problem:
        "Trading research is fragmented across YouTube videos, PDFs, Pine Scripts, and articles. Strategy development lacks systematic parameter tuning and overfit detection. And when something goes wrong in a live system, there's no clear answer to why a trade was taken.",
      solution:
        "Built a multi-tenant platform that connects knowledge retrieval, strategy research, and live monitoring into one system. Content is ingested, chunked, and embedded into Qdrant for semantic search. The backtesting engine supports rigorous parameter sweeps with walk-forward validation. The React dashboard surfaces regime context and RAG-retrieved reasoning alongside every trade event.",
      architecture:
        "Async FastAPI service with a layered architecture (routers → services → repositories). Qdrant for vector storage, Supabase PostgreSQL for relational data (76 migrations), Redis for caching and rate limiting. React SPA connects via REST and SSE. Docker Compose for local dev; Prometheus + Grafana for observability.",
      keyFeatures: [
        "Multi-source ingestion: YouTube transcripts, PDFs, Pine Script files, articles, and raw text",
        "Two-stage retrieval: Qdrant vector search with optional BGE cross-encoder reranking and neighbor expansion",
        "Backtest engine: grid/random parameter tuning, walk-forward optimization, IS/OOS splits with overfit detection, and leaderboard",
        "Regime-aware equity dashboard: colored regime bands, alert pins on timeline, RAG context drawer per trade",
        "Live SSE updates: KPI cards refresh automatically when the backend fires alert events",
        "Multi-tenant workspace isolation with per-workspace configuration",
        "Production ops: 28 Prometheus alerting rules, Sentry, structured logging, Telegram alerting with escalation, auto-pause on critical drawdown",
        "221 tests (unit + integration + e2e) with CI on every push",
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
  {
    id: "4",
    title: "Tiger English",
    slug: "tiger-english",
    summary:
      "AI-powered English learning platform for Thai speakers with interactive flashcards, XP progression, and a bilingual Thai/English interface.",
    description:
      "A full-stack English learning platform built for Thai speakers. Features AI-generated vocabulary flashcards, a gamified XP and level system, and a FastAPI backend that secures privileged Supabase operations. Fully bilingual with i18next-powered Thai/English support.",
    technologies: [
      "React",
      "TypeScript",
      "Vite",
      "FastAPI",
      "Python",
      "Supabase",
      "Tailwind CSS",
      "Zustand",
      "i18next",
    ],
    domain: "web",
    type: "personal",
    status: "in-progress",
    featured: true,
    order: 4,
    links: {
      github: "https://github.com/afk-bro/tiger-english",
    },
    team: "solo",
    highlights: ["AI flashcards", "Bilingual EN/TH", "XP system"],
    caseStudy: {
      problem:
        "Thai speakers learning English lack tools that meet them in their native language context with adaptive, engaging content that keeps them progressing.",
      solution:
        "Built a gamified full-stack platform with AI-generated flashcards, XP-based progression, and complete Thai/English i18n. A FastAPI backend keeps the Supabase service role key off the client.",
      keyFeatures: [
        "AI-generated vocabulary flashcards with contextual images and audio",
        "XP and level progression system with study streak tracking",
        "Full Thai/English bilingual interface via i18next",
        "Secure registration and auth flow through FastAPI backend",
        "Protected dashboard routes with Zustand-managed auth state",
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
