import { Suspense } from "react";
import { Metadata } from "next";
import { ProjectsContent } from "@/components/sections/ProjectsContent";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Explore my portfolio of web development projects, including full-stack applications, open-source contributions, and personal experiments.",
  alternates: {
    canonical: "/projects",
  },
};

// Loading fallback for projects content
function ProjectsLoading() {
  return (
    <div className="section">
      <div className="container-content">
        <div className="animate-pulse">
          <div className="h-10 bg-neutral-200 dark:bg-neutral-700 rounded w-48 mx-auto mb-4" />
          <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-96 mx-auto mb-12" />
          <div className="flex flex-wrap gap-2 justify-center mb-8">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="h-8 w-20 bg-neutral-200 dark:bg-neutral-700 rounded-full"
              />
            ))}
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="card p-6">
                <div className="h-6 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4 mb-4" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-full mb-2" />
                <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-5/6 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  <div className="h-6 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<ProjectsLoading />}>
      <ProjectsContent />
    </Suspense>
  );
}
