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

// Sample projects - Replace with your own
export const projects: Project[] = [
  {
    id: "1",
    title: "E-Commerce Platform",
    slug: "ecommerce-platform",
    summary:
      "A full-stack e-commerce solution with real-time inventory management and payment processing.",
    description:
      "Built a complete e-commerce platform from scratch, featuring product catalog, shopping cart, checkout flow, and admin dashboard.",
    technologies: [
      "React",
      "Next.js",
      "TypeScript",
      "PostgreSQL",
      "Stripe",
      "Tailwind CSS",
    ],
    domain: "web",
    type: "professional",
    status: "complete",
    featured: true,
    order: 1,
    links: {
      github: "https://github.com/username/ecommerce",
      demo: "https://ecommerce.example.com",
    },
    duration: "3 months",
    team: "solo",
    image: "/images/projects/ecommerce.png",
    highlights: ["Real-time sync", "Type-safe API", "E2E tested"],
    caseStudy: {
      problem:
        "Small businesses needed an affordable, customizable e-commerce solution that could handle real-time inventory across multiple sales channels.",
      constraints:
        "Must be cost-effective, handle 1000+ concurrent users, and integrate with existing inventory systems.",
      solution:
        "Built a Next.js application with server-side rendering for SEO, real-time inventory updates via WebSockets, and Stripe integration for payments.",
      architecture:
        "Next.js frontend, PostgreSQL database with Prisma ORM, Redis for caching and real-time updates, deployed on Vercel.",
      keyFeatures: [
        "Real-time inventory synchronization",
        "Multi-payment gateway support",
        "Admin dashboard with analytics",
        "Mobile-responsive design",
        "SEO-optimized product pages",
      ],
      tradeoffs:
        "Chose PostgreSQL over MongoDB for stronger data consistency, accepting slightly more complex schema migrations.",
      reflection:
        "Would implement GraphQL for more efficient data fetching in v2. The REST API works but can over-fetch data in some scenarios.",
    },
  },
  {
    id: "2",
    title: "AI Code Review Assistant",
    slug: "ai-code-review",
    summary:
      "An AI-powered tool that automatically reviews pull requests and suggests improvements.",
    description:
      "Developed an intelligent code review system using LLMs to analyze code changes, detect potential bugs, and suggest best practices.",
    technologies: ["Python", "FastAPI", "OpenAI", "GitHub API", "Docker"],
    domain: "ai-ml",
    type: "open-source",
    status: "in-progress",
    featured: true,
    order: 2,
    links: {
      github: "https://github.com/username/ai-reviewer",
    },
    duration: "2 months",
    team: "solo",
    highlights: ["LLM integration", "GitHub API", "Async processing"],
    caseStudy: {
      problem:
        "Code reviews are time-consuming and can miss subtle issues. Teams needed automated first-pass reviews to catch common problems.",
      solution:
        "Built a GitHub App that analyzes PRs using GPT-4, providing inline comments with explanations and suggested fixes.",
      keyFeatures: [
        "Automatic PR analysis on open",
        "Context-aware code suggestions",
        "Best practice enforcement",
        "Learning from team patterns",
      ],
    },
  },
  {
    id: "3",
    title: "DevOps Dashboard",
    slug: "devops-dashboard",
    summary:
      "Unified monitoring dashboard for CI/CD pipelines, deployments, and infrastructure health.",
    description:
      "Created a centralized dashboard that aggregates data from GitHub Actions, AWS, and Datadog to provide a single pane of glass for DevOps operations.",
    technologies: ["React", "Go", "GraphQL", "AWS", "Docker", "Kubernetes"],
    domain: "devops",
    type: "professional",
    status: "complete",
    featured: true,
    order: 3,
    links: {
      github: "https://github.com/username/devops-dash",
    },
    duration: "4 months",
    team: "team",
    teamSize: 3,
    highlights: ["GraphQL", "K8s native", "Real-time metrics"],
    caseStudy: {
      problem:
        "Engineers had to check multiple tools to understand deployment status and infrastructure health.",
      solution:
        "Built a unified dashboard with Go backend and React frontend that aggregates data from multiple sources via GraphQL.",
      keyFeatures: [
        "Real-time pipeline status",
        "Infrastructure health metrics",
        "Deployment history and rollback",
        "Alert management",
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
