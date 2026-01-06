import { z } from "zod";

// Zod schema for site metadata validation
export const siteMetadataSchema = z.object({
  name: z.string().min(1),
  title: z.string().min(1),
  role: z.string().min(1),
  bio: z.string().min(1),
  email: z.string().email(),
  location: z.string().min(1),
  availability: z.enum(["available", "limited", "unavailable"]),
  social: z.object({
    github: z.string().url(),
    linkedin: z.string().url(),
    twitter: z.string().url().optional(),
  }),
  siteUrl: z.string().url(),
});

export type SiteMetadata = z.infer<typeof siteMetadataSchema>;

// Site metadata - Update these values for your portfolio
export const siteMetadata: SiteMetadata = {
  name: "Your Name",
  title: "Full-Stack Developer",
  role: "Senior Full-Stack Engineer focused on scalable systems, testing, and automation",
  bio: "I build production-grade systems with strong guarantees. Schema-first data modeling, test-driven development, and automation-first workflows.",
  email: "hello@example.com",
  location: "San Francisco, CA",
  availability: "available",
  social: {
    github: "https://github.com/afk-bro",
    linkedin: "https://linkedin.com/in/yourusername",
    twitter: "https://twitter.com/yourusername",
  },
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
};

// Validate metadata at build time
siteMetadataSchema.parse(siteMetadata);
